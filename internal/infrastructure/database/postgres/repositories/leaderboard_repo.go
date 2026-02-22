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
func(r *leaderboardRepository) GetRankOfUser(ctx context.Context, userID uuid.UUID, date string)(leaderboard.User, error){

     tx, err := r.pool.Begin(ctx)
    if err != nil {
        // Handle error
        log.Println("error while saving and clearing session ")
        return leaderboard.User{ },err
    }

    // Always defer rollback - it's safe to call after Commit
    defer tx.Rollback(ctx)

//     // Execute operations within the transaction
//     _, err = tx.Exec(ctx, 
//         `INSERT INTO study_schema.study_session (user_id, session_duration , end_time) VALUES ($1, $2, $3)`,
//         userID,
//         minutes,
//         endTime,
//     )

//     if err != nil {
//         log.Println("Error while recording session");
//         return err  // Deferred Rollback() will execute
//     }


//     _, err = tx.Exec(ctx, "DELETE FROM study_schema.start_session WHERE start_time=$1", startTime)

//     if err != nil {
//         log.Println("Error while deleting start record");
//         return err  // Deferred Rollback() will execute
//     }

//     // Commit the transaction
//     err = tx.Commit(ctx)
//     if err != nil {
//         return err  // Already rolled back if commit failed
//     }

//     return nil
// }
    log.Println("Getting rank of user..")
    var user leaderboard.User

    err = tx.QueryRow(ctx,
        `WITH RankedLeaderboard AS (
            SELECT 
                user_id, 
                minutes_focused,
                RANK() OVER (ORDER BY minutes_focused DESC) as user_rank
            FROM leaderboard_schema.leaderboard
            WHERE leaderboard_date = $1
        )
        SELECT user_rank, minutes_focused
        FROM RankedLeaderboard
        WHERE user_id = $2
        `, 
    date,userID).Scan(&user.Rank, &user.Minutes)

    if err != nil {
        if err.Error()=="no rows in result set"{
            var rank int
            err := tx.QueryRow(ctx,"SELECT COUNT(*) FROM leaderboard_schema.leaderboard WHERE leaderboard_date=$1", date).Scan(&rank)

            if err != nil {
                if err.Error() != "no rows in result set"{
                    log.Println("db error")
                    return leaderboard.User{}, nil
                }
            }

            rank = rank+1
            var user leaderboard.User
            user.Rank =rank
            user.Minutes = 0
            user.UserID = userID

            return user, nil

        }else{
            log.Println("db error while finding rank of user")
            return leaderboard.User{}, nil
        }
    }

    return user, nil

}
func (r *leaderboardRepository) GetTopUsersForDate(ctx context.Context, date string) ([]leaderboard.User, error){
    log.Println("Getting top user for date ", date, " from db")

    
    rows ,err := r.pool.Query(ctx, "SELECT user_id, minutes_focused FROM leaderboard_schema.leaderboard WHERE leaderboard_date = $1 ORDER BY minutes_focused DESC LIMIT 20", &date)
    
    if err != nil {
        log.Println("Failed to get top user by date")
        return nil, err
    }

    defer rows.Close()

    var users []leaderboard.User

    for rows.Next(){
        var user leaderboard.User
        if err := rows.Scan(&user.UserID,&user.Minutes ); err != nil {
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