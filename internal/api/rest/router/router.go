package router

import (
	// "lock-in/internal/domain/email"
	"lock-in/internal/domain/email"
	"lock-in/internal/domain/leaderboard"
	"lock-in/internal/domain/profile"
	"lock-in/internal/domain/study_room"
	"lock-in/internal/domain/study_session"
	"lock-in/internal/domain/ticket_manager"

	// "lock-in/internal/domain/profile"

	"lock-in/internal/infrastructure/database/postgres/repositories"
	email_worker "lock-in/internal/worker/email"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func RegisterRoutes(
	r *gin.Engine,
    pool *pgxpool.Pool,
	emailWorker *email_worker.WorkerPool,
) {

    // API versioning
    v1 := r.Group("/api/v1")

	emailRepo := repositories.NewEmailRepository(emailWorker)
	emailService := email.NewService(emailRepo)

	profileRepo := repositories.NewProfileRepository(pool)
	profileService := profile.NewService(profileRepo, emailService)

	leaderboardRepo := repositories.NewLeaderboardRepository(pool)
	leaderboardService := leaderboard.NewService(leaderboardRepo, profileService)
	
	studySessionRepo := repositories.NewStudySessionRepository(pool)
	studySessionService := study_session.NewService(studySessionRepo, profileService, leaderboardService)

	studyRoomService := study_room.NewService()
	
	ticketService := ticket_manager.Newservice()

	RegisterRoomRoutes(v1, studyRoomService,  studySessionService, ticketService)
	RegisterProfileRoutes(v1, profileService)
	RegisterLeaderboardRoutes(v1,leaderboardService)
	RegisterSessionRoutes(v1, studySessionService)
}