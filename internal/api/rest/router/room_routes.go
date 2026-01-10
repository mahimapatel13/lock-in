package router

import (
	"github.com/gin-gonic/gin"
	// "github.com/jackc/pgx/v5/pgxpool"
	"lock-in/internal/api/rest/handlers"
	"lock-in/internal/api/rest/middleware"
	"lock-in/internal/api/rest/request"
	"lock-in/internal/domain/study_room"
	"lock-in/internal/domain/study_session"
	"lock-in/internal/domain/ticket_manager"
)

func RegisterRoomRoutes(
	r *gin.RouterGroup,
	roomService study_room.Service,
	sessionService study_session.Service,
	ticketService ticket_manager.Service,
	// pool *pgxpool.Pool,
) {

	h := handlers.NewRoomHandler(roomService, ticketService, sessionService)

	room := r.Group("/room")
	{
		room.POST("/create", middleware.JWTMiddleware(), h.CreateRoomRequest)
		room.POST("/verify/:roomID", middleware.JWTMiddleware(), h.VerifyRoom)
		room.POST("/ticket/:roomID", middleware.JWTMiddleware(), h.GenerateTicket)
		room.GET("/ws/:ticket", h.JoinRoomRequest)
	}

	session := r.Group("/session")
	{
		session.POST("/start", middleware.JWTMiddleware(), middleware.ReqValidate[request.StartSessionRequest](), h.StartSessionRequest)
		session.POST("/end", middleware.JWTMiddleware(), middleware.ReqValidate[request.RecordSessionRequest](), h.RecordSessionRequest)

	}

}
