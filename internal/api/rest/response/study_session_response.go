package response

import "time"

type SessionResponse struct {
	MinutesDuration int       `json:"duration_minutes"`
	EndTime  time.Time `json:"end_time"`
}

