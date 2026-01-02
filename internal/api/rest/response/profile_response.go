package response

import (
    "github.com/google/uuid"
)

type LoginResponse struct {
	UUID     uuid.UUID
	Email    string
	Username string
}

