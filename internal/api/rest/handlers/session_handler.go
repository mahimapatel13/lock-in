package handlers

import (
	"log"
	"net/http"
	"time"

	// "net/http"
	// "encoding/json"
	// "fmt"
	"lock-in/internal/api/rest/auth"
	"lock-in/internal/api/rest/request"
	"lock-in/internal/api/rest/response"
	"lock-in/internal/domain/study_session"

	"github.com/gin-gonic/gin"
)

type SessionHandler struct {
	service study_session.Service
}

func NewSessionHandler(service study_session.Service) *SessionHandler {
	return &SessionHandler{
		service: service,
	}
}

// GetAllSession returns all the succesfully completed study sessions by any user.
func (h *SessionHandler) GetAllSessions(c *gin.Context) {

	log.Println("Handling GetAllSessions Request")

	uuid, err := auth.GetUser(c)

	if err != nil || uuid == nil {
		log.Println("user not found bro")
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "User not authorized",
		})
		return
	}

	sessions, err := h.service.GetAllSessions(c.Request.Context(), *uuid)

	if err != nil {
		log.Println("Error while getting the session details: ", err)
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	resp := make([]response.SessionResponse, 0)
	for _, s := range sessions {
		r := s.ToResponse()
		resp = append(resp, r)
	}

	log.Println(sessions)

	c.JSON(http.StatusOK, gin.H{
		"sessions": resp,
		"message":  "Retrieved Sessions Succesfully!",
	})
}

// RecordSessionRequest records the details of a focus session or a break
func (h *SessionHandler) RecordSessionRequest(c *gin.Context) {

	log.Println("Handling RecordSessionRequest")

	req := request.GetReqBody[request.RecordSessionRequest](c)

	log.Println(req.EndTime)
	// log.Println(req.SessionType)

	t, err := time.Parse(time.RFC3339, req.EndTime)
	log.Println(t)

	if err != nil {
		log.Println("incorrect time format.. ")
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Correct time format is 2026-01-09T07:00:00+05:30 in string",
		})

		return
	}

	uuid, err := auth.GetUser(c)

	if err != nil || uuid == nil {
		log.Println("user not found bro")
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "User not authorized",
		})
		return
	}

	err = h.service.RecordSession(c.Request.Context(), *uuid, t.UTC())

	if err != nil {
		log.Println("Error while recording the session details: ", err)
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Recorded Session Succesfully!",
	})
}

// StartSessionRequest records the start time of a focus session in db
func (h *SessionHandler) StartSessionRequest(c *gin.Context) {

	log.Println("Handling StartSessionRequest")

	req := request.GetReqBody[request.StartSessionRequest](c)

	log.Println(req.StartTime)
	// log.Println(req.SessionType)

	t, err := time.Parse(time.RFC3339, req.StartTime)
	log.Println(t)

	if err != nil {
		log.Println("incorrect time format.. ")
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Correct time format is 2026-01-09T07:00:00+05:30 in string",
		})

		return
	}

	uuid, err := auth.GetUser(c)

	if err != nil || uuid == nil {
		log.Println("user not found bro")
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "User not authorized",
		})
		return
	}

	err = h.service.StartSession(c.Request.Context(), *uuid, t.UTC())

	if err != nil {
		log.Println("Error while starting the session: ", err)
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Started Session Succesfully!",
	})
}
