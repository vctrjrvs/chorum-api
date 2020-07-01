const bcrypt = require('bcryptjs')
const xss = require('xss')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
  hasUserWithUserName(db, username) {
    return db('users')
      .where({ username })
      .first()
      .then(user => !!user)
  },
  updateUser(db, id, newUserFields) {
    return db('users')
      .where({ id })
      .update(newUserFields)
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(([user]) => user)
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password be longer than 8 characters'
    }
    if (password.length > 72) {
      return 'Password be less than 72 characters'
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces'
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain one upper case, lower case, number and special character'
    }
    return null
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12)
  },
  getUserById(db, id) {
    return db
      .from('users')
      .select(
        'id',
        'artist_name',
        'location',
        'genre',
      )
      .where('id', id)
      .first()
  },
  serializeUser(user) {
    return {
      id: user.id,
      username: xss(user.username),
      artist_name: xss(user.artist_name),
      genre: xss(user.genre),
      location: xss(user.location),
      about: xss(user.about),
      associated_acts: xss(user.associated_acts),
      headline: xss(user.headline),
    }
  }
}

module.exports = UsersService