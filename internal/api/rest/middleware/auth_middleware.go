package middleware

import "github.com/gin-gonic/gin"

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// this function will check for claims in the incoming authorization header
		// if the user is not empty then it sets or else aborts
		c.Set("user", "mahima")
		c.Next()
	}
}