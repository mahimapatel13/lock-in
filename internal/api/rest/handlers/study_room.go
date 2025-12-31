package handlers

import (
	"log"
	"net/http"

	// "net/http"
	// "encoding/json"
	// "fmt"
	"lock-in/internal/api/rest/request"
	"lock-in/internal/domain/study_room"
	s "lock-in/internal/domain/study_room"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

//
type StudyRoomHandler struct {
    service study_room.Service
}

func NewStudyRoomHandler(service study_room.Service) *StudyRoomHandler {
    return &StudyRoomHandler{
        service: service,
    }
}
var AllRooms s.RoomMap

func(h *StudyRoomHandler) CreateRoomRequest(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", "*")

	log.Println("CreatRoomRequest")
	roomID := AllRooms.CreateRoom()

	log.Println("room created")

	log.Println(roomID)
	log.Println(AllRooms.Map)

    c.JSON(http.StatusCreated,gin.H{"room_id":roomID})
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type broadcastMsg struct {
	Message map[string]any
	RoomID  string
	Client  *websocket.Conn
}

var broadcast = make(chan broadcastMsg)

func Broadcaster() {
	for {
		msg := <-broadcast

		for _, client := range AllRooms.Map[msg.RoomID] {

			log.Println("------------------")
			for key, value := range msg.Message {
				log.Printf("Key: %s | Value: %v\n", key, value)
				if key == "focus" {

				} else if key == "break" {
				}
			}
			// log.Println(client.Conn, msg.Client)
			if client.Conn != msg.Client {
				err := client.Conn.WriteJSON(msg.Message)

				if err != nil {
					log.Println(err)
					client.Conn.Close()
				}
			}
		}
	}

}

// JoinRoomRequest will join the client in a particular room
func(h *StudyRoomHandler) JoinRoomRequest(c *gin.Context) {

	roomID := c.Param("roomID")
	if roomID == "" {
		log.Println("roomID missing in URL parameters")
		c.JSON(http.StatusNotFound, gin.H{"error": "roomID missing in URL parameters"})
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

	AllRooms.InsertIntoRoom(roomID, false, ws)

	log.Println("reading loop")

	for {
		var msg broadcastMsg
		err := ws.ReadJSON(&msg.Message)

		if err != nil {
			log.Println("Read Error: ", err)
			return

		}
		msg.Client = ws
		msg.RoomID = roomID

		broadcast <- msg

	}

	// log.Println("test")
}

// RecordSessionRequest records the details of a focus session or a break
func(h *StudyRoomHandler) RecordSessionRequest (c *gin.Context){
    
    log.Println("Handling RecordSessionRequest")

    req := request.GetReqBody[request.RecordSessionRequest](c)

	log.Println(req.SessionDuration)
	log.Println(req.SessionType)
   
    session := study_room.Session{
        Type: study_room.SessionType(req.SessionType),
        Duration: uint32(req.SessionDuration),
        // UserID: ,
    }

    err := h.service.RecordSession(c.Request.Context(),session)

    if err != nil {
        log.Println("Error while recording the session details: ", err)
        c.JSON(http.StatusNotFound, gin.H{"error": err})
    }


    c.JSON(http.StatusOK,gin.H{
        "message": "Recorded Session Succesfully!",
    } )
}

