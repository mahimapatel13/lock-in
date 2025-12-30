package router

import (
	"lock-in/internal/domain/study_room"

	"github.com/gin-gonic/gin"
	// "github.com/jackc/pgx/v5/pgxpool"
)

func RegisterRoutes(
	r *gin.Engine,
    // pool *pgxpool.Pool,

) {

    // API versioning
    v1 := r.Group("/api/v1")

	studyRoomService := study_room.NewService()

	RegisterStudyRoomRoutes(v1, studyRoomService)
}