package repositories

import (
	"context"
	"errors"
	"lock-in/internal/domain/study_session"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)


type studySessionRepository struct{
    pool *pgxpool.Pool
}

func NewStudySessionRepository(pool *pgxpool.Pool) study_session.Repository{
    return &studySessionRepository{
        pool: pool,
    }
}


// StartSession records the start time of the session in the db
func (r *studySessionRepository)StartSession(ctx context.Context, userID uuid.UUID, startTime time.Time) error{
    log.Println("starting session in db..")

    _, err := r.pool.Exec(ctx,
        `INSERT INTO study_schema.start_session (user_id, start_time) VALUES ($1, $2)`,
        userID,
        startTime,
    )

    if err != nil {
        log.Println("Error while inserting start time of session into db.")
        return err
    }

    log.Println("Succesfully inserted start time in db.")
    return nil
}

// GetStartTime return the most recent session started by the user
func (r *studySessionRepository)GetStartTime(ctx context.Context, userID uuid.UUID) (*time.Time, error){
    log.Println("getting start time from db..")

    var startTime time.Time

    err := r.pool.QueryRow(ctx, "SELECT start_time FROM study_schema.start_session WHERE user_id = $1 ORDER BY start_time DESC LIMIT 1", userID).Scan(
        &startTime,
    )

    if err != nil {
        log.Println("error in fetching the start time for user")
        return nil, err 
    }

    log.Println("succesfully fetched start time of session for user..")
    return &startTime, nil
}

func (r *studySessionRepository) SaveAndClearSession(ctx context.Context, userID uuid.UUID, minutes int, endTime time.Time, startTime time.Time)error{
    tx, err := r.pool.Begin(ctx)
    if err != nil {
        // Handle error
        log.Println("error while saving and clearing session ")
        return err
    }

    // Always defer rollback - it's safe to call after Commit
    defer tx.Rollback(ctx)

    // Execute operations within the transaction
    _, err = tx.Exec(ctx, 
        `INSERT INTO study_schema.study_session (user_id, session_duration , end_time) VALUES ($1, $2, $3)`,
        userID,
        minutes,
        endTime,
    )

    if err != nil {
        log.Println("Error while recording session");
        return err  // Deferred Rollback() will execute
    }


    _, err = tx.Exec(ctx, "DELETE FROM study_schema.start_session WHERE start_time=$1", startTime)

    if err != nil {
        log.Println("Error while deleting start record");
        return err  // Deferred Rollback() will execute
    }

    // Commit the transaction
    err = tx.Commit(ctx)
    if err != nil {
        return err  // Already rolled back if commit failed
    }

    return nil
}
func (r *studySessionRepository)GetAllSessions(ctx context.Context,userID uuid.UUID) ([]study_session.Session, error){
    log.Println("Getting all sessions for user ", userID, " from db")

    
    rows ,err := r.pool.Query(ctx, "SELECT session_duration, end_time FROM study_schema.study_session WHERE user_id = $1 ORDER BY end_time DESC LIMIT 20", &userID)
    
    if err != nil {
        log.Println("Failed to get all sessions")
        return nil, err
    }

    defer rows.Close()

    var sessions []study_session.Session

    for rows.Next(){
        var sess study_session.Session
        if err := rows.Scan(&sess.Duration,&sess.Time ); err != nil {
            log.Println("Failed to scan leaderboard row")
            return nil, err
        }

        sessions = append(sessions, sess)
    }

    if err := rows.Err(); err!= nil {
        log.Println("Error occured while iterating over records.")
        return nil, errors.New("Iteration error in db")
    }

    log.Println("succesfully fetched session records from session table")
    return sessions, nil

}

// RecordSessionDetails records session details in database
func (r *studySessionRepository)RecordSessionDetails(ctx context.Context, userID uuid.UUID, sessionDuration int, endTime time.Time) error{

    log.Println("recording session details in db..")
    
    _, err := r.pool.Exec(ctx,
        `INSERT INTO study_schema.study_session (user_id, session_duration , end_time) VALUES ($1, $2, $3)`,
        userID,
        sessionDuration,
        endTime,
    )

    if err != nil {
        log.Println("error while inserting sessions into db..")
        return err
    }

    log.Println("succesfully inserted study session details in db.")
    return nil
}

