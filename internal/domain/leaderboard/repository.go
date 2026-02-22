package leaderboard

import (
	"context"
	"github.com/google/uuid"
)

type Repository interface {
	InsertIntoLeaderboard(ctx context.Context, userID uuid.UUID, minutes int, date string) error
    GetMinutesFocusedForUser(ctx context.Context,date string, userID uuid.UUID) (*int,error) 
    UpdateMinutesFocusedForUser(ctx context.Context,date string, userID uuid.UUID,minutes int) error
    GetTopUsersForDate(ctx context.Context ,date string) ([]User, error)
    GetRankOfUser(ctx context.Context, userID uuid.UUID, date string)(User, error)
}