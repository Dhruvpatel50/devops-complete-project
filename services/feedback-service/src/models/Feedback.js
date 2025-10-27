const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  swapOfferId: {
    type: String,
    required: true,
    ref: 'SwapOffer'
  },
  givenBy: {
    type: String,
    required: true,
    ref: 'UserProfile'
  },
  givenTo: {
    type: String,
    required: true,
    ref: 'UserProfile'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: String,
  skillTaught: {
    name: String,
    effectiveness: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// A user can only give one feedback per swap offer
feedbackSchema.index({ swapOfferId: 1, givenBy: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema);