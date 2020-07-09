# Chorum API

![GitHub package.json version](https://img.shields.io/github/package-json/v/vctrjrvs/Chorum-App?style=for-the-badge)

Programmed by **Victor Jarvis** for Thinkful's Software Engineering Immersion Program.

This was created using Javascript, Node.js, and PostgreSQL.

Live Client Project Link: <https://chorum-app.vctrjrvs.vercel.app/>

## API Documentation

---

## Post User

Posts the users data to the database.

**URL**<br />
'/api/users'

**Method**<br />
'GET'

**Data Params (Required)**<br />
     Username, Email, Password, Location, Genre, Artist Name, About, Associated Acts, Headline

**Success Response**<br />
     *Code:* 201<br />
     *Content:* id, username, user_email, password, location, genre, artist_name, about, associated_acts, headline

**Error Response** <br />
     *Code:* 400<br />
     *Content:* 'Missing field in request body' <br />
     *Code:* 400<br />
     *Content:* 'Password be longer than 8 characters'<br />
     OR 'Password be less than 72 characters' <br />
     OR 'Password must not start or end with empty spaces'<br />
     OR 'Password must contain one upper case, lower case, number and special character'<br />
     *Code:* 400<br />
     *Content:* 'Username already taken'

---

## Patch User

Allows a user to edit their profile's information.

**URL**<br />
'api/users/:userId'

**Method**<br />
'PATCH'

**Data Params (Required)**<br />
     Username, Email, Password, Location, Genre, Artist Name, About, Associated Acts, Headline

**Success Response**<br />
     *Code:* 201<br />
     *Content:* id, username, user_email, password, location, genre, artist_name, about, associated_acts, headline

**Error Response** <br />
     *Code:* 400<br />
     *Content:* Request body must contain either 'location', 'genre', 'artist_name', 'about', 'associated_acts', 'headline' <br />
     *Code:* 401 UNAUTHORIZED<br />
     *Content:* 'You are not authorized to edit this user'<br />
