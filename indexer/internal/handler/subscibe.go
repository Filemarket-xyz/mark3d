package handler

import (
	"github.com/mark3d-xyz/mark3d/indexer/internal/service/realtime_notification"
	"net/http"
)

func (h *handler) subscribeToBlockNumber(w http.ResponseWriter, r *http.Request) {
	ws, err := h.realTimeNotificationService.Upgrader.Upgrade(w, r, nil)
	if err != nil {
		sendResponse(w, http.StatusInternalServerError, map[string]any{"message": err.Error()})
		return
	}
	h.realTimeNotificationService.AddSubscription(&realtime_notification.Subscription{
		Client: ws,
		Topic:  realtime_notification.LastBlockNumberTopic,
	})
}
