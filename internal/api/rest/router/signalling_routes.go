package router

import (
    "github.com/gin-gonic/gin"
    // "github.com/jackc/pgx/v5/pgxpool"
    h "lock-in/internal/api/rest/handlers"
)

func RegisterSignallingRoutes(
	r *gin.RouterGroup,
	// pool *pgxpool.Pool,
){


    room := r.Group("/room")
    {
        room.GET("/create", h.CreateRoomRequest)
        room.GET("/join/:roomID", h.JoinRoomRequest)
    }


}