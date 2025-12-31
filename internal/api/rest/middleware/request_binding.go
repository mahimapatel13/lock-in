package middleware

import (
	"errors"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

type ErrorMsg struct {
    Field   string `json:"field"`
    Message string `json:"message"`
}

// ReqValidate middleware parses and validate incoming JSON request data.
func ReqValidate[T any]() gin.HandlerFunc{
    return func (c *gin.Context){
        var params T

        if err := c.BindJSON(&params); err != nil{
            // handle validation errors
            var ve validator.ValidationErrors
            if errors.As(err, &ve){
                out := make([]ErrorMsg, len(ve))
                for i, fe := range ve {
                    out[i] = ErrorMsg{fe.Field(), getErrorMsg(fe)}
                }
                c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"errors": out})
                return
            }
            c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format"})
            return
        }

        c.Set("reqBody", params)
        if _, ex := c.Get("reqBody"); !ex {
            log.Println("errorroror")
            c.Abort()
        }

        log.Println("heyyeey")

        
        c.Next()  
    }  
}

func getErrorMsg(fe validator.FieldError) string {
    switch fe.Tag(){
    case "required":
        return "This field is required."
    case "lte":
        return "Should be less than " + fe.Param()
    case "gte":
        return "Should be greater than " + fe.Param()
    case "min":
        return "Min value is " + fe.Param()
    case "max":
        return "Max value is " + fe.Param()
    case "oneof":
        return "Should be one of " + fe.Param()        
    }
    return "Unknown error"
}