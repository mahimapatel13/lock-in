CREATE SCHEMA IF NOT EXISTS study_schema;

CREATE TABLE IF NOT EXISTS study_schema.start_session (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    start_time TIMESTAMP NOT NULL, 

    CONSTRAINT fk_uuid FOREIGN KEY (user_id) 
    REFERENCES user_schema.users
    ON DELETE CASCADE 
);

CREATE TABLE IF NOT EXISTS study_schema.study_session (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    session_duration INT NOT NULL,
    end_time TIMESTAMP NOT NULL, 

    CONSTRAINT fk_uuid FOREIGN KEY (user_id) 
    REFERENCES user_schema.users
    ON DELETE CASCADE 
);

CREATE INDEX idx_study_uuid ON study_schema.start_session (user_id);


CREATE INDEX idx_session_uuid ON study_schema.study_session (user_id);


