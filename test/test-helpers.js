const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      username: 'test-user-1',
      artist_name: 'Test user 1',
      location: 'TU1',
      password: 'password',
      genre: 'test genre',
    },
    {
      id: 2,
      username: 'test-user-2',
      artist_name: 'Test user 2',
      location: 'TU2',
      password: 'password',
      genre: 'test genre',
    },
    {
      id: 3,
      username: 'test-user-3',
      artist_name: 'Test user 3',
      location: 'TU3',
      password: 'password',
      genre: 'test genre',
    },
    {
      id: 4,
      username: 'test-user-4',
      artist_name: 'Test user 4',
      location: 'TU4',
      password: 'password',
      genre: 'test genre',
    },
  ]
}

function makeArtistsFixtures() {
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
        trx.raw(`ALTER SEQUENCE artists_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('artists_id_seq', 0)`),
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

module.exports = {
  makeUsersArray,
  makeArtistsFixtures,
  cleanTables,
  seedArtistsTables,
  makeAuthHeader,
  seedUsers,
}