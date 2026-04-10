
-- tabela uporabnikov
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- tabela anket
CREATE TABLE polls (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    user_id INTEGER REFERENCES users(id)
);

-- tabela opcij
CREATE TABLE options (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE
);

-- tabela glasov
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    option_id INTEGER REFERENCES options(id),
    UNIQUE(user_id, option_id)
);