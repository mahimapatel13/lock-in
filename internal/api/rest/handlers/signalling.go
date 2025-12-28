package handlers

import (
	"log"
	"net/http"
	// "net/http"
	"encoding/json"
	// "fmt"
	s "lock-in/internal/domain/signalling"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

//

var AllRooms s.RoomMap

func CreateRoomRequest(c *gin.Context) {
    c.Header("Access-Control-Allow-Origin", "*")

    log.Println("CreatRoomRequest")
    roomID := AllRooms.CreateRoom()

    type resp struct{
        RoomID string `json:"room_id"`
    }

    log.Println("room created")

    log.Println(roomID)
    log.Println(AllRooms.Map)
    json.NewEncoder(c.Writer).Encode(resp{RoomID: roomID})
}

var upgrader = websocket.Upgrader{
    CheckOrigin: func(r *http.Request) bool{
        return true
    },
    
}

type broadcastMsg struct {
    Message map[string]any
    RoomID string
    Client *websocket.Conn
}

var broadcast = make(chan broadcastMsg)

func Broadcaster(){
    for{
        msg := <- broadcast

        for _, client := range AllRooms.Map[msg.RoomID]{
            if(client.Conn != msg.Client){

                // if(client.Conn == websocket.Conn.)
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
func JoinRoomRequest(c *gin.Context){
    
    roomID := c.Param("roomID")
    if roomID == ""{
        log.Println("roomID missing in URL parameters")
        return
    }
    log.Println("upgrading connection to ws")

    ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)

    if err != nil{
        log.Fatal("Web Socket Upgrade Error: ", err)
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

        log.Println("-----")
        log.Println(msg.Message)

        broadcast <- msg

    }
    
    // log.Println("test")
}