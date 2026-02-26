package router

import (
	"github.com/gin-gonic/gin"
	// "github.com/jackc/pgx/v5/pgxpool"
	"lock-in/internal/api/rest/handlers"
	"lock-in/internal/api/rest/middleware"
	"lock-in/internal/api/rest/request"
	"lock-in/internal/domain/study_session"
)

func RegisterSessionRoutes(
	r *gin.RouterGroup,
	sessionService study_session.Service,
) {

	h := handlers.NewSessionHandler(sessionService)


	session := r.Group("/session")
	{
		session.POST("/start", middleware.JWTMiddleware(), middleware.ReqValidate[request.StartSessionRequest](), h.StartSessionRequest)
		session.POST("/end", middleware.JWTMiddleware(), middleware.ReqValidate[request.RecordSessionRequest](), h.RecordSessionRequest)
		session.GET("/all", middleware.JWTMiddleware(), h.GetAllSessions)
	}

}
