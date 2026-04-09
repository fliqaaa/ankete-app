// uvoz JWT
const jwt = require('jsonwebtoken');

// middleware funkcija
function authMiddleware(req, res, next) {
  try {
    // dobimo Authorization header
    const authHeader = req.headers.authorization;

    // če header ne obstaja
    if (!authHeader) {
      return res.status(401).json({ error: 'Ni tokena.' });
    }

    // format: "Bearer TOKEN"
    const token = authHeader.split(' ')[1];

    // če token ne obstaja
    if (!token) {
      return res.status(401).json({ error: 'Neveljaven token.' });
    }

    // preveri token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // shrani podatke uporabnika v request
    req.user = decoded;

    // nadaljuj na naslednji handler
    next();
  } catch (error) {
    console.error('Napaka pri preverjanju tokena:', error);
    return res.status(401).json({ error: 'Token ni veljaven.' });
  }
}

module.exports = authMiddleware;