package models

import (
    "time"
    guuid "github.com/google/uuid"
)

type User struct {
	UUID      *guuid.UUID
	Email     string
	Username  string
	CreatedAt time.Time
    UpdatedAt time.Time
}



