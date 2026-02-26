package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	DatabaseConfig DatabaseConfig
	SMTPConfig     SMTPConfig
	JWTConfig      JWTConfig
}

type SMTPConfig struct {
	User       string
	Password   string
	Host       string
	Address    string
	MaxRetries int
	Sender     string
}
type DatabaseConfig struct {
	Port         string
	User         string
	Password     string
	DatabaseName string
	Host         string
	Address      string
	DatabaseURL  string
}

type JWTConfig struct {
	Secret        string
	RefreshSecret string
}

func getEnvValue(key string, defaultValue string) string {
	if value, ok := os.LookupEnv(key); ok && value != "" {
		return value
	}

	return defaultValue
}

func LoadEnv() Config {
	log.Println("Loading environment configuration")

	// Try loading .env only for local development
	err := godotenv.Load(".env")
	if err != nil {
		log.Println(".env file not found — assuming production environment")
	}

	dbConfig := loadDBConfig()
	smtpConfig := loadSMTPConfig()
	jwtConfig := loadJWTConfig()

	config := Config{
		DatabaseConfig: dbConfig,
		SMTPConfig:     smtpConfig,
		JWTConfig:      jwtConfig,
	}

	return config
}

// Loads JWT Config
func loadJWTConfig() JWTConfig {
	secret := getEnvValue("JWT_SECRET", "DEFAULT_JWT_SECRET")
	refresh := getEnvValue("REFRESH_SECRET", "DEFAULT_REFRESH_SECRET")

	jwtConfig := JWTConfig{
		Secret:        secret,
		RefreshSecret: refresh,
	}

	return jwtConfig
}

// Loads DB Config
func loadDBConfig() DatabaseConfig {
	user := getEnvValue("DB_USER", "DEFAULT_DB_USER")
	pass := getEnvValue("DB_PASS", "DEFAULT_DB_PASS")
	name := getEnvValue("DB_NAME", "DEFUALT_DB_NAME")
	host := getEnvValue("DB_HOST", "DEFAULT_DB_HOST")
	addr := getEnvValue("DB_ADDR", "DEFAULT_DB_ADDR")
	port := getEnvValue("DB_PORT", "DEFAULT_DB_PORT")
	url := getEnvValue("DB_URL", "defualt")

	dbConfig := DatabaseConfig{
		User:         user,
		Password:     pass,
		DatabaseName: name,
		Host:         host,
		Address:      addr,
		Port:         port,
		DatabaseURL:  url,
	}

	return dbConfig
}

// Loads SMTP Config
func loadSMTPConfig() SMTPConfig {
	user := getEnvValue("SMTP_USER", "DEFAULT_SMTP_USER")
	pass := getEnvValue("SMTP_PASS", "DEFAULT_SMTP_PASS")
	host := getEnvValue("SMTP_HOST", "DEFAULT_SMTP_HOST")
	addr := getEnvValue("SMTP_ADDR", "DEFAULT_SMTP_ADDR")
	sender := getEnvValue("SMTP_SENDER", "DEFAULT_SMTP_SENDER")

	maxretries := getEnvValue("SMTP_MAX_RETRIES", "DEFAULT_SMTP_MAX_RETRIES")

	retry, err := strconv.Atoi(maxretries)

	if err != nil {
		log.Fatalf("Error in reading max retires for SMTP from .env file")
	}

	smtpConfig := SMTPConfig{
		User:       user,
		Password:   pass,
		Host:       host,
		Address:    addr,
		Sender:     sender,
		MaxRetries: retry,
	}

	return smtpConfig
}
