const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('GET /api/artists', () => {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  context(`Given no Artists`, () => {
    it(`responds with 200 and an empty list`, () => {
      return supertest(app)
        .get('/api/artists')
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(200, [])
    })
  })

  context('Given there are artists in the database', () => {

    beforeEach('insert artists', () => {
      const testArtists = helpers.makeArtistsArray()
        return db
          .into('users')
          .insert(testArtists)
    })

    it('responds with 200', () => {
      return supertest(app)
        .get('/api/artists')
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(200)
    })
  })
})

describe('GET /api/artists/:id', () => {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  context(`Given no artists`, () => {
    it(`responds 404 when the artist doesn't exist`, () => {
      return supertest(app)
        .get(`/api/artists/123`)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(404, {
          error: { message: `Artist Not Found` }
        })
    })
  })

  context('Given there are artists in the database', () => {
    const testArtists = helpers.makeArtistsArray()

    beforeEach('insert artists', () => {
      return db
        .into('users')
        .insert(testArtists)
    })

    it('responds with 200 and the specified artist', () => {
      const artistId = 1
      const expectedArtist =
      {
        id: 1,
        artist_name: 'Test artist 1',
        location: 'TA1',
        genre: 'test genre',
        about: null,
        associated_acts: null,
        headline: null
      }
      return supertest(app)
        .get(`/api/artists/${artistId}`)
        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        .expect(200, expectedArtist)
    })
  })
})