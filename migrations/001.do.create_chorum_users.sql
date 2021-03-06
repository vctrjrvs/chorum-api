CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    username TEXT NOT NULL UNIQUE,
    user_email TEXT NOT NULL,
    password TEXT NOT NULL,
    artist_name TEXT NOT NULL,
    genre TEXT NOT NULL,
    location TEXT NOT NULL,
    about TEXT,
    headline TEXT,
    associated_acts TEXT
);