BEGIN;

TRUNCATE
    users
    RESTART IDENTITY CASCADE;

INSERT INTO users
    (username, user_email, password, artist_name, genre, location)

VALUES
('deathvalleysocialclub', 'deathvalleysocialclub@gmail.com', 'Password1234!', 'Death Valley Social Club', 'Dubstep', 'Tampa'),
('pinkranger', 'pinkrangermusic@gmail.com', 'PRPassword1234!', 'Pink Ranger', 'Vaporwave', 'Miami'),
('shattered', 'shatteredsounds@gmail.com', 'SPassword1234!', 'Shattered', 'Metal', 'Florida');

COMMIT;