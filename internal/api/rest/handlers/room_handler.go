package handlers

import (
	"log"
	"net/http"

	// "net/http"
	// "encoding/json"
	// "fmt"
	"lock-in/internal/api/rest/auth"
	"lock-in/internal/api/rest/request"
	"lock-in/internal/domain/study_room"
	"lock-in/internal/domain/study_session"
	"lock-in/internal/domain/ticket_manager"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

//
type RoomHandler struct {
    roomService study_room.Service
	ticketService ticket_manager.Service
	sessionService study_session.Service
}

func NewRoomHandler(roomService study_room.Service, ticketService ticket_manager.Service, sessionService study_session.Service) *RoomHandler {
    return &RoomHandler{
        roomService: roomService,
		ticketService: ticketService,
		sessionService: sessionService,
    }
}


func(h *RoomHandler) GenerateTicket(c *gin.Context){
	log.Println("Handling GenerateTicket request..")

	// read uuid from JWT
	uuid, err := auth.GetUser(c)

	if err != nil || uuid == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "User not authorized",
		})
		return
	}

	roomID := c.Param("roomID")
	if roomID == "" {
		log.Println("roomID missing in URL parameters")
		c.JSON(http.StatusNotFound, gin.H{"error": "roomID missing in URL parameters"})
		return
	}


	ticket := h.ticketService.GenerateTicket(c.Request.Context(),*uuid, roomID)

	c.JSON(http.StatusCreated, gin.H{
		"message": "ticket created succesfully",
		"ticket": ticket,
	})
}

func (h *RoomHandler) VerifyRoom(c *gin.Context) {
	log.Println("Handlind Verify Room request")

	roomID := c.Param("roomID")
	if roomID == "" {
		log.Println("roomID missing in URL parameters")
		c.JSON(http.StatusNotFound, gin.H{"error": "roomID missing in URL parameters"})
		return
	}

	_, err := h.roomService.Get(c.Request.Context(), roomID)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error" : err,
		})

		return
	}

	c.JSON(http.StatusBadRequest, gin.H{
		"room_id" : roomID,
	})
}

func(h *RoomHandler) CreateRoomRequest(c *gin.Context) {

	log.Println("CreatRoomRequest")
	roomID := h.roomService.CreateRoom(c.Request.Context())

	log.Println("room created")

	log.Println(roomID)

    c.JSON(http.StatusCreated,gin.H{"room_id":roomID})
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}



// JoinRoomRequest will join the client in a particular room
func(h *RoomHandler) JoinRoomRequest(c *gin.Context) {

	ticket := c.Param("ticket")
	if ticket == "" {
		log.Println("ticket missing in URL parameters")
		c.JSON(http.StatusNotFound, gin.H{"error": "ticket missing in URL parameters"})
		return
	}
	
	ticketContext, valid := h.ticketService.ValidateTicket(c.Request.Context(), ticket)

	if !valid {
		log.Println("Invalid ticket.")
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid ticket",
		})
	}

	log.Println("upgrading connection to ws")

	ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)

	if err != nil {
		log.Fatal("Web Socket Upgrade Error: ", err)
        c.JSON(http.StatusNotFound, gin.H{"error": err})
		ws.Close()  
	}

	log.Println("upgraded conn")

	log.Println("inserting into room")

	// Ensure cleanup on disconnect
	defer func() {
		log.Println("Client disconnected")
		ws.Close()
	}()

	h.roomService.InsertIntoRoom(c.Request.Context(),ticketContext.RoomID, false, ws)

	log.Println("reading loop")

	for {
		var msg study_room.BroadcastMsg
		err := ws.ReadJSON(&msg.Message)

		if err != nil {
			log.Println("Read Error: ", err)
			return

		}
		msg.Client = ws
		msg.RoomID = ticketContext.RoomID

		h.roomService.SendToBroadcast(msg)

	}

	// log.Println("test")
}

// RecordSessionRequest records the details of a focus session or a break
func(h *RoomHandler) RecordSessionRequest (c *gin.Context){
    
    log.Println("Handling RecordSessionRequest")

    req := request.GetReqBody[request.RecordSessionRequest](c)

	log.Println(req.SessionDuration)
	log.Println(req.SessionType)

   
    session := study_session.Session{
        Type: study_session.SessionType(req.SessionType),
        Duration: uint32(req.SessionDuration),
        // UserID: ,
    }

    err := h.sessionService.RecordSession(c.Request.Context(),session)

    if err != nil {
        log.Println("Error while recording the session details: ", err)
        c.JSON(http.StatusNotFound, gin.H{"error": err})
		return
    }


    c.JSON(http.StatusOK,gin.H{
        "message": "Recorded Session Succesfully!",
    } )
}

