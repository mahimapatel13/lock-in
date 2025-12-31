package router

import (
	// "lock-in/internal/domain/email"
	"lock-in/internal/domain/study_room"
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

	// emailRepo := repositories.NewEmailRepository(emailWorker)
	// emailService := email.NewService(emailRepo)


	// profileRepo := repositories.NewProfileRepository(pool)
	// profileService := profile.NewService(profileRepo, emailService)
	

	studyRoomRepo := repositories.NewStudyRoomRepository()
	studyRoomService := study_room.NewService(studyRoomRepo)

	RegisterStudyRoomRoutes(v1, studyRoomService)
}