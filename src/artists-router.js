const express = require('express')
const artistsService = require('./artists-service')

const artistsRouter = express.Router()

artistsRouter
  .route('/roster')
  .get((req, res, next) => {
    artistsService.getAllartists(req.app.get('db'))
      .then(artists => {
        res.json(artists.map(artistsService.serializeArtist))
      })
      .catch(next)
  })

artistsRouter
  .route('/:artist_id')
  .all(checkArtistExists)
  .get((req, res) => {
    res.json(artistsService.serializeArtist(res.artist))
  })

/* async/await syntax for promises */
async function checkArtistExists(req, res, next) {
  try {
    const artist = await artistsService.getById(
      req.app.get('db'),
      req.params.artist_id
    )

    if (!artist)
      return res.status(404).json({
        error: `Artist doesn't exist`
      })

    res.artist = artist
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = artistsRouter