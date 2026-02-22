package handlers

import (
	"lock-in/internal/api/rest/auth"
	"lock-in/internal/api/rest/response"
	"lock-in/internal/domain/leaderboard"
	"log"
	"net/http"
	"time"
	"github.com/gin-gonic/gin"
)

type LeaderboardHandler struct {
	service leaderboard.Service
}

func NewLeaderboardHandler(service leaderboard.Service) *LeaderboardHandler{
    return &LeaderboardHandler{
        service: service,
    }
}

func(h *LeaderboardHandler) GetTopUsers(c *gin.Context){

    log.Println("Handling GenerateTicket request..")

	// read uuid from JWT
	uuid, err := auth.GetUser(c)

	if err != nil || uuid == nil {
		log.Println("user not found bro")
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "User not authorized",
		})
		return
	}

    now := time.Now()
    yesterday := now.AddDate(0, 0, -1)

    topUsers, err := h.service.GetTopUsersForDate(c.Request.Context(), yesterday,*uuid)


    if err != nil {
        log.Println("Error while getting top users for date", yesterday.Format("2026-02-01"))
        c.JSON(http.StatusBadRequest, gin.H{
            "error": err.Error(),
        })
        return
    }

    resp := make([]response.TopUser, 0)

    for i  := range topUsers {

        var user response.TopUser
        user.MinutesFocused = topUsers[i].Minutes
        user.Username = topUsers[i].Username
        user.Rank = topUsers[i].Rank

        resp = append(resp, user)
    }

    log.Println("succsfully handles request to get top users", resp)

    c.JSON(http.StatusOK, gin.H{
        "message": resp,
    })

}