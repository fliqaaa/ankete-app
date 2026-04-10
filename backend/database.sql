CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE polls (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_polls_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT chk_poll_time
        CHECK (end_time > start_time)
);

CREATE TABLE options (
    id SERIAL PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    poll_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_options_poll
        FOREIGN KEY (poll_id)
        REFERENCES polls(id)
        ON DELETE CASCADE
);

CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    poll_id INT NOT NULL,
    option_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_votes_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_votes_poll
        FOREIGN KEY (poll_id)
        REFERENCES polls(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_votes_option
        FOREIGN KEY (option_id)
        REFERENCES options(id)
        ON DELETE CASCADE,
    CONSTRAINT uq_user_poll_vote
        UNIQUE (user_id, poll_id)
);
