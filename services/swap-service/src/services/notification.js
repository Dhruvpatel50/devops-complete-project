const axios = require('axios');

// Minimal notification helper used by swap-service.
// It attempts to call the messaging-service to deliver a notification.
// If messaging-service is unavailable, it will log and resolve so it doesn't crash the service.
const notifyUser = async (userId, event, payload) => {
  try {
    if (!process.env.MESSAGING_SERVICE_URL) {
      // default to compose service name
      process.env.MESSAGING_SERVICE_URL = process.env.MESSAGING_SERVICE_URL || 'http://messaging-service:3004';
    }

    await axios.post(`${process.env.MESSAGING_SERVICE_URL}/api/notify`, {
      userId,
      event,
      payload
    });
  } catch (err) {
    // swallow errors in notification to avoid failing the swap flow
    console.warn('notifyUser failed (non-fatal):', err.message || err);
  }
};

module.exports = {
  notifyUser
};
