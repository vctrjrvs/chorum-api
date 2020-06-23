BEGIN;

INSERT INTO users
    (user_fullname, username, location, artist)
VALUES
('Tory Jarvis', 'Vctrjrvs', 'Tampa', 'false'),
('Mark Fishbach', 'Markiplier', 'Los Angeles', 'false'),
('Ethan Nestor', 'CrankGamePlays', 'Los Angeles', 'false');

COMMIT;