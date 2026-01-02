package handlers

import (
	"lock-in/internal/api/rest/auth"
	"lock-in/internal/api/rest/request"
	"lock-in/internal/domain/profile"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ProfileHandler struct {
	service profile.Service
}

func NewProfileHandler(service profile.Service) *ProfileHandler {
	return &ProfileHandler{
		service: service,
	}
}

func (h *ProfileHandler) RegisterUser(c *gin.Context) {
	log.Println("Handling RegisterUser Request")

	r := request.GetReqBody[request.RegisterUserRequest](c)

	req := profile.CreateUserRequest{
		Username: r.Username,
		Email:    r.Email,
	}

	err := h.service.RegisterUser(c.Request.Context(), req)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	// Succesfully registered
	c.JSON(http.StatusCreated, gin.H{
		"message":  "Check your email!",
		"username": req.Username,
		"email":    req.Email,
	})
}

// Login handles login requests to the http server
func (h *ProfileHandler) Login(c *gin.Context) {
	log.Println("Handling login request")

	r := request.GetReqBody[request.LoginRequest](c)

    log.Println(r)

	// Authenticating user
	log.Println("Authenticating User..")
	user, err := h.service.AuthenticateUser(c.Request.Context(), r.Password, r.Username, r.Email)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	// Set access token in "Authorization" header
	auth.SetAccessToken(c, user.UUID)
	// Set refresh token in "refresh_token" cookie
	auth.SetRefreshToken(c, user.UUID)

    resp := user.ToResponse()

	c.JSON(http.StatusOK, gin.H{
		"message": "Login succesfull",
		"user":    resp,
	})

}

// Refresh handler validates refresh token and refreshes access token
func(h *ProfileHandler) Refresh(c *gin.Context){
    refreshToken := auth.GetRefreshToken(c)

    if refreshToken == "" {
        c.AbortWithStatusJSON(401, gin.H{
            "error": "Unauthorized",
        })
        return
    }

    // Check refresh token in database
    uuid, err := h.service.GetToken(c.Request.Context(),refreshToken)

	if err != nil{
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Token not found in the system.",
		})
		return
	}

	// if uuid was found..
	auth.SetRefreshToken(c, *uuid)

	c.JSON(http.StatusOK,gin.H{
		"message": "refresh-token set successfully.",
	})
}

// GetUser handler handles request coming at /user route
func (h *ProfileHandler) GetUser(c *gin.Context) {
	log.Println("Handling GetUser Request")

	// read uuid from JWT
	uuid, err := auth.GetUser(c)

	if err != nil || uuid == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "User not authorized",
		})
		return
	}

	user, err := h.service.GetUserByUUID(c.Request.Context(), *uuid)

	if err != nil || user == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error in retreiving user details",
		})
	}

    resp := user.ToResponse()

	c.JSON(http.StatusOK, gin.H{
		"message": "Login succesfull",
		"user":    resp,
	})
}
