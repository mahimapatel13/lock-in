package email

import "context"

type Repository interface {
	SendEmail(ctx context.Context, email Email)
}