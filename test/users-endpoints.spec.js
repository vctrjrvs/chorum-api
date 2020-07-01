const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Users Endpoints', function () {
  let db

  const { testUsers } = helpers.makeUsersFixtures()
  const testUser = testUsers[0]

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

  describe(`POST /api/users`, () => {
    context(`User Validation`, () => {
      beforeEach('insert users', () =>
        helpers.seedUsers(
          db,
          testUsers,
        )
      )

      const requiredFields = ['username', 'password', 'artist_name', 'user_email']

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          username: 'test username',
          password: 'Password1234!',
          user_email: 'test user@email.com',
          artist_name: 'test artist_name',
          genre: 'test genre',
          about: 'test about',
          associated_acts: 'test acts',
          headline: 'test headline',
          location: 'test location'
        }

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field]

          return supertest(app)
            .post('/api/users')
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            })
        })
      })

      it(`responds 400 'Password be longer than 8 characters' when empty password`, () => {
        const userShortPassword = {
          username: 'test username',
          password: 'Passwor',
          genre: 'test genre',
          artist_name: 'test artist_name',
          user_email: 'test user@email.com',
          headline: 'test headline',
          about: 'test about',
          associated_acts: 'test acts',
          location: 'test location'
        }
        return supertest(app)
          .post('/api/users')
          .send(userShortPassword)
          .expect(400, { error: `Password be longer than 8 characters` })
      })

      it(`responds 400 'Password be less than 72 characters' when long password`, () => {
        const userLongPassword = {
          username: 'test username',
          password: '*'.repeat(73),
          artist_name: 'test artist_name',
          genre: 'test genre',
          headline: 'test headline',
          user_email: 'test user@email.com',
          about: 'test about',
          associated_acts: 'test acts',
          location: 'test location'
        }
        return supertest(app)
          .post('/api/users')
          .send(userLongPassword)
          .expect(400, { error: `Password be less than 72 characters` })
      })

      it(`responds 400 error when password starts with spaces`, () => {
        const userPasswordStartsSpaces = {
          username: 'test username',
          password: ' 1Aa!2Bb@',
          artist_name: 'test artist_name',
          headline: 'test headline',
          genre: 'test genre',
          user_email: 'test user@email.com',
          about: 'test about',
          associated_acts: 'test acts',
          location: 'test location'
        }
        return supertest(app)
          .post('/api/users')
          .send(userPasswordStartsSpaces)
          .expect(400, { error: `Password must not start or end with empty spaces` })
      })

      it(`responds 400 error when password ends with spaces`, () => {
        const userPasswordEndsSpaces = {
          username: 'test username',
          password: '1Aa!2Bb@ ',
          genre: 'test genre',
          artist_name: 'test artist_name',
          user_email: 'test user@email.com',
          headline: 'test headline',
          about: 'test about',
          associated_acts: 'test acts',
          location: 'test location'
        }
        return supertest(app)
          .post('/api/users')
          .send(userPasswordEndsSpaces)
          .expect(400, { error: `Password must not start or end with empty spaces` })
      })

      it(`responds 400 error when password isn't complex enough`, () => {
        const userPasswordNotComplex = {
          username: 'test username',
          password: '11AAaabb',
          headline: 'test headline',
          artist_name: 'test artist_name',
          genre: 'test genre',
          user_email: 'test user@email.com',
          about: 'test about',
          associated_acts: 'test acts',
          location: 'test location'
        }
        return supertest(app)
          .post('/api/users')
          .send(userPasswordNotComplex)
          .expect(400, { error: `Password must contain one upper case, lower case, number and special character` })
      })

      it(`responds 400 'User name already taken' when username isn't unique`, () => {
        const duplicateUser = {
          username: testUser.username,
          headline: 'test headline',
          password: '11AAaa!!',
          genre: 'test genre',
          artist_name: 'test artist_name',
          user_email: 'test user@email.com',
          about: 'test about',
          associated_acts: 'test acts',
          location: 'test location'
        }
        return supertest(app)
          .post('/api/users')
          .send(duplicateUser)
          .expect(400, { error: `Username already taken` })
      })
    })

    context(`Happy path`, () => {
      it(`responds 201, serialized user, storing bcryped password`, () => {
        const newUser = {
          username: 'test username',
          password: '11AAaa!!',
          artist_name: 'test artist_name',
          genre: 'test genre',
          user_email: 'test user@email.com',
          headline: 'test headline',
          about: 'test about',
          associated_acts: 'test acts',
          location: 'test location'
        }
        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('id')
            expect(res.body.username).to.eql(newUser.username)
            expect(res.body.artist_name).to.eql(newUser.artist_name)
            expect(res.body.genre).to.eql('test genre')
            expect(res.body.about).to.eql('test about')
            expect(res.body.headline).to.eql('test headline')
            expect(res.body.associated_acts).to.eql('test acts')
            expect(res.body.location).to.eql('test location')
            expect(res.body).to.not.have.property('password')
            expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
          })
          .then(res =>
            db
              .from('users')
              .select('*')
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.username).to.eql(newUser.username)
                expect(row.artist_name).to.eql(newUser.artist_name)
                expect(row.genre).to.eql('test genre')
                expect(row.location).to.eql('test location')
                expect(row.about).to.eql('test about')
                expect(row.headline).to.eql('test headline')
                expect(row.associated_acts).to.eql('test acts')

                return bcrypt.compare(newUser.password, row.password)
              })
              .then(compareMatch => {
                expect(compareMatch).to.be.true
              })
              .catch()
          )
      })
    })
  })
})