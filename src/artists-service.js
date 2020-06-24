const xss = require('xss')

const ArtistsService = {
  getAllArtists(db) {
    return db
      .from('artists')
      .select(
        'artist_id',
        'artist_name',
        'location',
        'genre',
      )
  },

  getById(db, id) {
    return ArtistsService.getAllArtists(db)
      .where('artist_id', id)
      .first()
  },

  serializeArtist(artist) {
    return {
      id: artist.artist_id,
      name: artist.artist_name,
      location: artist.location,
      genre: artist.genre
    }
  },
}

module.exports = ArtistsService