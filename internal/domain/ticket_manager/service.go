package ticket_manager

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"log"
	"sync"
	"time"

	"github.com/google/uuid"
)

type service struct {
	tickets sync.Map
}

func Newservice() Service {
    return &service{}
}

type Service interface{
    GenerateTicket(ctx context.Context, uuid uuid.UUID, roomID string) string
    ValidateTicket(ctx context.Context, ticket string)(TicketContext, bool)
}

func (tm *service) GenerateTicket(ctx context.Context, uuid uuid.UUID, roomID string) string {
    b := make([]byte, 16)
    rand.Read(b)

    ticket := hex.EncodeToString(b)
    ticketContext := TicketContext{
        UserID: uuid,
        RoomID: roomID,
    }
    tm.tickets.Store(ticket, ticketContext)

    go func() {
        time.Sleep(60 * time.Second)
        tm.tickets.Delete(ticket)
    } ()

    return ticket
}

func(tm *service) ValidateTicket(ctx context.Context, ticket string)( TicketContext, bool){
    log.Println("Validating ticket..")
    val, ok := tm.tickets.Load(ticket)

    if !ok {
        log.Println("ticket doesn exisst!!!")
        return TicketContext{}, false
    }

    tm.tickets.Delete(ticket)
    return val.(TicketContext), true
}