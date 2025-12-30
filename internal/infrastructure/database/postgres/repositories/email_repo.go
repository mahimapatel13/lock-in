package repositories

import (
	"context"
	"lock-in/internal/domain/email"
	"lock-in/internal/worker/email"
)

type emailRepository struct{
    emailWorker *email_worker.WorkerPool
}

func NewEmailRepository( emailWorker *email_worker.WorkerPool) email.Repository {
    return &emailRepository{
        emailWorker: emailWorker,
    }
}

func (r *emailRepository) SendEmail(ctx context.Context,email email.Email){
    
    emailtosend := email_worker.EmailType{
        To: email.To,
        Body: email.Body,
        Subject: email.Subject,
    } 

    r.emailWorker.EmailQueue  <- emailtosend
}