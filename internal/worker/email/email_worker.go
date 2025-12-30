package email_worker

import (
	"context"
	// "errors"
	"fmt"
	"lock-in/internal/config"

	// "lock-in/internal/domain/email"
	"log"
	// "math/rand"
	"net/smtp"
	"strings"
	"sync"
	"time"
)

type EmailType struct {
	To      []string
	Subject string
	Body    string
}

// type Result struct {
// 	JobID  string
// 	Output bool
// 	Error  error
// }

type WorkerPool struct {
	EmailQueue chan EmailType
	// results chan Result
	wg         sync.WaitGroup
	smtpConfig config.SMTPConfig
	count      int
	ctx        context.Context
	cancel     context.CancelFunc
}

// NewEmailWorkerPool returns a new instance of the worker pool
func NewEmailWorkerPool(smtpConfig config.SMTPConfig) WorkerPool {
	// Create a context with a cancel function
	ctx, cancel := context.WithCancel(context.Background())

	return WorkerPool{
		EmailQueue: make(chan EmailType),
		// results: make(chan Result),
		wg:         sync.WaitGroup{},
		smtpConfig: smtpConfig,
		ctx:        ctx,    // Use the derived context
		cancel:     cancel, // Use the returned cancel function
	}
}

// worker listens for jobs in the jobs queue and processes them
func (wp *WorkerPool) Worker(id int) {
	defer wp.wg.Done()

	for {
		select {
		case <-wp.ctx.Done():
			return
		case job, ok := <-wp.EmailQueue:
			log.Printf("worker %v started job ", id)
			if !ok {
				return
			}
			wp.processJob(id, job)
		}
	}
}

// buildMessage function builds a html message from email struct
func buildMessage(mail EmailType) string {
	log.Println("building message for: ", mail)

	msg := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\r\n"
	msg += fmt.Sprintf("From: %s\r\n", "rgpvmahima@gmail.com")
	msg += fmt.Sprintf("To: %s\r\n", strings.Join(mail.To, ";"))
	msg += fmt.Sprintf("Subject: %s\r\n", mail.Subject)
	msg += fmt.Sprintf("\r\n%s\r\n", mail.Body)
	return msg
}

// sendEmail sends email using config
func (wp *WorkerPool) sendEmail(email EmailType) error {
	log.Println("Sending mail to ", email.To)
	msg := buildMessage(email)

	auth := smtp.PlainAuth("", wp.smtpConfig.User, wp.smtpConfig.Password, wp.smtpConfig.Host)

	err := smtp.SendMail(wp.smtpConfig.Address, auth, wp.smtpConfig.Sender, email.To, []byte(msg))

	if err != nil {
		log.Println("Error in sending mail to ", email.To)
		return err
	}

	log.Println("Successfully sent mail to ", email.To)
	return nil

}

func (wp *WorkerPool) processJob(workerID int, job EmailType) {

	for attempt := 0; attempt < wp.smtpConfig.MaxRetries; attempt++ {
		err := wp.sendEmail(job)

		if err == nil {
			return
		}

		if attempt < wp.smtpConfig.MaxRetries-1 {
			backoff := time.Second * time.Duration(1<<uint(attempt))
			time.Sleep(backoff)
		}
	}

}

func (wp *WorkerPool) Shutdown() {
	wp.cancel()          // Tell all workers to stop
	close(wp.EmailQueue) // Stop accepting new jobs
	wp.wg.Wait()         // Wait for workers to finish
	// close(wp.results)
}
