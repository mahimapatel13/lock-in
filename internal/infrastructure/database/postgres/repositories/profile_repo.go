package repositories

import (
	"context"
	"lock-in/internal/domain/profile"
	"log"
	"time"

	// "encoding/json"
	"github.com/google/uuid"
	"github.com/jackc/pgx"
	"github.com/jackc/pgx/v5/pgxpool"
)

type profileRepository struct{
    pool *pgxpool.Pool
}

func NewProfileRepository(pool *pgxpool.Pool) profile.Repository{
    return &profileRepository{
        pool: pool,
    }
}

func (r *profileRepository) RegisterUser(ctx context.Context, user profile.CreateUserRequest, pass string) error{

    log.Println("Executing query in register user")
    _, err := r.pool.Exec(ctx,
        `INSERT INTO user_schema.users(username, email, hashed_password) VALUES ($1, $2, $3)`,
        user.Username, 
        user.Email, 
        pass,
    )

    if err != nil {
        log.Println("Error while inerting into db")
        return err
    }

    return nil
}

func(r *profileRepository) GetUserByUIID(ctx context.Context, id uuid.UUID) (*profile.User, error){
    
    var user profile.User


    err := r.pool.QueryRow(ctx, "SELECT username, email, hashed_password, uuid FROM user_schema.users where uuid = $1", id).Scan(
        &user.Username,
        &user.Email,
        &user.Password,
        &user.UUID,
    )

    if err != nil {
        if err == pgx.ErrNoRows {
            // No row found
            log.Printf("No rows with uuid: %v found", id)
            return nil, err
        } else {
            // Handle other errors
            log.Println("Error in retreiving user id with uuid: ", id)
            return nil, err
        }
    }
    
    return &user, nil
}
func(r *profileRepository) GetUserByUsername(ctx context.Context, username string) (*profile.User, error){
    var user profile.User

    err := r.pool.QueryRow(ctx, "SELECT username, email, hashed_password, uuid FROM user_schema.users where username = $1", username).Scan(
        &user.Username,
        &user.Email,
        &user.Password,
        &user.UUID,
    )

    if err != nil {
        if err == pgx.ErrNoRows {
            // No row found
            log.Printf("No rows with uuid: %v found", username)
            return nil, err
        } else {
            // Handle other errors
            log.Println("Error in retreiving user id with username: ", username)
            return nil, err
        }
    }
    
    return &user, nil
}

func(r *profileRepository) GetToken(ctx context.Context, refresh string) (*uuid.UUID, error){
    var uuid uuid.UUID

    log.Println("Getting token from db..")
    err := r.pool.QueryRow(ctx, "SELECT uuid FROM user_schema.refresh_tokens WHERE refresh_token=$1 AND expiration_date <", refresh, time.Now()).Scan(
        &uuid,
    )

    if err != nil {
        if err == pgx.ErrNoRows {
            // No row found
            log.Printf("No rows with hashed refresh: %v found in refresh token table", refresh)
            return nil, err
        } else {
            // Handle other errors
            log.Println("Error in retreiving user with hashed token:  ", refresh)
            return nil, err
        }
    }

    return &uuid, nil
}
func(r *profileRepository) GetUserByEmail(ctx context.Context, email string) (*profile.User, error){

    var user profile.User

    err := r.pool.QueryRow(ctx, "SELECT username, email, hashed_password, uuid FROM user_schema.users WHERE email = $1", email).Scan(
        &user.Username,
        &user.Email,
        &user.Password,
        &user.UUID,
    )

    if err != nil {
        if err == pgx.ErrNoRows {
            // No row found
            log.Printf("No rows with uuid: %v found", email)
            return nil, err
        } else {
            // Handle other errors
            log.Println("Error in retreiving user id with email: ", email)
            return nil, err
        }
    }

    
    return &user, nil
}




