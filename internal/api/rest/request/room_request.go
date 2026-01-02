package request

import "github.com/gin-gonic/gin"

func GetReqBody[T any](c *gin.Context) T {
	val, _ := c.Get("reqBody")
	return val.(T)
}

type RecordSessionRequest struct {
	SessionType     string `json:"session_type" binding:"required,oneof=focus break"`
	SessionDuration int    `json:"session_duration" binding:"required,min=10"`
}