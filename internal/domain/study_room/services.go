package study_room

import (
	"context"
	"errors"
	"fmt"
	"log"
	"math/rand"

	"github.com/gorilla/websocket"
)

type service struct {
	allRooms *roomMap
	queue    chan BroadcastMsg
}

type Service interface {
	Get(ctx context.Context, roomID string) ([]Participant, error)
	CreateRoom(ctx context.Context) string
	InsertIntoRoom(ctx context.Context, roomID string, host bool, conn *websocket.Conn)
	DeleteRoom(ctx context.Context, roomID string)
	SendToBroadcast(msg BroadcastMsg)
}



func NewService() Service {
	var allRooms roomMap
	allRooms.init()
    var queue = make(chan BroadcastMsg)
	s := &service{
		allRooms: &allRooms,
        queue: queue,
	}
	go s.broadcaster()
	return s
}

func (s *service) SendToBroadcast(msg BroadcastMsg) {
    s.queue <- msg
    return
}

func (s *service) broadcaster() {

	for {
		msg := <-s.queue

		for _, client := range s.allRooms.Map[msg.RoomID] {

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

// Get will return the array of participants in the room
func (s *service) Get(ctx context.Context, roomID string) ([]Participant, error) {
	s.allRooms.Mutex.RLock()
	defer s.allRooms.Mutex.RUnlock()

	// The "comma ok" idiom
	participants, exists := s.allRooms.Map[roomID]

	if !exists {
		// Return a clear error so your controller knows what happened
		return nil, errors.New("room not found")
	}

	return participants, nil
}

// CreateRoom generate a unique ID and return it -> insert in the hashmap
func (s *service) CreateRoom(ctx context.Context) string {
	s.allRooms.Mutex.Lock()
	defer s.allRooms.Mutex.Unlock()

	fmt.Println("Create Room Service fn")
	var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")

	fmt.Println("Making rune")

	b := make([]rune, 8)

	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]

	}

	fmt.Println("room id created")

	roomID := string(b)
	s.allRooms.Map[roomID] = []Participant{}

	fmt.Println("returning")
	return roomID
}

// InsertIntoRoom will insert a participant and add it in the hashmao
func (s *service) InsertIntoRoom(ctx context.Context, roomID string, host bool, conn *websocket.Conn) {
	s.allRooms.Mutex.Lock()
	defer s.allRooms.Mutex.Unlock()

	p := Participant{
		Host: host,
		Conn: conn,
	}

	log.Println("Inserting into Room with RoomID: ", roomID)
	s.allRooms.Map[roomID] = append(s.allRooms.Map[roomID], p)
}

// DeleteRoom delets the room with roomID
func (s *service) DeleteRoom(ctx context.Context, roomID string) {
	s.allRooms.Mutex.Lock()
	defer s.allRooms.Mutex.Unlock()

	delete(s.allRooms.Map, roomID)
}
