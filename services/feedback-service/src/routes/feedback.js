const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { authenticateToken } = require('../middleware/auth');
const { verifySwapCompletion } = require('../services/swapService');

// Submit feedback
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { swapOfferId, givenTo, rating, comment, skillTaught } = req.body;

    // Verify that the swap is completed
    const isCompleted = await verifySwapCompletion(swapOfferId);
    if (!isCompleted) {
      return res.status(400).json({ message: 'Cannot give feedback before swap completion' });
    }

    const feedback = new Feedback({
      swapOfferId,
      givenBy: req.user.userId,
      givenTo,
      rating,
      comment,
      skillTaught
    });

    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting feedback', error: error.message });
  }
});

// Get user's received feedback
router.get('/received/:userId', authenticateToken, async (req, res) => {
  try {
    const feedback = await Feedback.find({ givenTo: req.params.userId })
      .sort('-createdAt');
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback', error: error.message });
  }
});

// Get user's rating statistics
router.get('/stats/:userId', authenticateToken, async (req, res) => {
  try {
    const stats = await Feedback.aggregate([
      { $match: { givenTo: req.params.userId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 },
          skillEffectiveness: { $avg: '$skillTaught.effectiveness' }
        }
      }
    ]);

    res.json(stats[0] || { averageRating: 0, totalRatings: 0, skillEffectiveness: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

module.exports = router;