const xss = require('xss')

const ArtistsService = {
  getAllArtists(db) {
    return db
      .from('users')
      .select(
        'id',
        'artist_name',
        'location',
        'genre',
      )
  },

  getById(db, id) {
    return ArtistsService.getAllArtists(db)
      .where('id', id)
      .first()
  },

  serializeArtist(artist) {
    return {
      id: artist.id,
      name: artist.artist_name,
      location: artist.location,
      genre: artist.genre
    }
  },
}

module.exports = ArtistsService