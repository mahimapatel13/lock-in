package main

import (
	// "fmt"
	"context"
	// "fmt"
	// "fmt"
	// "fmt"
	"lock-in/internal/api/rest/auth"
	// "lock-in/internal/api/rest/handlers"
	"lock-in/internal/api/rest/router"
	"lock-in/internal/config"

	// "lock-in/internal/domain/email"
	// "lock-in/internal/domain/study_room"
	// "lock-in/internal/infrastructure/database/postgres/repositories"
	"lock-in/internal/infrastructure/database/postgres/pgx"

	"lock-in/internal/worker/email"

	"os"
	"os/signal"
	"syscall"
	"time"

	// "log"
	"net/http"

	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	// "golang.org/x/crypto/bcrypt"
	// "github.com/jackc/pgx/v5/pgxpool"
)

func main(){


	log.Println("Reading .env")
	cfg := config.LoadEnv()
	emailWorker := email_worker.NewEmailWorkerPool(cfg.SMTPConfig)
	log.Println(cfg)


	for w := 1; w <= 3; w++ {
        go emailWorker.Worker(w)
    }

	ctx := context.Background()

    db := pgx_pool.NewConn(ctx, cfg.DatabaseConfig)	

    r := gin.New()
	r.Use(gin.Logger(), gin.Recovery())

	r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:5173"},
        AllowMethods:     []string{"POST", "GET", "OPTIONS", "PUT", "DELETE"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        // CRITICAL: This allows your Interceptor to read the token!
        ExposeHeaders:    []string{"Authorization"}, 
        AllowCredentials: true,
        MaxAge:           12 * time.Hour,
    }))

	
	// Health check endpoint with database connectivity check
	r.GET("/health", func(c *gin.Context) {
		// Check database connectivity
		if err := db.Ping(c.Request.Context()); err != nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{"status": "database unavailable", "error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	auth.AuthInit(cfg.JWTConfig)

	// Register all routes
	router.RegisterRoutes(r,db, &emailWorker)

    // Configure server with timeouts
	srv := &http.Server{
		Addr:         ":8080",
		Handler:      r,
		ReadTimeout:  time.Duration(10) * time.Second,
		WriteTimeout: time.Duration(10) * time.Second,
		IdleTimeout:  time.Duration(10) * time.Second,
	}

	// Create a server context for graceful shutdown
	serverCtx, serverStopCtx := context.WithCancel(context.Background())

    log.Println("server")

    quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	
	
	// Start server in a goroutine
	go func() {
		log.Println("Server starting", "port", 8080)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("Server failed to start", "error", err)
		}
		serverStopCtx()
	}()

    
	// Wait for shutdown signal
	select {
	case <-quit:
		log.Println("Shutdown signal received...")
	case <-serverCtx.Done():
		log.Println("Server stopped...")
	}

	// Create a deadline for shutdown
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), time.Duration(10)*time.Second)
	defer shutdownCancel()

	// Shutdown the server
	log.Println("Shutting down server...")
	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Fatal("Server forced to shutdown", "error", err)
	}

	log.Println("Server exited properly")

    
}