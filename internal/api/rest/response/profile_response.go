package response

import (
    "github.com/google/uuid"
)

type LoginResponse struct {
	UUID     uuid.UUID `json:"uuid"`
	Email    string    `json:"email"`
	Username string    `json:"username"`
}

