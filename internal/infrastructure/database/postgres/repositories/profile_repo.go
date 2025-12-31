package repositories

import (
	"context"
	"lock-in/internal/domain/profile"
	"log"
    // "encoding/json"
	"github.com/google/uuid"
	"github.com/jackc/pgx"
	"github.com/jackc/pgx/v5/pgxpool"
)

type profileRepository struct{
    dbpool *pgxpool.Pool
}

func NewProfileRepository(dbpool *pgxpool.Pool) profile.Repository{
    return &profileRepository{
        dbpool: dbpool,
    }
}

func (r *profileRepository) RegisterUser(ctx context.Context, user profile.CreateUserRequest, pass []byte) error{

    _, err := r.dbpool.Exec(ctx,
        `INSERT INTO users(username, email, hashed_password) VALUES ($1, $2, $3)`,
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

    var pass []byte

    err := r.dbpool.QueryRow(ctx, "SELECT username, email, hashed_password, uuid FROM users where uuid = $1", id).Scan(
        &user.Username,
        &user.Email,
        pass,
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

    user.Password = string(pass)
    
    return &user, nil
}
func(r *profileRepository) GetUserByUsername(ctx context.Context, username string) (*profile.User, error){

    return nil, nil
}
func(r *profileRepository) GetUserByEmail(ctx context.Context, email string) (*profile.User, error){

    return nil, nil
}


