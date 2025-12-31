package router

import (
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func RegisterProfileRoutes(
	r *gin.RouterGroup,
	pool *pgxpool.Pool,
	// emailService emailService,

) {

	// API versioning
	auth := r.Group("profile")
	{
		auth.POST("/register")
		auth.POST("/login")
		auth.GET("/user")
	}
}
