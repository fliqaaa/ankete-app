const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
//register route
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email in geslo sta obvezna.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Geslo mora imeti vsaj 6 znakov.' });
    }

    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Uporabnik s tem emailom že obstaja.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, hashedPassword]
    );

    res.status(201).json({
      message: 'Uporabnik uspešno registriran.',
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error('Napaka pri registraciji:', error);
    res.status(500).json({ error: 'Napaka na strežniku.' });
  }
});
//login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email in geslo sta obvezna.' });
    }

    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Napačen email ali geslo.' });
    }

    const user = userResult.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Napačen email ali geslo.' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Prijava uspešna.',
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Napaka pri prijavi:', error);
    res.status(500).json({ error: 'Napaka na strežniku.' });
  }
});

const upload = require('../middleware/upload');

// upload avatarja
router.post('/upload-avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    const userId = req.user.id;

    const filePath = req.file.filename;

    await pool.query(
      'UPDATE users SET avatar = $1 WHERE id = $2',
      [filePath, userId]
    );

    res.json({
      message: 'Avatar uspešno naložen',
      avatar: filePath,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Napaka pri uploadu' });
  }
});

// vrne podatke prijavljenega uporabnika
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT id, email, avatar FROM users WHERE id = $1',
      [userId]
    );

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: 'Napaka pri pridobivanju uporabnika' });
  }
});

module.exports = router;