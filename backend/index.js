const express = require('express');
const cors = require('cors');
const pool = require('./db');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const pollRoutes = require('./routes/pollRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// auth routes
app.use('/api/auth', authRoutes);
app.use('/api/polls', pollRoutes);

// test route za povezavo z bazo
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: 'Backend in baza delata',
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Napaka pri povezavi z bazo' });
  }
});

// zaščiten endpoint za test tokena
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'Dostop dovoljen',
    user: req.user,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server teče na portu ${PORT}`);
});