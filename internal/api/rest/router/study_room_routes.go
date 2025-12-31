package router

import (
	"github.com/gin-gonic/gin"
	// "github.com/jackc/pgx/v5/pgxpool"
	"lock-in/internal/api/rest/handlers"
	"lock-in/internal/api/rest/middleware"
	"lock-in/internal/api/rest/request"
	"lock-in/internal/domain/study_room"
)

func RegisterStudyRoomRoutes(
	r *gin.RouterGroup,
    service study_room.Service,
	// pool *pgxpool.Pool,
){

    h := handlers.NewStudyRoomHandler(service)

    r.POST("/session", middleware.ReqValidate[request.RecordSessionRequest](), h.RecordSessionRequest)

    room := r.Group("/room")
    {
        room.POST("/create", h.CreateRoomRequest)
        room.GET("/join/:roomID", h.JoinRoomRequest)
    }    

}