const mongoose = require('mongoose');

const swapOfferSchema = new mongoose.Schema({
  offeredBy: {
    type: String,
    required: true,
    ref: 'UserProfile'
  },
  offeredTo: {
    type: String,
    required: true,
    ref: 'UserProfile'
  },
  offeredSkill: {
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    }
  },
  requestedSkill: {
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

swapOfferSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('SwapOffer', swapOfferSchema);