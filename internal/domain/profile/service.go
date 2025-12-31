package profile

import (
	"context"
	"fmt"
	"math/rand"

	// "log"
	"errors"
	"lock-in/internal/domain/email"
	"log"
    
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type service struct {
    repo Repository
    emailService email.Service
}

type Service interface{
    AuthenticateUser(ctx context.Context, pass string, username *string, email *string) (*User, error)
    RegisterUser(ctx context.Context ,user CreateUserRequest) error
    GetUserByUUID(ctx context.Context ,id uuid.UUID) (*User, error)
    GetUserByEmail(ctx context.Context ,email string) (*User, error)
    GetUserByUsername(ctx context.Context ,username string) (*User, error)
}

func NewService(repo Repository, emailService email.Service) Service {
    return &service{
        repo: repo,
        emailService: emailService,
    }
}

// AuthenticateUser authenticates users
func(s *service) AuthenticateUser(ctx context.Context, pass string, username *string, email *string)(*User, error){

    if pass == ""{
        return nil, errors.New("Password is empty.")
    }

    if username == nil && email == nil {
        return nil, errors.New("One of username or email must be provided.")
    }

    if(username == nil){

        user, err := s.GetUserByEmail(ctx, *email)

        if err != nil {
            return nil, err
        }

        // compare pass

        err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(pass))

        if err != nil {
            // wrong pass
            return nil, err
        }

        return user, nil
    }else {
        user, err := s.GetUserByUsername(ctx, *username)

        if err != nil {
            return nil, err
        }

        // compare pass

        err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(pass))

        if err != nil {
            // wrong pass
            return nil, err
        }

        return user, nil
    }
}

// GetUserByUsername function returns user which matches with the given uuid
func(s *service) GetUserByUUID(ctx context.Context, id uuid.UUID) (*User, error){
    log.Println("Getting user by uuid")
    user, err := s.repo.GetUserByUIID(ctx, id)

    if err != nil {
        log.Println("Error retrieving user profile by uuid")
        return nil, err
    }

    log.Println("Succesfully Retrieved user by uuid")
    return user, nil
}

// GetUserByUsername function returns user which matches with the given email
func(s *service) GetUserByEmail(ctx context.Context, email string) (*User, error){
    log.Println("Getting user by Email")
    user, err := s.repo.GetUserByEmail(ctx, email)

    if err != nil {
        log.Println("Error retrieving user profile by Email")
        return nil, err
    }

    log.Println("Succesfully Retrieved user by Email")
    return user, nil
}

// GetUserByUsername function returns user which matches with the given username
func(s *service) GetUserByUsername(ctx context.Context, username string) (*User, error){
    log.Println("Getting user by Username")
    user, err := s.repo.GetUserByUsername(ctx, username)

    if err != nil {
        log.Println("Error retrieving user profile by Username")
        return nil, err
    }

    log.Println("Succesfully Retrieved user by Username")
    return user, nil
}

// RegisterUser function registers users in the server database
func (s *service) RegisterUser(ctx context.Context, user CreateUserRequest) error {

    log.Println("Registering User on Lock-In")

    // Check if a user already exists
    _, err := s.repo.GetUserByUsername(ctx, user.Username)

    if err == nil {
        return errors.New(fmt.Sprintf("User with username %s already exists.", user.Username))
    }

    _, err = s.repo.GetUserByEmail(ctx, user.Email)

    if err == nil{
        return errors.New(fmt.Sprintf("User with username %s already exists.", user.Username))
    }

    // profile creation starts here..

    log.Println("Making password")
    pass := makePassword();

    log.Println("Hashing password")
    hashedPass, err := bcrypt.GenerateFromPassword([]byte(pass), bcrypt.DefaultCost)

    if err != nil {
        log.Println("Error in hashing password")
        return err
    }

    err = s.repo.RegisterUser(ctx, user, hashedPass)

    if err != nil{
        log.Println("Error in registering user.")
        return err
    }

    log.Println("Succesfully registered user!")

    return nil
}


func makePassword() string {
    
    var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()")

    fmt.Println("Making rune")

    b := make([]rune, 12)

    for i := range b{
        b[i] = letters[rand.Intn(len(letters))]

    }

    return string(b)
}