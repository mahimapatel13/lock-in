package main

import (
	// "fmt"
	"log"
	"math/rand"
	// "net/smtp"
	// "strings"
	"time"
)

type Mail struct {
    Sender  string
    To      []string
    Subject string
    Body    string
}

func main() {

    for{
        k := rand.Int();
        log.Println(k)
        time.Sleep(1000)
    }
//     sender := "john.doe@example.com"

//     to := []string{
//         "mahima13patel@gmail.com",
//     }

//     user := "rgpvmahima@gmail.com"
//     password := "fdjd imcg ayrz ehdo"

//     subject := "Simple HTML mail"
//     body := `<p>An old <b>falcon</b> in the sky.</p>`

//     request := Mail{
//         Sender:  sender,
//         To:      to,
//         Subject: subject,
//         Body:    body,
//     }

//     addr := "smtp.gmail.com:587"
//     host := "smtp.gmail.com"

//     msg := BuildMessage(request)
//     auth := smtp.PlainAuth("", user, password, host)
//     err := smtp.SendMail(addr, auth, sender, to, []byte(msg))

//     if err != nil {
//         log.Fatal(err)
//     }

//     fmt.Println("Email sent successfully")
// }

// func BuildMessage(mail Mail) string {
//     msg := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\r\n"
//     msg += fmt.Sprintf("From: %s\r\n", mail.Sender)
//     msg += fmt.Sprintf("To: %s\r\n", strings.Join(mail.To, ";"))
//     msg += fmt.Sprintf("Subject: %s\r\n", mail.Subject)
//     msg += fmt.Sprintf("\r\n%s\r\n", mail.Body)

//     return msg
}
