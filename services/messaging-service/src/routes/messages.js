const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { authenticateToken } = require('../middleware/auth');
const { emitNewMessage } = require('../websocket');

// Send message
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { recipient, content } = req.body;
    
    const message = new Message({
      sender: req.user.userId,
      recipient,
      content
    });

    await message.save();

    // Emit real-time message event
    emitNewMessage(message);

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
});

// Get conversation history
router.get('/conversation/:userId', authenticateToken, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.userId, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user.userId }
      ]
    })
    .sort('createdAt')
    .limit(50);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
});

// Mark messages as read
router.patch('/read/:senderId', authenticateToken, async (req, res) => {
  try {
    await Message.updateMany(
      {
        sender: req.params.senderId,
        recipient: req.user.userId,
        read: false
      },
      { read: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking messages as read', error: error.message });
  }
});

module.exports = router;