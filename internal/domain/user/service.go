package user

import (
	// "fmt"
	// "log"
    "github.com/google/uuid"
)

type service struct {
    repo Repository
}

type Service interface{
    RegisterUser(user CreateUserRequest) error
    GetUserByUUID(id uuid.UUID) (User, error)
    GetUserByEmail(email string) (User, error)
    GetUserByUsername(username string) (User, error)
}

// func(s *service) GetUserByUUID(id uuid.UUID) (User, error){
//     log.Println("Getting user by uuid")
//     user, err := s.repo.GetUserByUIID(id)

//     if err != nil {
//         log.Println("Error retrieving user profile by uuid")
//         return User{}, err
//     }

//     log.Println("Succesfully Retrieved user by uuid")
//     return user, nil
// }

// func(s *service) GetUserByEmail(email string) (User, error){
//     log.Println("Getting user by Email")
//     user, err := s.repo.GetUserByEmail(email)

//     if err != nil {
//         log.Println("Error retrieving user profile by Email")
//         return User{}, err
//     }

//     log.Println("Succesfully Retrieved user by Email")
//     return user, nil
// }

// func(s *service) GetUserByUsername(username string) (User, error){
//     log.Println("Getting user by Username")
//     user, err := s.repo.GetUserByUsername(username)

//     if err != nil {
//         log.Println("Error retrieving user profile by Username")
//         return User{}, err
//     }

//     log.Println("Succesfully Retrieved user by Username")
//     return user, nil
// }


// func (s *service) RegisterUSer(user CreateUserRequest) error {

//     log.Println("Registering User on Lock-In")

//     // Check if a user already exists
//     _, err := s.GetUser(user.Username)
// }
// func NewService() Service {
//     return &service{}
// }