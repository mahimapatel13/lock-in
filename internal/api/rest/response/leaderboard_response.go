package response

import "github.com/google/uuid"

type TopUser struct {
	Username string
	UserID   uuid.UUID
}