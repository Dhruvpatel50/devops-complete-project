const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');
const { authenticateToken } = require('../middleware/auth');

// Get user profile
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ userId: req.params.userId });
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});

// Create or update user profile
router.put('/:userId', authenticateToken, async (req, res) => {
  try {
    const { name, email, skills, desiredSkills, bio, location } = req.body;
    const userId = req.params.userId;

    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { name, email, skills, desiredSkills, bio, location },
      { new: true, upsert: true }
    );

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile', error: error.message });
  }
});

// Search users by skills
router.get('/search/skills', authenticateToken, async (req, res) => {
  try {
    const { skill, level } = req.query;
    const query = {
      'skills.name': skill
    };
    if (level) {
      query['skills.level'] = level;
    }

    const users = await UserProfile.find(query);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error searching users', error: error.message });
  }
});

module.exports = router;