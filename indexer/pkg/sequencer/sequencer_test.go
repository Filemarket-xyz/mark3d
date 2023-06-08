package sequencer

//func TestSeq(t *testing.T) {
//	client := redis.NewClient(&redis.Options{
//		Addr: "localhost:6379",
//	})
//	cfg := &Config{
//		KeyPrefix:     "sequencer.",
//		TokenIdTTL:    30 * time.Second,
//		CheckInterval: 30 * time.Second,
//	}
//	seq := New(cfg, client, map[string]int64{"1": 10, "2": 8})
//
//  // `curl "localhost/?address=1"`
//  // `curl -X POST "localhost/?address=1&tokenId=1"`
//	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
//		address := r.URL.Query().Get("address")
//
//		switch r.Method {
//		case http.MethodGet:
//			tokenId, err := seq.Acquire(r.Context(), address)
//			if err != nil {
//				http.Error(w, err.Error(), http.StatusInternalServerError)
//				return
//			}
//
//			json.NewEncoder(w).Encode(map[string]int64{"tokenId": tokenId})
//		case http.MethodPost:
//			tokenIdStr := r.URL.Query().Get("tokenId")
//			tokenId, _ := strconv.ParseInt(tokenIdStr, 10, 64)
//
//			if err := seq.DeleteTokenID(r.Context(), address, tokenId); err != nil {
//				http.Error(w, err.Error(), http.StatusInternalServerError)
//				return
//			}
//
//			json.NewEncoder(w).Encode(map[string]int64{"tokenId": tokenId})
//
//		default:
//			w.Write([]byte("ERror"))
//		}
//	})
//
//	if err := http.ListenAndServe(":8080", nil); err != nil {
//		log.Panic(err)
//	}
//}
