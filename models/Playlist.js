const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    image: String,
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }] // référence vers Song
  }, { timestamps: true });  

module.exports = mongoose.model('Playlist', playlistSchema);