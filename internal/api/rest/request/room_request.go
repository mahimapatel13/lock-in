package request

import (
	"github.com/gin-gonic/gin"
)

func GetReqBody[T any](c *gin.Context) T {
	val, _ := c.Get("reqBody")
	return val.(T)
}


type StartSessionRequest struct {
	StartTime string `json:"start_time" binding:"required"`
}
type RecordSessionRequest struct {
	EndTime string `json:"end_time" binding:"required"`
}