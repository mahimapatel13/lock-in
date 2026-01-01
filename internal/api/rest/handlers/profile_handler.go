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

func(h *ProfileHandler) RegisterUser(c *gin.Context){
    log.Println("Handling RegisterUser Request")

    r := request.GetReqBody[request.RegisterUserRequest](c)
    
    req := profile.CreateUserRequest{
        Username: r.Username,
        Email: r.Email,
    }

    err := h.service.RegisterUser(c.Request.Context(), req)

    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error":err})
        return
    }

    // Succesfully registered
    c.JSON(http.StatusCreated, gin.H{
        "message":"Check your email!",
        "username": req.Username,
        "email": req.Email,
    } )
}

// Login handles login requests to the http server
func(h *ProfileHandler) Login (c *gin.Context){
    log.Println("Handling login request")

    r := request.GetReqBody[request.LoginRequest](c)

    // Authenticating user
    log.Println("Authenticating User..")
    user, err := h.service.AuthenticateUser(c.Request.Context(),r.Password,r.Username, r.Email)

    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err})
        return
    }

    // TODO: Return JWT token in header
    auth.SetAccessToken(c, user.UUID)

    //
    c.JSON(http.StatusOK, gin.H{
        "message": "Login succesfull",
        "username": user.Username,
        "email": user.Email,
        "uuid": user.UUID,
    })
   
}

// GetUser handler handles request coming at /user route
func(h *ProfileHandler) GetUser(c *gin.Context){
    log.Println("Handling GetUser Request")

    // read uuid from JWT
    uuid, err := auth.GetUser(c)

    if err != nil || uuid == nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "error": "User not authorized",
        })
        return 
    }

    user, err := h.service.GetUserByUUID(c.Request.Context(),*uuid)

    if err != nil || user == nil{
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Error in retreiving user details",
        })
    }

    c.JSON(http.StatusOK, gin.H{
        "message": "Login succesfull",
        "user": user,
    })
}

