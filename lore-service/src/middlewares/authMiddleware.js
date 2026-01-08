const axios = require('axios');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Appelle auth-service pour vérifier le token
    const response = await axios.get(`${process.env.AUTH_SERVICE_URL}/auth/me`, {
      headers: { Authorization: authHeader }
    });

    req.user = response.data;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { authenticate };
