package retry

import (
	"context"
	"errors"
	"fmt"
	"time"
)

var UnretryableErr = errors.New("unretryable error")

type FailedErr struct {
	Retries int
	Err     error
}

func (r *FailedErr) Error() string {
	return fmt.Sprintf("retry failed after %d retries, last error: %v", r.Retries, r.Err)
}

func (r *FailedErr) Unwrap() error {
	return r.Err
}

type RetryableFunc func(ctx context.Context, args ...any) (any, error)
type ConditionFunc func(err error, retryNumber int) bool

type Options struct {
	Fn              RetryableFunc
	FnArgs          []any
	RetryOnAnyError bool
	RetryMap        map[error]int
	RetryCondition  ConditionFunc
	Backoff         BackoffStrategy
	MaxElapsedTime  time.Duration
}

func OnErrors(ctx context.Context, opts Options) (any, error) {
	var lastErr error
	var retries int
	var res any

	deadline := time.Now().Add(opts.MaxElapsedTime)

	for {
		if opts.MaxElapsedTime > 0 && time.Now().After(deadline) {
			return nil, &FailedErr{Retries: retries, Err: lastErr}
		}

		var err error
		res, err = opts.Fn(ctx, opts.FnArgs...)
		if err == nil {
			break
		}

		if errors.Is(err, UnretryableErr) {
			return nil, err
		}

		shouldRetry := false
		maxRetries, ok := opts.RetryMap[err]
		if (ok && retries < maxRetries) ||
			(opts.RetryCondition != nil && opts.RetryCondition(err, retries)) ||
			opts.RetryOnAnyError {
			shouldRetry = true
		}

		if shouldRetry {
			retries++
			lastErr = err
			sleepDuration := opts.Backoff.Next()
			select {
			case <-ctx.Done():
				return nil, ctx.Err()
			case <-time.After(sleepDuration):
			}
		} else {
			return nil, &FailedErr{Retries: retries, Err: lastErr}
		}
	}

	return res, nil
}
