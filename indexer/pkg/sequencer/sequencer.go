package sequencer

import (
	"context"
	"errors"
	"fmt"
	"github.com/go-redis/redis/v8"
	"log"
	"strconv"
	"sync"
	"time"
)

type Config struct {
	KeyPrefix     string
	TokenIdTTL    time.Duration
	CheckInterval time.Duration
}

type Sequencer struct {
	Cfg    *Config
	client *redis.Client

	lastCheck time.Time
	checkMu   sync.Mutex
}

func New(cfg *Config, client *redis.Client, initialAddresses map[string]int64) *Sequencer {
	// Populating sets
	for addr, idRange := range initialAddresses {
		key := fmt.Sprint(cfg.KeyPrefix, addr)
		if client.Exists(context.TODO(), key).Val() != 0 {
			log.Printf("set with this key already exists: %s", key)
			continue
		}
		for i := int64(0); i < idRange; i++ {
			err := client.SAdd(context.TODO(), key, i).Err()
			if err != nil {
				log.Fatalf("failed to append to Redis: %v", err)
			}
		}
	}

	return &Sequencer{
		Cfg:    cfg,
		client: client,
	}
}

func (s *Sequencer) Acquire(ctx context.Context, key string) (int64, error) {
	if s.Count(ctx, key) == 0 {
		return 0, fmt.Errorf("wrong address or set is empty")
	}

	if err := s.releaseTokens(ctx, key); err != nil {
		log.Println("failed to releaseTokens in sequencer: ", err)
	}
	tokenId, ok := s.popRandom(ctx, key)
	if !ok {
		return 0, fmt.Errorf("failed to get random")
	}

	timerKey := fmt.Sprintf("%s%s.timer.%d", s.Cfg.KeyPrefix, key, tokenId)
	if _, err := s.client.Get(ctx, timerKey).Result(); err == nil {
		log.Printf("shouldn't happen! `popRandom` returned tokenId, but timer for it exists. address: %s, id: %d", key, tokenId)
		return 0, fmt.Errorf("tokenId was already acquired, so timer for it exists")
	}

	expireAt := time.Now().Add(s.Cfg.TokenIdTTL).Unix()
	if _, err := s.client.Set(ctx, timerKey, expireAt, 0).Result(); err != nil {
		return 0, err
	}

	return tokenId, nil
}

func (s *Sequencer) DeleteTokenID(ctx context.Context, key string, tokenId int64) error {
	okQueue := s.deleteFromQueue(ctx, key, tokenId)
	okSet := s.deleteFromSet(ctx, key, tokenId)
	if !okSet && !okQueue {
		return fmt.Errorf("tokenId does not exists")
	}
	return nil
}

func (s *Sequencer) Count(ctx context.Context, key string) int64 {
	key = fmt.Sprint(s.Cfg.KeyPrefix, key)

	if err := s.releaseTokens(ctx, key); err != nil {
		log.Println("failed to releaseTokens in sequencer: ", err)
	}

	length, err := s.client.SCard(ctx, key).Result()
	if err != nil {
		return 0
	}

	return length
}

func (s *Sequencer) popRandom(ctx context.Context, address string) (int64, bool) {
	key := fmt.Sprint(s.Cfg.KeyPrefix, address)
	val, err := s.client.SPop(ctx, key).Result()
	if err != nil {
		if err == redis.Nil {
			log.Printf("empty set for address: %s", key)
			return 0, false
		}
		log.Println("redis SPop error")
		return 0, false
	}

	num, err := strconv.ParseInt(val, 10, 64)
	if err != nil {
		log.Println("failed to parse val from redis: ", val)
		return 0, false
	}

	return num, true
}

func (s *Sequencer) deleteFromSet(ctx context.Context, address string, tokenId int64) bool {
	key := fmt.Sprint(s.Cfg.KeyPrefix, address)
	val, err := s.client.SRem(ctx, key, tokenId).Result()
	if err != nil {
		return false
	}
	if val == 0 {
		return false
	}

	return true
}

func (s *Sequencer) releaseTokens(ctx context.Context, address string) error {
	s.checkMu.Lock()
	defer s.checkMu.Unlock()

	if time.Since(s.lastCheck) <= s.Cfg.CheckInterval {
		return nil
	}

	keyStr := fmt.Sprintf("%s%s.timer.*", s.Cfg.KeyPrefix, address)
	keys, err := s.client.Keys(ctx, keyStr).Result()
	if err != nil {
		return err
	}

	var globalErr error
	now := time.Now()
	nowUnix := now.Unix()
	for _, key := range keys {
		timestampStr, err := s.client.Get(ctx, key).Result()
		if err != nil {
			continue
		}

		timestamp, _ := strconv.ParseInt(timestampStr, 10, 64)

		if timestamp < nowUnix {
			padding := len(keyStr) - 1
			tokenIdStr := key[padding:]
			tokenId, err := strconv.ParseInt(tokenIdStr, 10, 64)
			if err != nil {
				globalErr = errors.Join(globalErr, err)
			}
			s.append(ctx, address, tokenId)
			if ok := s.deleteFromQueue(ctx, address, tokenId); !ok {
				globalErr = errors.Join(globalErr, fmt.Errorf("failed to delete key from redis: %s", key))
			}
		}
	}

	if globalErr != nil {
		return err
	}

	s.lastCheck = now

	return nil
}

func (s *Sequencer) append(ctx context.Context, address string, tokenId int64) {
	key := fmt.Sprint(s.Cfg.KeyPrefix, address)
	if err := s.client.SAdd(ctx, key, tokenId).Err(); err != nil {
		log.Printf("failed to append to Redis: %v", err)
		return
	}
}

func (s *Sequencer) deleteFromQueue(ctx context.Context, address string, tokenId int64) bool {
	key := fmt.Sprint(s.Cfg.KeyPrefix, address, ".timer.", tokenId)
	keysRemoved, err := s.client.Del(ctx, key).Result()
	if err != nil {
		log.Println("failed ot delete key from redis: ", key)
		return false
	}
	if keysRemoved < 1 {
		return false
	}
	return true
}
