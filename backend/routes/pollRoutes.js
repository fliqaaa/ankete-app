const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


// 
// CREATE POLL
// 
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, options, start_time, end_time } = req.body;

    // preveri podatke
    if (!title || !options || options.length < 2) {
      return res.status(400).json({
        error: 'Anketa mora imeti naslov in vsaj 2 možnosti.',
      });
    }

    // user iz tokena
    const userId = req.user.id;

    // ustvari anketo
    const pollResult = await pool.query(
      `INSERT INTO polls (title, start_time, end_time, user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, start_time, end_time, userId]
    );

    const poll = pollResult.rows[0];

    // dodaj opcije
    for (let option of options) {
      await pool.query(
        `INSERT INTO options (text, poll_id)
         VALUES ($1, $2)`,
        [option, poll.id]
      );
    }

    res.status(201).json({
      message: 'Anketa ustvarjena',
      poll,
    });

  } catch (error) {
    console.error('Napaka pri ustvarjanju ankete:', error);
    res.status(500).json({ error: 'Napaka na strežniku.' });
  }
});

// 
// VOTE ON POLL
// 
router.post('/:pollId/vote', authMiddleware, async (req, res) => {
  try {
    // pollId dobimo iz URL-ja
    const { pollId } = req.params;

    // option_id dobimo iz body-ja
    const { option_id } = req.body;

    // user dobimo iz tokena
    const userId = req.user.id;

    // preveri, če je option_id podan
    if (!option_id) {
      return res.status(400).json({ error: 'Izbrana možnost je obvezna.' });
    }

    // 1. preveri, če anketa obstaja
    const pollResult = await pool.query(
      'SELECT * FROM polls WHERE id = $1',
      [pollId]
    );

    if (pollResult.rows.length === 0) {
      return res.status(404).json({ error: 'Anketa ne obstaja.' });
    }

    const poll = pollResult.rows[0];

    // 2. preveri časovno okno ankete
    const now = new Date();
    const startTime = new Date(poll.start_time);
    const endTime = new Date(poll.end_time);

    if (now < startTime || now > endTime) {
      return res.status(400).json({
        error: 'Anketa trenutno ni aktivna.',
      });
    }

    // 3. preveri, če opcija pripada tej anketi
    const optionResult = await pool.query(
      'SELECT * FROM options WHERE id = $1 AND poll_id = $2',
      [option_id, pollId]
    );

    if (optionResult.rows.length === 0) {
      return res.status(400).json({
        error: 'Izbrana možnost ne pripada tej anketi.',
      });
    }

    // 4. preveri, če je user že glasoval na tej anketi
    const existingVote = await pool.query(
      'SELECT * FROM votes WHERE user_id = $1 AND poll_id = $2',
      [userId, pollId]
    );

    if (existingVote.rows.length > 0) {
      return res.status(400).json({
        error: 'Na tej anketi si že glasoval.',
      });
    }

    // 5. shrani glas
    const voteResult = await pool.query(
      `INSERT INTO votes (user_id, poll_id, option_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, pollId, option_id]
    );

    res.status(201).json({
      message: 'Glas uspešno oddan.',
      vote: voteResult.rows[0],
    });
  } catch (error) {
    console.error('Napaka pri glasovanju:', error);
    res.status(500).json({ error: 'Napaka na strežniku.' });
  }
});


//
// GET ALL POLLS
//
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, start_time, end_time
      FROM polls
      ORDER BY created_at DESC
    `);

    res.json(result.rows);

  } catch (error) {
    console.error('Napaka pri pridobivanju anket:', error);
    res.status(500).json({ error: 'Napaka na strežniku.' });
  }
});


// 
// GET SINGLE POLL + OPTIONS
// 
router.get('/:pollId', async (req, res) => {
  try {
    // pollId dobimo iz URL-ja
    const { pollId } = req.params;

    // 1. pridobi anketo
    const pollResult = await pool.query(
      `SELECT id, title, start_time, end_time, user_id
       FROM polls
       WHERE id = $1`,
      [pollId]
    );

    // če anketa ne obstaja
    if (pollResult.rows.length === 0) {
      return res.status(404).json({ error: 'Anketa ne obstaja.' });
    }

    const poll = pollResult.rows[0];

    // 2. pridobi vse opcije za to anketo
    const optionsResult = await pool.query(
      `SELECT id, text
       FROM options
       WHERE poll_id = $1
       ORDER BY id ASC`,
      [pollId]
    );

    // 3. vrni anketo + opcije
    res.json({
      poll,
      options: optionsResult.rows,
    });
  } catch (error) {
    console.error('Napaka pri pridobivanju ankete:', error);
    res.status(500).json({ error: 'Napaka na strežniku.' });
  }
});

// 
// GET POLL RESULTS
// 
router.get('/:pollId/results', async (req, res) => {
  try {
    // pollId dobimo iz URL-ja
    const { pollId } = req.params;

    // 1. preveri, če anketa obstaja
    const pollResult = await pool.query(
      `SELECT id, title
       FROM polls
       WHERE id = $1`,
      [pollId]
    );

    if (pollResult.rows.length === 0) {
      return res.status(404).json({ error: 'Anketa ne obstaja.' });
    }

    const poll = pollResult.rows[0];

    // 2. preštej glasove za vsako opcijo
    const resultsResult = await pool.query(
      `SELECT 
          o.id,
          o.text,
          COUNT(v.id) AS votes_count
       FROM options o
       LEFT JOIN votes v ON o.id = v.option_id
       WHERE o.poll_id = $1
       GROUP BY o.id, o.text
       ORDER BY o.id ASC`,
      [pollId]
    );

    // 3. vrni naslov ankete in rezultate
    res.json({
      poll,
      results: resultsResult.rows,
    });
  } catch (error) {
    console.error('Napaka pri pridobivanju rezultatov:', error);
    res.status(500).json({ error: 'Napaka na strežniku.' });
  }
});

module.exports = router;