package router

import (
	"github.com/gin-gonic/gin"
	// "github.com/jackc/pgx/v5/pgxpool"

)

func RegisterRoutes(
	r *gin.Engine,
    // pool *pgxpool.Pool,

) {

    // API versioning
    v1 := r.Group("/api/v1")

	RegisterSignallingRoutes(v1)
}