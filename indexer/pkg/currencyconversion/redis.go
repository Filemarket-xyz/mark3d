package currencyconversion

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/go-redis/redis/v8"
	"time"
)

type RedisExchangeRateCache struct {
	provider    CurrencyConversionProvider
	redisClient *redis.Client
	cacheTTL    time.Duration
}

func NewRedisExchangeRateCache(
	provider CurrencyConversionProvider,
	redisClient *redis.Client,
	cacheTTL time.Duration,
) *RedisExchangeRateCache {
	return &RedisExchangeRateCache{
		provider:    provider,
		redisClient: redisClient,
		cacheTTL:    cacheTTL,
	}
}

func (r *RedisExchangeRateCache) GetExchangeRate(ctx context.Context, from, to string) (float64, error) {
	cachedRate, err := r.getFromCache(ctx, from, to)
	if err == nil {
		return cachedRate, nil
	}

	return r.getLatestExchangeRate(ctx, from, to)
}

func (r *RedisExchangeRateCache) getLatestExchangeRate(ctx context.Context, from, to string) (float64, error) {
	rate, err := r.provider.GetExchangeRate(ctx, from, to)
	if err != nil {
		return 0, err
	}

	err = r.redisClient.Set(ctx, r.getRedisKey(from, to), rate, r.cacheTTL).Err()
	if err != nil {
		return 0, err
	}

	return rate, nil
}

func (r *RedisExchangeRateCache) getFromCache(ctx context.Context, from, to string) (float64, error) {
	val, err := r.redisClient.Get(ctx, r.getRedisKey(from, to)).Result()
	if err != nil {
		return 0, err
	}

	var rate float64
	err = json.Unmarshal([]byte(val), &rate)
	if err != nil {
		return 0, err
	}

	return rate, nil
}

func (r *RedisExchangeRateCache) getRedisKey(from, to string) string {
	return fmt.Sprintf("exchangerate:%s:%s", from, to)
}
