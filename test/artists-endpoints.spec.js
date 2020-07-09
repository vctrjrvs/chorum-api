const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('GET /api/artists', () => {
     let db

     context(`Given no Artists`, () => {
       it(`responds with 200 and an empty list`, () => {
         return supertest(app)
           .get('/api/artists')
           .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
           .expect(200, [])
       })
     })
 
     context('Given there are Artists in the database', () => {
       const testArtists = helpers.makeArtistsArray()
 
       beforeEach('insert Artists', () => {
         return db
           .into('artists')
           .insert(testArtists)
       })
 
       it('gets the Artists from the store', () => {
         return supertest(app)
           .get('/api/artists')
           .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
           .expect(200, testArtists)
       })
     })
 
     context(`Given an XSS attack Artist`, () => {
       const { maliciousArtist, expectedArtist } = helpers.makeMaliciousArtist()
 
       beforeEach('insert malicious Artist', () => {
         return db
           .into('artists')
           .insert([maliciousArtist])
       })
 
       it('removes XSS attack content', () => {
         return supertest(app)
           .get(`/artists`)
           .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
           .expect(200)
           .expect(res => {
             expect(res.body[0].title).to.eql(expectedArtist.title)
             expect(res.body[0].description).to.eql(expectedArtist.description)
           })
       })
     })
   })
 
   describe('GET /api/artists/:id', () => {
     context(`Given no Artists`, () => {
       it(`responds 404 whe Artist doesn't exist`, () => {
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
 
       beforeEach('insert Artists', () => {
         return db
           .into('artists')
           .insert(testArtists)
       })
 
       it('responds with 200 and the specified Artist', () => {
         const artistId = 2
         const expectedArtist = testArtists[artistId - 1]
         return supertest(app)
           .get(`/api/artists/${artistId}`)
           .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
           .expect(200, expectedArtist)
       })
     })
 
     context(`Given an XSS attack Artist`, () => {
       const { maliciousArtist, expectedArtist } = helpers.makeMaliciousArtist()
 
       beforeEach('insert malicious Artist', () => {
         return db
           .into('Artists')
           .insert([maliciousArtist])
       })
 
       it('removes XSS attack content', () => {
         return supertest(app)
           .get(`/Artists/${maliciousArtist.id}`)
           .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
           .expect(200)
           .expect(res => {
             expect(res.body.title).to.eql(expectedArtist.title)
             expect(res.body.description).to.eql(expectedArtist.description)
           })
       })
     })
   })