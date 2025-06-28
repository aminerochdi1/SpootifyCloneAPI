const express = require('express');
const router = express.Router();
const Song = require('../models/Song');

// GET all songs
router.get('/', async (req, res) => {
  try {
    const { title } = req.query;
    let songs;

    if (title) {
      songs = await Song.find({ $text: { $search: title } });
    } else {
      songs = await Song.find({});
    }

    res.json(songs);
  } catch (error) {
    console.error('Erreur lors de la récupération des chansons :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST create new song
router.post('/', async (req, res) => {
  try {
    const song = new Song(req.body);
    await song.save();
    res.status(201).json(song);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET song by ID
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Chanson non trouvée' });
    }
    res.json(song);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});


// DELETE a song by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedSong = await Song.findByIdAndDelete(req.params.id);
    if (!deletedSong) {
      return res.status(404).json({ message: 'Chanson non trouvée' });
    }
    res.status(200).json({ message: 'Chanson supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
});


module.exports = router;
