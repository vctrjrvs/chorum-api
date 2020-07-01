const { expect } = require('chai')
const supertest = require('supertest')
process.env.JWT_SECRET = 'test-jwt-secret'

require('dotenv').config()

process.env.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL
  || 'postgresql://vctrjrvs@localhost/chorum-test'

global.expect = expect
global.supertest = supertest