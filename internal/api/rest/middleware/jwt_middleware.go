package middleware

import (
	"errors"
	"fmt"
	"strings"

	"lock-in/internal/api/rest/auth"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func JWTWithRefresh() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        
        // 1. Safety check for "Bearer <token>"
        if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
            c.AbortWithStatusJSON(401, gin.H{"error": "Authorization header required and must start with Bearer"})
            return
        }

        tokenString := strings.TrimPrefix(authHeader, "Bearer ")

        // 2. Parse with CustomClaims
        claims := &auth.CustomClaims{}
        token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
            // Ensure signing method is HMAC (security best practice)
            if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
                return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
            }
            return []byte(auth.GetSecret()), nil
        })

        // 3. Handle Expiration vs Invalidity
        if err != nil {
            if errors.Is(err, jwt.ErrTokenExpired) {
                // Return 401 but with a hint that it's specifically an expiry issue
                c.AbortWithStatusJSON(401, gin.H{"error": "token_expired", "message": "Please refresh your token"})
                return
            }
            c.AbortWithStatusJSON(401, gin.H{"error": "Invalid token"})
            return
        }

        if !token.Valid {
            c.AbortWithStatusJSON(401, gin.H{"error": "Invalid token"})
            return
        }

        // 4. Store the claims for the next handlers
        c.Set("user_id", claims.UserID)
        c.Next()
    }
}