const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  id: String,
  subject: { type: String, enum: ['dsa', 'webdev', 'ml', 'db', 'systemDesign'] },
  difficulty: { type: Number, min: 1, max: 5 },
  question: String,
  options: [String],
  answer: Number, // index of correct option
  explanation: String,
}, { _id: false });

const answerSchema = new mongoose.Schema({
  questionId: String,
  selectedOption: Number,
  isCorrect: Boolean,
  timeTaken: Number, // seconds
}, { _id: false });

const scoresSchema = new mongoose.Schema({
  dsa: { type: Number, default: 0 },
  webdev: { type: Number, default: 0 },
  ml: { type: Number, default: 0 },
  db: { type: Number, default: 0 },
  systemDesign: { type: Number, default: 0 },
}, { _id: false });

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  questions: [questionSchema],
  answers: [answerSchema],
  scores: scoresSchema,
  overallScore: { type: Number, default: 0 },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  weakAreas: [{ type: String }],
  strongAreas: [{ type: String }],
  mlConfidence: { type: Number, default: 0 },  // from Python ML
  mlRecommendations: [{ type: String }],
  completedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

// ── Pre-save: compute overall score + weak/strong areas ──────────
assessmentSchema.pre('save', function (next) {
  if (this.scores) {
    const values = Object.values(this.scores.toObject ? this.scores.toObject() : this.scores);
    this.overallScore = values.length
      ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
      : 0;

    const subjects = ['dsa', 'webdev', 'ml', 'db', 'systemDesign'];
    this.weakAreas = subjects.filter(s => (this.scores[s] || 0) < 50);
    this.strongAreas = subjects.filter(s => (this.scores[s] || 0) >= 75);
  }
  next();
});

module.exports = mongoose.model('Assessment', assessmentSchema);
