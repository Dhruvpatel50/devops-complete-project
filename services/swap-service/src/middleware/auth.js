const axios = require('axios');

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify token with auth service
    const response = await axios.post(
      `${process.env.AUTH_SERVICE_URL}/api/auth/verify`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    req.user = response.data;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = {
  authenticateToken
};
