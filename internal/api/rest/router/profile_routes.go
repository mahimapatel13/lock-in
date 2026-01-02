package router

import (
	"lock-in/internal/api/rest/handlers"
	"lock-in/internal/api/rest/middleware"
	"lock-in/internal/api/rest/request"
	"lock-in/internal/domain/profile"

	"github.com/gin-gonic/gin"
)

func RegisterProfileRoutes(
	r *gin.RouterGroup,
	profileService profile.Service,

) {
	h := handlers.NewProfileHandler(profileService)

	// API versioning
	auth := r.Group("auth")
	{
		auth.POST("/register", middleware.ReqValidate[request.RegisterUserRequest](), h.RegisterUser)
		auth.POST("/login", middleware.ReqValidate[request.LoginRequest](), h.Login)
		auth.POST("/refresh", h.Refresh)
	}

	profile := r.Group("profile")
	{
		profile.GET("/user", middleware.JWTMiddleware(), h.GetUser)

	}
}
