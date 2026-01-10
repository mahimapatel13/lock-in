package leaderboard

import "github.com/google/uuid"

type User struct {
	UserID   uuid.UUID
	Username string
}