package realtime_notification

import (
	"github.com/gorilla/websocket"
	"net/http"
	"sync"
)

const (
	LastBlockNumberTopic = "last_block_number"
)

type Subscription struct {
	Client *websocket.Conn
	Topic  string
}

type RealTimeNotificationService struct {
	Upgrader websocket.Upgrader

	subscriptions   map[*Subscription]struct{}
	subscriptionsMu sync.RWMutex
}

func New() *RealTimeNotificationService {
	return &RealTimeNotificationService{
		Upgrader: websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
		subscriptions: make(map[*Subscription]struct{}),
	}
}

func (s *RealTimeNotificationService) AddSubscription(sub *Subscription) {
	s.subscriptionsMu.Lock()
	defer s.subscriptionsMu.Unlock()
	s.subscriptions[sub] = struct{}{}
}

func (s *RealTimeNotificationService) RemoveSubscription(sub *Subscription) {
	s.subscriptionsMu.Lock()
	defer s.subscriptionsMu.Unlock()
	delete(s.subscriptions, sub)
	if sub.Client != nil {
		sub.Client.Close()
	}
}

func (s *RealTimeNotificationService) BroadcastMessage(topic string, data []byte) {
	var subsToRemove []*Subscription

	s.subscriptionsMu.RLock()
	for sub := range s.subscriptions {
		if sub.Topic != topic {
			continue
		}
		if err := s.sendMessage(sub, data); err != nil {
			subsToRemove = append(subsToRemove, sub)
		}
	}
	s.subscriptionsMu.RUnlock()

	for _, subscription := range subsToRemove {
		s.RemoveSubscription(subscription)
	}
}

func (s *RealTimeNotificationService) sendMessage(sub *Subscription, data []byte) error {
	err := sub.Client.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		sub.Client.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
	}
	return err
}
