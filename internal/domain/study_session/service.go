package study_session

import (
	"context"
	"errors"
	"fmt"
	"lock-in/internal/domain/leaderboard"
	"lock-in/internal/domain/profile"
	"log"
	"time"

	uuid "github.com/google/uuid"
)

type service struct {
	repo Repository
	profileService profile.Service
	leaderboardService leaderboard.Service
}
type Service interface {
	StartSession(ctx context.Context, userID uuid.UUID, startTime time.Time) error
	RecordSession(ctx context.Context, userID uuid.UUID, endTime time.Time) error
}

func NewService(repo Repository, profileService profile.Service, leaderboardService leaderboard.Service) Service {
	return &service{
		repo: repo,
		profileService: profileService,
		leaderboardService: leaderboardService,
	}
}

func (s *service) CheckUser(ctx context.Context,userID uuid.UUID) error {
	log.Println("Checking if user exists....")

	user, err := s.profileService.GetUserByUUID(ctx, userID)

	if err != nil || user == nil{
		log.Println("User doesnt exist.. exiting")
		return err
	}

	log.Println("user founf..")
	return nil
}

func (s *service) StartSession(ctx context.Context, userID uuid.UUID, startTime time.Time) error {

	log.Println("Checking if user exists....")

	err := s.CheckUser(ctx, userID)

	if err != nil {
		log.Println("No user found for the uuid")
		return err
	}

	log.Println("starting session..")

	err = s.repo.StartSession(ctx, userID, startTime)

	if err != nil {
		log.Println(err.Error())
		return err
	}

	log.Println("succesfully started sess..")

	return nil
}

func (s *service) RecordSession(ctx context.Context, userID uuid.UUID, endTime time.Time) error {
    // 1. Fetch start time
    startTime, err := s.repo.GetStartTime(ctx, userID)
    if err != nil {
        return errors.New(fmt.Sprintf("no active session found: %v", err))
    }

    sessionDuration := endTime.Sub(*startTime)

    // 2. Define valid windows (minutes: min_duration, max_duration)
    validWindows := []struct {
        label int
        min   time.Duration
        max   time.Duration
    }{
        {25, 25 * time.Minute, 26 * time.Minute},
        {50, 50 * time.Minute, 51 * time.Minute},
        {90, 90 * time.Minute, 91 * time.Minute},
    }

    var matchedLabel int
    for _, w := range validWindows {
        if sessionDuration >= w.min && sessionDuration <= w.max {
            matchedLabel = w.label
            break
        }
    }

    if matchedLabel == 0 {
        return errors.New("session duration is not within valid pomodoro windows")
    }

    // 3. Record and Cleanup (Preferably inside a DB transaction)
    err = s.repo.SaveAndClearSession(ctx, userID, matchedLabel, endTime, *startTime)
    if err != nil {
        return err
    }

    // 4. Update Leaderboard
    return s.leaderboardService.UpdateLeaderboardRecord(ctx, userID, endTime, matchedLabel)
}
