package middleware

import (
	"errors"
	"fmt"
	"strings"

	"lock-in/internal/api/rest/auth"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// ValidateToken validates a JWT token
func ValidateToken(tokenString string)(*jwt.Token,*auth.CustomClaims, error){
    claims := &auth.CustomClaims{}

    token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
        // Ensure signing method is HMAC (security best practice)
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
        }
        return []byte(auth.GetSecret()), nil
    })

    if err!= nil {
        return nil, nil,err
    }

    return token, claims, nil
}

// JWTWithRefresh middleware validates JWT token and handles refresh logic
func JWTWithRefresh() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        
        // 1. Safety check for "Bearer <token>"
        if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
            c.AbortWithStatusJSON(401, gin.H{"error": "Authorization header required and must start with Bearer"})
            return
        }

        tokenString := strings.TrimPrefix(authHeader, "Bearer ")

        token, claims, err := ValidateToken(tokenString)

        // 3. Handle Expiration vs Invalidity
        if err != nil {
            if errors.Is(err, jwt.ErrTokenExpired) {
                //  Check for refresh token in cookies
                refreshTokenString, err := c.Cookie("refresh_token")
                if err != nil {
                    c.AbortWithStatusJSON(401, gin.H{"error": "Session expired"})
                    return
                }

                _, refreshClaims, err := ValidateToken(refreshTokenString)

                if err != nil || refreshClaims.ID != claims.ID{
                    c.AbortWithStatusJSON(401, gin.H{"error": "Invalid session."})
                }

                // refresh needed
                auth.SetAccessToken(c, claims.UserID)

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
