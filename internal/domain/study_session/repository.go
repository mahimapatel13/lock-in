package study_session

import (
	"context"
	"time"

	uuid "github.com/google/uuid"
)

type Repository interface {
	// StartSession records the start time of the session in the db
	StartSession(ctx context.Context, userID uuid.UUID, startTime time.Time) error
	// GetStartTime return the most recent session started by the user
	GetStartTime(ctx context.Context, userID uuid.UUID) (*time.Time, error)
	// RecordSessionDetails records session details in database
	RecordSessionDetails(ctx context.Context, userID uuid.UUID, sessionDuration int, endTime time.Time) error
	SaveAndClearSession(ctx context.Context, userID uuid.UUID, minutes int, endTime time.Time, startTime time.Time)error

	GetAllSessions(ctx context.Context,userID uuid.UUID) ([]Session, error)


}