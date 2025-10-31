CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    rating DECIMAL(3,1) NOT NULL,
    poster_emoji VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    movie_id INTEGER REFERENCES movies(id),
    status VARCHAR(50) DEFAULT 'active',
    video_time INTEGER DEFAULT 0,
    is_playing BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    avatar_emoji VARCHAR(10) NOT NULL,
    status VARCHAR(50) DEFAULT 'online',
    current_room_id INTEGER REFERENCES rooms(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(id),
    user_id INTEGER REFERENCES users(id),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO movies (title, genre, duration, rating, poster_emoji) VALUES
    ('Интерстеллар', 'Sci-Fi', '169 мин', 8.6, '🚀'),
    ('Гранд Будапешт', 'Комедия', '99 мин', 8.1, '🏨'),
    ('Начало', 'Триллер', '148 мин', 8.8, '🌀'),
    ('Зелёная миля', 'Драма', '189 мин', 8.6, '💚'),
    ('Форрест Гамп', 'Драма', '142 мин', 8.8, '🏃'),
    ('Матрица', 'Sci-Fi', '136 мин', 8.7, '🔴');

INSERT INTO users (name, avatar_emoji, status) VALUES
    ('Александр', '🎬', 'online'),
    ('Мария', '🍿', 'online'),
    ('Дмитрий', '🎥', 'offline'),
    ('Анна', '🎪', 'online');

INSERT INTO rooms (name, movie_id, status) VALUES
    ('Ночной сеанс', 1, 'active'),
    ('Комедийный вечер', 2, 'active'),
    ('Ужастики', 3, 'active');