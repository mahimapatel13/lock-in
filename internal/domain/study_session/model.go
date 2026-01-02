package study_session

import (
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