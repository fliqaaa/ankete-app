// osnovni moduli
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// import route-ov
const authRoutes = require('./routes/authRoutes');
const pollRoutes = require('./routes/pollRoutes');

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// 📁 statična mapa za slike (AVATARJI)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/polls', pollRoutes);

// test route (opcijsko)
app.get('/', (req, res) => {
  res.send('API deluje');
});

// server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server teče na portu ${PORT}`);
});