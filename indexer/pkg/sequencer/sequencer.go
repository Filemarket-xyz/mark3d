package sequencer

import (
	"context"
	"fmt"
	"github.com/go-redis/redis/v8"
	"log"
	"strconv"
	"time"
)

type Config struct {
	KeyPrefix  string
	TokenIdTTL time.Duration
}

type Sequencer struct {
	Cfg    *Config
	client *redis.Client
	timers map[string]map[int]*time.Timer
}

func New(cfg *Config, client *redis.Client, initialAddresses map[string]int) *Sequencer {
	// Populating sets
populateLoop:
	for addr, idRange := range initialAddresses {
		key := fmt.Sprint(cfg.KeyPrefix, addr)
		if client.Exists(context.TODO(), key).Val() != 0 {
			log.Printf("set with this key already exists: %s", key)
			break populateLoop
		}
		for i := 0; i < idRange; i++ {
			err := client.SAdd(context.TODO(), key, i).Err()
			if err != nil {
				log.Fatalf("failed to append to Redis: %v", err)
			}
		}
	}

	timers := make(map[string]map[int]*time.Timer)
	for addr := range initialAddresses {
		key := fmt.Sprint(cfg.KeyPrefix, addr)
		timers[key] = make(map[int]*time.Timer)
	}

	return &Sequencer{
		Cfg:    cfg,
		client: client,
		timers: timers,
	}
}

func (s *Sequencer) Acquire(ctx context.Context, address string) (int, error) {
	key := fmt.Sprint(s.Cfg.KeyPrefix, address)
	if s.Count(ctx, key) == 0 {
		return 0, fmt.Errorf("wrong address or set is empty")
	}

	id, ok := s.popRandom(ctx, key)
	if !ok {
		return 0, fmt.Errorf("failed to get random")
	}

	if t, _ := s.timers[key][id]; t != nil {
		return 0, fmt.Errorf("tokenId was already Acquired, so timer for it exists")
	}
	s.timers[key][id] = time.AfterFunc(s.Cfg.TokenIdTTL, func() {
		s.append(ctx, key, id)
		delete(s.timers[key], id)
	})

	return id, nil
}

func (s *Sequencer) DeleteTokenID(ctx context.Context, address string, tokenId int) error {
	key := fmt.Sprint(s.Cfg.KeyPrefix, address)
	okQueue := s.deleteFromQueue(key, tokenId)
	okSet := s.deleteFromSet(ctx, key, tokenId)
	if !okSet && !okQueue {
		return fmt.Errorf("tokenId does not exists")
	}
	return nil
}

func (s *Sequencer) Count(ctx context.Context, address string) int64 {
	key := fmt.Sprint(s.Cfg.KeyPrefix, address)
	length, err := s.client.SCard(ctx, key).Result()
	if err != nil {
		return 0
	}

	return length
}

func (s *Sequencer) popRandom(ctx context.Context, address string) (int, bool) {
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

	num, err := strconv.Atoi(val)
	if err != nil {
		log.Println("failed to parse val from redis: ", val)
		return 0, false
	}

	return num, true
}

func (s *Sequencer) deleteFromSet(ctx context.Context, address string, tokenId int) bool {
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

func (s *Sequencer) append(ctx context.Context, address string, num int) {
	key := fmt.Sprint(s.Cfg.KeyPrefix, address)
	if err := s.client.SAdd(ctx, key, num).Err(); err != nil {
		log.Printf("failed to append to Redis: %v", err)
		return
	}
}

func (s *Sequencer) deleteFromQueue(address string, tokenId int) bool {
	key := fmt.Sprint(s.Cfg.KeyPrefix, address)
	_, ok := s.timers[key]
	if !ok {
		return false
	}
	timer, ok := s.timers[key][tokenId]
	if !ok {
		return false
	}

	if !timer.Stop() {
		<-timer.C
	}
	delete(s.timers[key], tokenId)
	return true
}
