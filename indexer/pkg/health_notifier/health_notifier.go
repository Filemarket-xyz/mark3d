package healthnotifier

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net/http"
)

type HealthNotifyer interface {
	Notify(context.Context, string) error
}

type TelegramHealthNotifier struct {
	Addr string
}

func (hn *TelegramHealthNotifier) Notify(ctx context.Context, text string) error {
	client := &http.Client{}
	url := fmt.Sprint("http://", hn.Addr, "/notify")

	// TODO: use sync.Pool
	reqBody := bytes.NewBufferString(text)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, reqBody)
	if err != nil {
		return fmt.Errorf("Failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "text/plain")

	resp, err := client.Do(req)
	if resp != nil {
		defer resp.Body.Close()
	}
	if err != nil {
		return fmt.Errorf("Failed to send req: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("non-OK HTTP status: %d (%s)", resp.StatusCode, body)
	}

	return nil
}
