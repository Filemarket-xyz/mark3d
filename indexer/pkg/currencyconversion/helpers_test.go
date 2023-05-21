package currencyconversion

import (
	"math/big"
	"testing"
)

func TestConvert(t *testing.T) {
	type args struct {
		rate  float64
		price string
	}
	tests := []struct {
		name string
		args args
		want *big.Float
	}{
		{
			name: "Succ",
			args: args{
				rate:  5.11111,
				price: "3000000000000000000",
			},
			want: big.NewFloat(15.33333),
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			price, ok := big.NewInt(0).SetString(tt.args.price, 10)
			if !ok {
				t.Error("not ok")
			}
			if got := Convert(tt.args.rate, price); got.Cmp(tt.want) != 0 {
				t.Errorf("Convert() = %v, want %v", got, tt.want)
			}
		})
	}
}
