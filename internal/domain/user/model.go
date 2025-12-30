package user

import (
    "github.com/google/uuid"
    "time"
)

type CreateUserRequest struct {
    Email string
    Username string
}
type User struct {
	UUID      *uuid.UUID
	Email     string
	Username  string
	CreatedAt time.Time
    UpdatedAt time.Time
}
