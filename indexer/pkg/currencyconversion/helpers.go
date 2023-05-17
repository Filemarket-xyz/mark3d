package currencyconversion

import "math/big"

func Convert(rate float64, price *big.Int) *big.Float {
	floatVal := big.NewFloat(0).SetInt(price)
	floatVal.Quo(floatVal, big.NewFloat(1e18))
	floatVal.Mul(floatVal, big.NewFloat(rate))

	return floatVal
}
