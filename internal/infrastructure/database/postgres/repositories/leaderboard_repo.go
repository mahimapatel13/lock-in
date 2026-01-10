package repositories

import (
	"context"
	"errors"
	"lock-in/internal/domain/leaderboard"
	"log"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type leaderboardRepository struct {
    pool *pgxpool.Pool 
}


func NewLeaderboardRepository(pool *pgxpool.Pool) leaderboard.Repository {
    return &leaderboardRepository{
        pool: pool,
    }
}

func(r *leaderboardRepository) InsertIntoLeaderboard(ctx context.Context, userID uuid.UUID, minutes int, date string)error{
    log.Println("Inserting into leaderboard")

    _, err := r.pool.Exec(ctx, "INSERT INTO leaderboard_schema.leaderboard (user_id, minutes_focused, leaderboard_date) VALUES ($1, $2, $3)", userID,minutes, date)

    if err != nil {
        log.Println("Error while inserting record into the leaderboard db")
        return err
    }

    log.Println("Succesfully inserted record into leaderboard table!")
    return nil
}

func (r *leaderboardRepository) GetTopUsersForDate(ctx context.Context, date string) ([]uuid.UUID, error){
    log.Println("Getting top user for date ", date, " from db")

    
    rows ,err := r.pool.Query(ctx, "SELECT user_id FROM leaderboard_schema.leaderboard WHERE leaderboard_date = $1 ORDER BY minutes_focused DESC LIMIT 20", &date)
    
    if err != nil {
        log.Println("Failed to get top user by date")
        return nil, err
    }

    defer rows.Close()

    var users []uuid.UUID

    for rows.Next(){
        var user uuid.UUID
        if err := rows.Scan(&user); err != nil {
            log.Println("Failed to scan leaderboard row")
            return nil, err
        }
        users = append(users, user)
    }

    if err := rows.Err(); err!= nil {
        log.Println("Error occured while iterating over leaderboard records.")
        return nil, errors.New("Iteration error in db")
    }

    log.Println("succesfully fetched users from leaderboard table")
    return users, nil

}

func (r *leaderboardRepository) GetMinutesFocusedForUser(ctx context.Context,date string, userID uuid.UUID) (*int,error) {
    log.Println("Getting minutes focused for user ", userID)

    var minutes int

    err := r.pool.QueryRow(ctx, "SELECT minutes_focused FROM leaderboard_schema.leaderboard WHERE user_id =$1 AND leaderboard_date = $2", userID,date).Scan(&minutes)

    if err != nil {
        log.Println("Failed to read minutes focused of user")
        return nil, err
    }

    log.Println("succesfully read minutes focused  ", minutes)

    return &minutes , nil
}
func (r *leaderboardRepository) UpdateMinutesFocusedForUser(ctx context.Context,date string, userID uuid.UUID,minutes int) error {
    log.Println("Updating minutes focused for user ", userID)

    _, err := r.pool.Exec(ctx,"UPDATE leaderboard_schema.leaderboard SET minutes_focused = $1 WHERE user_id = $2 AND leaderboard_date = $3",minutes, userID,date)

    if err != nil {
        log.Println("Failed to update minutes focused of user")
        return err
    }

    log.Println("succesfully updated leaderboard record to " ,minutes, " for user ", userID)
    return nil
}