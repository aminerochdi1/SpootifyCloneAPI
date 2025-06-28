const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const path = require('path');

// Routes
const songRoutes = require('./routes/song.routes');
const playlistRoutes = require('./routes/playlist.routes');

const env = require('./.env');

// Connexion MongoDB
require('./config/db');

const app = express();
const PORT = 3000;

// CORS
app.use(cors());

// using JSON data
app.use(bodyParser.json());

// Used ROUTES
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes);

// get REQUEST
app.get('/', (req, res) => {
  res.send('Welcome to Music API 🎶');
});

//path
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Checking MONGODB connection status

// PORT
process.env.PORT || 3000;
app.listen(PORT,()=> {
   console.log(
    `Server Running on Local PORT : http://localhost:${PORT}`
   );
});
