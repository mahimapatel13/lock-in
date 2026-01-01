package auth

import (
	"errors"
	"lock-in/internal/config"
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

// CustomClaims defines the structure of the JWT payload
type CustomClaims struct {
	UserID uuid.UUID `json:"user_id"`
	jwt.RegisteredClaims
}

// JWT Secret
var secret string
// Refresh Secret
var refreshSecret string

// AuthInit initialises auth module with configuration variables.
func AuthInit(cfg config.JWTConfig){
    secret = cfg.Secret
	refreshSecret = cfg.RefreshSecret
}

// GetSecret returns JWT Secret
func GetSecret() string{
    return secret
}

// GetRefreshSecret returns Refresh Secret
func GetRefreshSecret() string {
	return refreshSecret
}

// GetUser return the use set in gin context.
func GetUser(c *gin.Context) (*uuid.UUID, error){

	id, exists := c.Get("user_id")

	if !exists{
		return nil, errors.New("User not found!")
	}

	uid, ok := id.(uuid.UUID)

	if !ok{
		return nil, errors.New("Typecasting error")
	}

	return &uid, nil
}

// SetAccessToken sets an access token for user with the given uuid
func SetAccessToken(c *gin.Context, uuid uuid.UUID){
	token := GenerateJWTToken(uuid)
    c.Header("Authorization", token)
	return
}

// GenerateJWTToken generates JWT token with 2 hour validity.
func GenerateJWTToken(uuid uuid.UUID) string {
	return GenerateToken(uuid, secret, 2)
}

// GenerateRefreshToken generates refresh token with 30 day validity.
func GenerateRefreshToken(uuid uuid.UUID) string {
	return GenerateToken(uuid, refreshSecret,720)
}


func GenerateToken(uuid uuid.UUID, secret string, hour int64) string{
	// Define the signing key (HMAC secret)
	signingKey := []byte(secret) 

	// Define the claims
	claims := CustomClaims{
		UserID: uuid, // Custom claim
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "go-jwt-auth",                      // Who issued the token
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Duration(hour) * time.Hour)), // Token expiry
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