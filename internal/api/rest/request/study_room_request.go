package request


type RecordSessionRequest struct {
    SessionType string `json:"session_type" validate:"required,oneof=focus break"`
    SesionDuration uint32 `json:"session_duration" validate:"required,gt=10"`
}