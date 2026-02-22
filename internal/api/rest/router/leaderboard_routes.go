package router

import (
	"lock-in/internal/api/rest/handlers"
	"lock-in/internal/api/rest/middleware"
	"lock-in/internal/domain/leaderboard"

	"github.com/gin-gonic/gin"
)

func RegisterLeaderboardRoutes(
	r *gin.RouterGroup,
    leaderboardService leaderboard.Service,
    
) {

    h := handlers.NewLeaderboardHandler(leaderboardService)

    leaderboard := r.Group("/leaderboard")
    {
        leaderboard.POST("/top", middleware.JWTMiddleware(),h.GetTopUsers)
    }

}