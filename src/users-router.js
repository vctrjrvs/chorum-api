const express = require('express')
const path = require('path')
const UsersService = require('./users-service')
const {requireAuth} = require('./middleware/jwt-auth')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
     .post('/', jsonBodyParser, (req, res, next) => {
          const { username, user_email, password, location, genre, artist_name } = req.body
          for (const field of ['username', 'user_email', 'password', 'location', 'genre', 'artist_name'])
               if (!req.body[field])
                    return res.status(400).json({
                         error: `Missing '${field}' in request body`
                    })
          const passwordError = UsersService.validatePassword(password)
          if (passwordError)
               return res.status(400).json({ error: passwordError })
          UsersService.hasUserWithUserName(
               req.app.get('db'),
               username
          )
               .then(hasUserWithUserName => {
                    if (hasUserWithUserName)
                         return res.status(400).json({ error: `Username already taken` })

                    return UsersService.hashPassword(password)
                         .then(hashedPassword => {
                              const newUser = {
                                   username,
                                   user_email,
                                   password: hashedPassword,
                                   location,
                                   genre,
                                   artist_name,
                              }
                              return UsersService.insertUser(
                                   req.app.get('db'),
                                   newUser
                              )
                                   .then(user => {
                                        res
                                             .status(201)
                                             .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                             .json(UsersService.serializeUser(user))
                                   })
                         })
               })
               .catch(next)

     });

usersRouter
     .patch('/:userId', jsonBodyParser, requireAuth, (req, res, next) => {
          if (req.user.id != req.params.userId) {
               return res.status(401).json({
                    error: { message: `You are not authorized to edit this user` }
               })
          }
          const { location, genre, artist_name } = req.body
          const userToUpdate = { location, genre, artist_name }
          const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
          if (numberOfValues === 0) {
               return res.status(400).json({
                    error: { message: `Request body must contain either 'location', 'genre' or 'artist_name'` }
               })
          }
          UsersService.updateUser(
               req.app.get('db'),
               req.user.id, // TODO: GET USERID FROM AUTHENTICATED USER, NOT THE URL
               userToUpdate
          )
               .then(numRowsAffected => {
                    res.status(204).end()
               })
               .catch(next)
     })

module.exports = usersRouter