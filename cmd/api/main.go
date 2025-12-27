package main

import (
	// "fmt"
	"context"
	// "fmt"
	// "fmt"
	"lock-in/internal/api/rest/router"
	"lock-in/internal/api/rest/handlers"

	"lock-in/internal/domain/signalling"

	"os"
    "syscall"
    "os/signal"
	"time"

	// "log"
	"net/http"

	"log"

	"github.com/gin-gonic/gin"
	// "github.com/jackc/pgx/v5/pgxpool"
)

func main(){
    signalling.AllRooms.Init()


    // db, err := pgxpool.NewConfig()

    r := gin.New()
	r.Use(gin.Logger(), gin.Recovery())

	
	// Health check endpoint with database connectivity check
	r.GET("/health", func(c *gin.Context) {
		// Check database connectivity
		// if err := db.Ping(c.Request.Context()); err != nil {
		// 	c.JSON(http.StatusServiceUnavailable, gin.H{"status": "database unavailable", "error": err.Error()})
		// 	return
		// }
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	handlers.AllRooms.Init()
	go handlers.Broadcaster()

	// Register all routes
	router.RegisterRoutes(r)

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