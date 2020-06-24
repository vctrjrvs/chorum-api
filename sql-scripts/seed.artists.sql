BEGIN;

TRUNCATE
    artists
    RESTART IDENTITY CASCADE;

INSERT INTO artists
    (artist_name, location, genre)
VALUES
('Death Valley Social Club', 'Tampa', 'Dubstep'),
('Pink Ranger', 'Miami', 'Vaporwave'),
('Shattered', 'Florida', 'Metal');

COMMIT;