package leaderboard

import "github.com/google/uuid"

type User struct {
	UserID uuid.UUID
	Minutes int
	Rank int
}

type TopUser struct {
	Rank int
	Username string
	Minutes  int
}
