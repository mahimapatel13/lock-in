package repositories

import (
	"context"
	"lock-in/internal/domain/study_session"
	"log"
)


type studySessionRepository struct {

}

func NewStudySessionRepository() study_session.Repository {
    return &studySessionRepository{}
}


// RecordSessionDetails makes db entry for session details
func (r *studySessionRepository) RecordSessionDetails(ctx context.Context, session study_session.Session) error{
    log.Println("hihihih")
    return nil
}