package response

type TopUser struct {
	Username       string `json:"username"`
	MinutesFocused int    `json:"minutes_focused"`
	Rank           int    `json:"rank"`
}
