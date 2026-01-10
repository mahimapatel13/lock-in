CREATE SCHEMA IF NOT EXISTS leaderboard_schema;

CREATE TABLE IF NOT EXISTS leaderboard_schema.leaderboard(
    id SERIAL PRIMARY KEY,
    leaderboard_date DATE NOT NULL,
    user_id UUID NOT NULL,
    minutes_focused INT NOT NULL ,

    CONSTRAINT fk_uuid FOREIGN KEY (user_id)
    REFERENCES user_schema.users
    ON DELETE CASCADE
);

CREATE INDEX idx_date ON leaderboard_schema.leaderboard(leaderboard_date);
CREATE INDEX idx_user ON leaderboard_schema.leaderboard(user_id);

