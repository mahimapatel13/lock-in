package profile

import (
    "github.com/google/uuid"
    "time"
    "lock-in/internal/api/rest/response"
)

type CreateUserRequest struct {
    Email string
    Username string
}
type User struct {
	UUID      uuid.UUID
	Email     string
	Username  string
    Password  string 
	CreatedAt time.Time
    UpdatedAt time.Time
}

func (u User) ToResponse() response.LoginResponse {
    return response.LoginResponse{
        UUID: u.UUID,
        Email: u.Email,
        Username: u.Username,
    }
}
