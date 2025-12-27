package signalling

import (
	"sync"

	"github.com/gorilla/websocket"
)

var AllRooms RoomMap

// Participant describes a single entity in the hashmap
type Participant struct {
    Host bool
    Conn *websocket.Conn
}

// RoomMap is the main hashmap [roomID string] -> []Participant
type RoomMap struct {
    Mutex sync.RWMutex
    Map map[string][]Participant
}
