package study_room

import "context"

type Repository interface {
	// RecordSessionDetails records session details in database
	RecordSessionDetails(ctx context.Context, session Session) error
}