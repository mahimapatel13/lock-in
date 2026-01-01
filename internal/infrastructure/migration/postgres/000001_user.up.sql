SET event_scheduler = ON;

CREATE SCHEMA IF NOT EXISTS user_schema;

CREATE TABLE IF NOT EXISTS user_schema.users(
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR NOT NULL UNIQUE,
    email VARCHAR NOT NULL UNIQUE,
    hashed_password VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS user_schema.refresh_tokens(
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL,
    refresh_token VARCHAR NOT NULL,
    expiration_date DATE NOT NULL,

    CONSTRAINT fk_uuid FOREIGN KEY (uuid) 
    REFERENCES user_schema.users
    ON DELETE CASCADE
);
-- Create indexes for faster lookups
CREATE INDEX idx_user_username ON user_schema.users (username);
CREATE INDEX idx_user_email ON user_schema.users (email);
CREATE INDEX idx_user_uuid ON user_schema.users (uuid);
CREATE INDEX idx_refresh_token ON user_schema.refresh_tokens(refresh_token);

