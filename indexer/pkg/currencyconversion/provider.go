package currencyconversion

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
)

type CurrencyConversionProvider interface {
	GetExchangeRate(ctx context.Context, from, to string) (float64, error)
}

type Quote struct {
	Price float64 `json:"price"`
}

type QuoteLatest struct {
	ID     float64          `json:"id"`
	Name   string           `json:"name"`
	Symbol string           `json:"symbol"`
	Slug   string           `json:"slug"`
	Quote  map[string]Quote `json:"quote"`
}

type coinMarketCapResponse struct {
	Data   map[string][]QuoteLatest `json:"data"`
	Status map[string]any           `json:"status"`
}

type CoinMarketCapProvider struct {
	apiKey string
	client *http.Client
}

func NewCoinMarketCapProvider(apiKey string) *CoinMarketCapProvider {
	return &CoinMarketCapProvider{
		apiKey: apiKey,
		client: &http.Client{},
	}
}

func (c *CoinMarketCapProvider) GetExchangeRate(ctx context.Context, from, to string) (float64, error) {
	url := fmt.Sprintf("https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=%s&convert=%s", from, to)
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return 0, err
	}

	req.Header.Set("X-CMC_PRO_API_KEY", c.apiKey)
	req.Header.Set("Accept", "application/json")
	resp, err := c.client.Do(req)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return 0, errors.New("failed to fetch exchange rate from CoinMarketCap")
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return 0, err
	}

	var data coinMarketCapResponse
	err = json.Unmarshal(body, &data)
	if err != nil {
		return 0, err
	}

	if latestQuoteArr, ok := data.Data[from]; ok {
		quoteArr := latestQuoteArr[0].Quote
		if quote, ok := quoteArr[to]; ok {
			return quote.Price, nil
		}
	}

	return 0, errors.New("exchange rate not found")
}
