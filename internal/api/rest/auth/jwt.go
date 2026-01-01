package auth

import (
	"lock-in/internal/config"
	"log"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

// CustomClaims defines the structure of the JWT payload
type CustomClaims struct {
	UserID uuid.UUID `json:"user_id"`
	jwt.RegisteredClaims
}

var secret string

func AuthInit(cfg config.JWTConfig){
    secret = cfg.Secret
}

func GetSecret() string{
    return secret
}
func GenerateJWTToken(uuid uuid.UUID) string {
	// Define the signing key (HMAC secret)
	signingKey := []byte(secret)

	// Define the claims
	claims := CustomClaims{
		UserID: uuid, // Custom claim
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "go-jwt-auth",                      // Who issued the token
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(1 * time.Hour)), // Token expiry
			IssuedAt:  jwt.NewNumericDate(time.Now()),     // Token issued time
			Subject:   "auth_token",                       // Subject claim
		},
	}

	// Create a new token with the claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token using the signing key
	tokenString, err := token.SignedString(signingKey)
	if err != nil {
		log.Println("Error signing token:", err)
		return ""
	}

	// Print the generated token
	return tokenString
}