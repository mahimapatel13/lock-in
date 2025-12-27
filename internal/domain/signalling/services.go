package signalling

import (
	"fmt"
	"log"
	"math/rand"

	"github.com/gorilla/websocket"
)

// Init initialises the RoomMap struct
func (r *RoomMap) Init(){
   r.Map = make(map[string][]Participant)
}
// Get will return the array of participants in the room
func(r *RoomMap) Get(roomID string) []Participant {
    r.Mutex.RLock()
    defer r.Mutex.RUnlock()

    return r.Map[roomID]
}

// CreateRoom generate a unique ID and return it -> insert in the hashmap
func(r *RoomMap) CreateRoom() string {
    r.Mutex.Lock()
    defer r.Mutex.Unlock()
    
    fmt.Println("Create Room Service fn")
    var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")

    fmt.Println("Making rune")

    b := make([]rune, 8)

    for i := range b{
        b[i] = letters[rand.Intn(len(letters))]

    }

    fmt.Println("room id created")

    roomID := string(b)
    r.Map[roomID] = []Participant{}

    fmt.Println("returning")
    return roomID
}

// InsertIntoRoom will insert a participant and add it in the hashmao
func (r *RoomMap)InsertIntoRoom(roomID string, host bool, conn *websocket.Conn){
    r.Mutex.Lock()
    defer r.Mutex.Unlock()

    p := Participant{
        Host: host,
        Conn: conn,
    }

    log.Println("Inserting into Room with RoomID: ", roomID)
    r.Map[roomID] = append(r.Map[roomID], p)
}

// DeleteRoom delets the room with roomID
func(r* RoomMap) DeleteRoom(roomID string){
    r.Mutex.Lock()
    defer r.Mutex.Unlock()

    delete(r.Map, roomID)
}