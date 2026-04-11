const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: String,
  url: String,
  type: { type: String, enum: ['video', 'article', 'practice', 'book', 'course'], default: 'article' },
  duration: String, // e.g., "30 min"
}, { _id: false });

const topicSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  subject: {
    type: String,
    enum: ['dsa', 'webdev', 'ml', 'db', 'systemDesign', 'soft-skills', 'projects'],
  },
  difficulty: { type: Number, min: 1, max: 5, default: 1 },
  estimatedHours: { type: Number, default: 2 },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started',
  },
  xpReward: { type: Number, default: 50 },
  resources: [resourceSchema],
  completedAt: { type: Date, default: null },
  startedAt: { type: Date, default: null },
}, { _id: false });

const learningPathSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,  // one path per user (updated over time)
    index: true,
  },
  topics: [topicSchema],
  currentPhase: { type: Number, default: 1 },
  targetRole: { type: String, default: '' },
  generatedAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  totalTopics: { type: Number, default: 0 },
  completedTopics: { type: Number, default: 0 },
  progressPercent: { type: Number, default: 0 },
}, {
  timestamps: true,
});

// ── Pre-save: recount stats ───────────────────────────────────────
learningPathSchema.pre('save', function (next) {
  this.totalTopics = this.topics.length;
  this.completedTopics = this.topics.filter(t => t.status === 'completed').length;
  this.progressPercent = this.totalTopics
    ? Math.round((this.completedTopics / this.totalTopics) * 100)
    : 0;
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('LearningPath', learningPathSchema);
