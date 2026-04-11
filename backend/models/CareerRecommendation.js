const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  matchPercent: { type: Number, min: 0, max: 100, default: 0 },
  requiredSkills: [{ type: String }],
  gapSkills: [{ type: String }],       // skills user is missing
  masteredSkills: [{ type: String }],   // skills user already has
  salaryRange: { type: String, default: '' },
  demandLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'very_high'],
    default: 'medium',
  },
  growthRate: { type: String, default: '' },
  roadmap: [{ type: String }],          // high-level learning roadmap steps
  topCompanies: [{ type: String }],
  description: { type: String, default: '' },
}, { _id: false });

const careerRecommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  },
  careers: [careerSchema],
  basedOnSkills: [{ type: String }],  // skills used to compute this
  topMatch: { type: String, default: '' },
  generatedAt: { type: Date, default: Date.now },
  mlConfidence: { type: Number, default: 0 },
}, {
  timestamps: true,
});

// ── Pre-save: sort careers by matchPercent desc ───────────────────
careerRecommendationSchema.pre('save', function (next) {
  if (this.careers && this.careers.length > 0) {
    this.careers.sort((a, b) => b.matchPercent - a.matchPercent);
    this.topMatch = this.careers[0].title;
  }
  next();
});

module.exports = mongoose.model('CareerRecommendation', careerRecommendationSchema);
