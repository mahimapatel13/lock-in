package study_room


import (
	"sync"
    "time"
    u "github.com/google/uuid"
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

type SessionType string

const (
    Focus SessionType="Focus"
    Break SessionType="Break"
)

// Session describer the details of a session
type Session struct {
    Type  SessionType
    UserID u.UUID 
    Duration uint32 // seconds
    Time time.Time
}