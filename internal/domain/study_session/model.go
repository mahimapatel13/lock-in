package study_session

import (
	"lock-in/internal/api/rest/response"
	"time"

	uuid "github.com/google/uuid"
)

type SessionType string

const (
	Focus SessionType = "Focus"
	Break SessionType = "Break"
)

// Session describer the details of a session
type Session struct {
	Type     SessionType
	UserID   uuid.UUID
	Duration uint32 // seconds
	Time     time.Time
}

func (s Session) ToResponse() response.SessionResponse {
	return response.SessionResponse{
		MinutesDuration: int(s.Duration),
		EndTime:         s.Time,
	}
}
