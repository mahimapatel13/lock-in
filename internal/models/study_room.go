package models

import(
    w "github.com/gofiber/websocket"
)

type StudyRoom struct {
    Users []User
    Websocket *w.Conn
}