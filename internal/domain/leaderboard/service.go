package leaderboard

import (
	"context"
	"lock-in/internal/domain/profile"
	"log"
	"time"

	"github.com/google/uuid"
)

type service struct {
	repo Repository
    profileService profile.Service
}

type Service interface {
    UpdateLeaderboardRecord(ctx context.Context, userID uuid.UUID,time time.Time, minutes int)error
    GetTopUsersForDate(ctx context.Context ,time time.Time, userID uuid.UUID) ([]TopUser, error)
}

func NewService(repo Repository, profileService profile.Service) Service {
	return &service{
		repo: repo,
        profileService: profileService,
	}
}
func (s *service) GetTopUsersForDate(ctx context.Context ,time time.Time, userID uuid.UUID) ([]TopUser, error) {
    log.Println("Getting top users for date ",time)

    date := time.Format("2006-01-02")

    users, err := s.repo.GetTopUsersForDate(ctx, date)
    log.Println(users)

    if err != nil {
        log.Println("Error while getting top users for date: ",date)
        return nil, err
    }

    log.Println("Succesfully retrieved users for date ", date)
    
    userArray := make([]TopUser, 0)

    user, err := s.repo.GetRankOfUser(ctx, userID, date)
    var top TopUser
    top.Minutes = user.Minutes
    top.Rank = user.Rank

    if err != nil {
        if err.Error() != "no rows in result set"{
            log.Println("db error")
            return nil, err
        }
    }else{    
        u, err := s.profileService.GetUserByUUID(ctx, userID)

        if err != nil {
            log.Println("couldnt fetch user")
            return nil , err
        }

        top.Username = u.Username
        userArray = append(userArray, top)
    }

    
    for i := range users{
        user, err := s.profileService.GetUserByUUID(ctx, users[i].UserID)
        
        if err != nil {
            log.Println("Error getting user details for userid ", users[i])
            return nil, err
        }
        var topUser TopUser
        topUser.Rank = i+1;
        topUser.Minutes = users[i].Minutes
        topUser.Username = user.Username
        userArray = append(userArray, topUser)
    }

   
    
    log.Println(userArray)
    return userArray, nil
}
func (s *service) UpdateLeaderboardRecord(ctx context.Context, userID uuid.UUID,time time.Time, minutes int)error{
    log.Println("Updating leaderboard record for user ", userID)

    date := time.Format("2006-01-02")

    minutesFocused, err := s.repo.GetMinutesFocusedForUser(ctx,date, userID)

    if err != nil {
        if err.Error() == "no rows in result set" {

            log.Println("no exisitng record for user in leaderboard db")

            err := s.repo.InsertIntoLeaderboard(ctx, userID, minutes, date)
            if err != nil {
                log.Println("error while inserting record into ldrbrd db")
                return err
            }

            log.Println("Succesfully inserted record into ldrboard db")
            return nil

        }else {
            // db error
            log.Println("db error while getting minutes focused for user")
            return err
        }
    }

    //update minutes 
    minutes = minutes + *minutesFocused
    
    err = s.repo.UpdateMinutesFocusedForUser(ctx, date, userID, minutes)

    if err != nil {
        log.Println("db error while updating leaderboard record")
        return err
    }

    log.Println("Succesfully inserted record into ldrboard db")
    return nil

}
