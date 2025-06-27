const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({

    title: { type: String, required: true },
    artist: String,
    file: String, // URL ou chemin du fichier MP3
    coverImage: String,
  }, { timestamps: true });

module.exports = mongoose.model('Song', songSchema);
