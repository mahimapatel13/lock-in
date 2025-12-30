package email

import (
	"context"
	"log"
)

type service struct {
    repo Repository
}
type Service interface{
    SendEmail(ctx context.Context, email Email)
}

func NewService(repo Repository) Service {
    return &service{
        repo: repo,
    }
}

func(s *service) SendEmail(ctx context.Context,email Email){
    log.Println("Sending mail from service to: ", email.To)
    s.repo.SendEmail(ctx, email)
}