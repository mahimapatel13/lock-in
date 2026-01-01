package request

type RegisterUserRequest struct {
	Username string `json:"username" binding:"required,min=5"`
	Email    string `json:"email" binding:"required,email"`
}

type LoginRequest struct {
    Username *string `json:"username" binding:"required_without=Email,omitempty"`
    Email    *string `json:"email" binding:"required_without=Username,omitempty,email"`
    Password string  `json:"password" binding:"required"`
}