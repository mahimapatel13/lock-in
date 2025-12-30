package user

import "github.com/google/uuid"

type Repository interface {
	GetUserByUIID(id uuid.UUID) (User, error)
}