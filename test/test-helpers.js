const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      username: 'test-user-1',
      artist_name: 'Test user 1',
      user_email: 'user@email.com',
      location: 'TU1',
      password: 'Password1234!',
      genre: 'test genre',
    },
    {
      id: 2,
      username: 'test-user-2',
      artist_name: 'Test user 2',
      user_email: 'user@email.com',
      location: 'TU2',
      password: 'Password1234!',
      genre: 'test genre',
    },
    {
      id: 3,
      username: 'test-user-3',
      artist_name: 'Test user 3',
      user_email: 'user@email.com',
      location: 'TU3',
      password: 'Password1234!',
      genre: 'test genre',
    },
    {
      id: 4,
      username: 'test-user-4',
      artist_name: 'Test user 4',
      user_email: 'user@email.com',
      location: 'TU4',
      password: 'Password1234!',
      genre: 'test genre',
    },
  ]
}

function makeUsersFixtures() {
  const testUsers = makeUsersArray()
  return { testUsers }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        users,
        artists
      `
    )
      .then(() =>
        Promise.all([
          // trx.raw(`ALTER SEQUENCE artists_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
          // trx.raw(`SELECT setval('artists_id_seq', 0)`),
          trx.raw(`SELECT setval('users_id_seq', 0)`),
        ])
      )
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('users').insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}

function seedArtistsTables(db, users, artists) {
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('artists').insert(artists)
    await trx.raw(
      `SELECT setval('artists_id_seq', ?)`,
      [artists[artists.length - 1].id],
    )
  })
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

function makeMaliciousUser(user) {
  const maliciousUser =
  {
    id: 911,
    username: 'test-malicious-user',
    artist_name: 'Explicit bad user name <script>alert("xss");</script>',
    user_email: 'baduser@email.com',
    location: 'TU4',
    password: 'Password1234!',
    genre: 'test genre',
    about: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
  }
  const expectedUser = {
    ...makeExpectedUser([user], maliciousUser),
    artist_name: 'Explicit bad user name <script>alert("xss");</script>',
    about: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousUser,
    expectedUser,
  }
}

function seedMaliciousUser(db, user) {
  return db
    .into('users')
    .insert([user])
}

module.exports = {
  makeUsersArray,
  makeUsersFixtures,
  cleanTables,
  seedArtistsTables,
  makeAuthHeader,
  seedUsers,
  makeMaliciousUser,
  seedMaliciousUser,
}