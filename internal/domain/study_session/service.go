package study_session

import (
	"context"
	"log"
)

type service struct {
	repo Repository
}
type Service interface {
	RecordSession(ctx context.Context, session Session) error
}

func NewService(repo Repository) Service {
	return &service{
		repo: repo,
	}
}

// RecordSession records the study session details in the system
func (s *service) RecordSession(ctx context.Context, session Session) error {

	log.Println("Recording Session Details")

	// User exists, save the record
	err := s.repo.RecordSessionDetails(ctx, session)

	if err != nil {
		log.Println("Error in recording session details: ", err)
		return err
	}

	log.Println("Recorded Session Details successfully!")
	return nil
}
