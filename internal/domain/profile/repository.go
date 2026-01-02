package profile

import (
	"context"

	"github.com/google/uuid"
)

type Repository interface {
	GetUserByUIID(ctx context.Context, id uuid.UUID) (*User, error)
	GetUserByUsername(ctx context.Context, username string) (*User, error)
	GetUserByEmail(ctx context.Context, email string) (*User, error)
	RegisterUser(ctx context.Context, user CreateUserRequest, pass string) error
	GetToken(ctx context.Context, refresh string) (*uuid.UUID, error)
}