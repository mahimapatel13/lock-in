package ticket_manager

import "github.com/google/uuid"

type TicketContext struct {
	UserID uuid.UUID
    RoomID string
}