BEGIN;

TRUNCATE
    users
    RESTART IDENTITY CASCADE;

INSERT INTO users
    (username, location, user_email, user_password, user_fullname, artist)

VALUES
('Vctrjrvs', 'Tampa', 'vctrjrvs@gmail.com', 'torypassword', 'Tory Jarvis', 'false'),
('Markiplier', 'Los Angeles', 'annus@unusannus.com', 'markpassword', 'Mark Fishbach', 'false'),
('CrankGamePlays', 'Los Angeles', 'unus@unusannus.com', 'ethanpassword', 'Ethan Nestor', 'false');

COMMIT;