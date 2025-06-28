const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const multer = require('multer');

// STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  const upload = multer({ storage });



// GET all playlists with song data populated
router.get('/', async (req, res) => {
  const playlists = await Playlist.find().populate('songs');
  res.json(playlists);
});

// GET playlist by ID with songs populated
router.get('/:id', async (req, res) => {
    try {
      const playlist = await Playlist.findById(req.params.id).populate('songs');
      if (!playlist) {
        return res.status(404).json({ message: 'Playlist not found' });
      }
      res.json(playlist);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching playlist' });
    }
  });

// POST create new playlist
// router.post('/', async (req, res) => {
//   try {
//     const playlist = new Playlist(req.body);
//     await playlist.save();
//     res.status(201).json(playlist);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });
router.post('/', upload.single('image'), async (req, res) => {
    try {
      const { title, description } = req.body;
      let imageUrl = '';
  
      if (req.file) {
        // Enregistrer le chemin relatif vers l’image uploadée
        imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      }
  
      const playlist = new Playlist({
        title,
        description,
        image: imageUrl
      });
  
      await playlist.save();
      res.status(201).json(playlist);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

// Delete a playlist by id
router.delete('/:id', async (req, res) => {
    try {
      const playlistId = req.params.id;
      const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);
  
      if (!deletedPlaylist) {
        return res.status(404).json({ message: 'Playlist not found' });
      }
  
      res.status(200).json({ message: 'Playlist deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting playlist' });
    }
  });

  // PATCH : Ajouter des chansons à une playlist
router.patch('/:id', async (req, res) => {
    try {
      const playlistId = req.params.id;
      const { songIds } = req.body; // tableau d’ObjectId de chansons à ajouter
  
      if (!Array.isArray(songIds)) {
        return res.status(400).json({ message: "songIds must be an array" });
      }
  
      const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $addToSet: { songs: { $each: songIds } } }, // évite les doublons
        { new: true }
      ).populate('songs');
  
      if (!updatedPlaylist) {
        return res.status(404).json({ message: "Playlist not found" });
      }
  
      res.status(200).json(updatedPlaylist);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de l'ajout de chansons" });
    }
  });

  // PATCH /api/playlists/remove/:id/
  router.patch('/remove/:id', async (req, res) => {
    try {
      const playlistId = req.params.id;
      const { songIds } = req.body;
  
      if (!Array.isArray(songIds)) {
        return res.status(400).json({ message: "songIds must be an array" });
      }
  
      const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $pull: { songs: { $in: songIds } } },
        { new: true }
      ).populate('songs');
  
      if (!updatedPlaylist) {
        return res.status(404).json({ message: "Playlist not found" });
      }
  
      res.status(200).json(updatedPlaylist);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la suppression de chansons" });
    }
  });
  



module.exports = router;
