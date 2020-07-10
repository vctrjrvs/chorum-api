const express = require('express')
const artistsService = require('./artists-service')

const artistsRouter = express.Router()
const jsonParser = express.json()

artistsRouter
  .route('/')
  .get((req, res, next) => {
    artistsService.getAllArtists(req.app.get('db'))
      .then(artists => {
        res.json(artists.map(artistsService.serializeArtist))
      })
      .catch(next)
  });

artistsRouter
  .route('/:id')
  .all(checkArtistExists)
  .get((req, res) => {
    res.json(artistsService.serializeArtist(res.artist))
  });

/* async/await syntax for promises */
async function checkArtistExists(req, res, next) {
  try {
    const artist = await artistsService.getById(
      req.app.get('db'),
      req.params.id
    )
      console.log(artist)
    if (!artist)
      return res.status(404).json({
        error: { 
          message: `Artist Not Found` 
        }
      })

    res.artist = artist
    next()
  } catch (error) {
    next(error)
  };
};

module.exports = artistsRouter