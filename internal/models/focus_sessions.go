package models

import(
    "time"
    guuid "github.com/google/uuid"
)

type FocusSession struct {
    UserID   *guuid.UUID
    StartedAt time.Time
    EndedAt time.Time
}