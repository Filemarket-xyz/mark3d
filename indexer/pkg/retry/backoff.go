package retry

import (
	"math"
	"math/rand"
	"time"
)

type BackoffStrategy interface {
	Next() time.Duration
}

type ExponentialBackoff struct {
	InitialInterval time.Duration
	RandFactor      float64
	Multiplier      float64
	MaxInterval     time.Duration

	attempt   time.Duration
	totalTime time.Duration
}

func (b *ExponentialBackoff) Next() time.Duration {
	delay := float64(b.InitialInterval) * math.Pow(b.Multiplier, float64(b.attempt))
	jitter := rand.Float64() * b.RandFactor * float64(b.InitialInterval)
	delay += jitter
	delay = math.Min(delay, float64(b.MaxInterval))

	b.attempt++
	b.totalTime += time.Duration(delay)
	return time.Duration(delay)
}
