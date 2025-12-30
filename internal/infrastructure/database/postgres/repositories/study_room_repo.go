package repositories

import (
	"context"
	"lock-in/internal/domain/study_room"
)


type studyRoomRepository struct {

}

func NewStudyRoomRepository() study_room.Repository {
    return &studyRoomRepository{}
}


// RecordSessionDetails makes db entry for session details
func (r *studyRoomRepository) RecordSessionDetails(ctx context.Context, session study_room.Session) error{
    return nil
}