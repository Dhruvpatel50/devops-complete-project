const express = require('express');
const router = express.Router();
const SwapOffer = require('../models/SwapOffer');
const { authenticateToken } = require('../middleware/auth');
const { notifyUser } = require('../services/notification');

// Create swap offer
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { offeredTo, offeredSkill, requestedSkill, description } = req.body;
    
    const swapOffer = new SwapOffer({
      offeredBy: req.user.userId,
      offeredTo,
      offeredSkill,
      requestedSkill,
      description
    });

    await swapOffer.save();

    // Notify the other user
    await notifyUser(offeredTo, 'new-swap-offer', {
      offerId: swapOffer._id,
      offeredBy: req.user.userId
    });

    res.status(201).json(swapOffer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating swap offer', error: error.message });
  }
});

// Get swap offers for user
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const swaps = await SwapOffer.find({
      $or: [
        { offeredBy: req.params.userId },
        { offeredTo: req.params.userId }
      ]
    }).sort('-createdAt');

    res.json(swaps);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching swap offers', error: error.message });
  }
});

// Update swap offer status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const swapOffer = await SwapOffer.findById(req.params.id);

    if (!swapOffer) {
      return res.status(404).json({ message: 'Swap offer not found' });
    }

    if (swapOffer.offeredTo !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this swap offer' });
    }

    swapOffer.status = status;
    await swapOffer.save();

    // Notify the offer creator
    await notifyUser(swapOffer.offeredBy, 'swap-offer-updated', {
      offerId: swapOffer._id,
      status
    });

    res.json(swapOffer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating swap offer', error: error.message });
  }
});

module.exports = router;