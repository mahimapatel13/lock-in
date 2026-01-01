
CREATE SCHEMA IF NOT EXISTS user_schema;

CREATE TABLE IF NOT EXISTS user_schema.users(
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR NOT NULL UNIQUE,
    email VARCHAR NOT NULL UNIQUE,
    hashed_password VARCHAR NOT NULL
);

-- Create indexes for faster lookups
CREATE INDEX idx_user_username ON user_schema.users (username);
CREATE INDEX idx_user_email ON user_schema.users (email);
CREATE INDEX idx_user_uuid ON user_schema.users (uuid);