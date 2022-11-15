package now

import "time"

var now = time.Now

func Now() time.Time {
	return now()
}

func SetNow(f func() time.Time) {
	now = f
}
