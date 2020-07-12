const xss = require('xss');

const ArtistsService = {
  getAllArtists(db) {
    return db
      .from('users')
      .select(
        'id',
        'artist_name',
        'location',
        'genre',
        'about',
        'associated_acts',
        'headline',
      );
  },

  getById(db, id) {
    return ArtistsService.getAllArtists(db)
      .where('id', id)
      .first();
  },

  serializeArtist(artist) {
    return {
      id: artist.id,
      artist_name: xss(artist.artist_name),
      username: artist.username,
      location: xss(artist.location),
      genre: xss(artist.genre),
      about: artist.about,
      associated_acts: artist.associated_acts,
      headline: artist.headline,
    };
  },
};

module.exports = ArtistsService;