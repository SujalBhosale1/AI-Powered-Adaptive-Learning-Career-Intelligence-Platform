const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: [5000, 'Message too long'],
  },
  timestamp: { type: Date, default: Date.now },
  suggestions: [{ type: String }], // quick-reply suggestions from bot
}, { _id: false });

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // one chat document per user (growing message list)
    index: true,
  },
  messages: {
    type: [messageSchema],
    default: [],
  },
  totalMessages: { type: Number, default: 0 },
  lastMessageAt: { type: Date, default: null },
}, {
  timestamps: true,
});

// ── Pre-save: update stats ────────────────────────────────────────
chatHistorySchema.pre('save', function (next) {
  this.totalMessages = this.messages.length;
  if (this.messages.length > 0) {
    this.lastMessageAt = this.messages[this.messages.length - 1].timestamp;
  }
  // Keep only last 200 messages to prevent unbounded growth
  if (this.messages.length > 200) {
    this.messages = this.messages.slice(-200);
  }
  next();
});

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
