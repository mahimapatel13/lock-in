package study_room

import "context"

type Repository interface {
	RecordSessionDetails(ctx context.Context, session Session) error
}