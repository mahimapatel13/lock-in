package pgx_pool

import (
	"context"
	// "fmt"
	"lock-in/internal/config"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)


func NewConn(ctx context.Context, cfg config.DatabaseConfig) *pgxpool.Pool {
    
    // db, err := pgxpool.New(ctx, fmt.Sprintf("user=%v password=%v host=%v port=%v dbname=%v", cfg.User, cfg.Password,cfg.Host,cfg.Port, cfg.DatabaseName))

    db, err := pgxpool.New(ctx, cfg.DatabaseURL)
    if err != nil {
        log.Fatal(err)
    }
    if err != nil{
        log.Fatalf("Error connecting to database")
        return nil
    }

    return db
}