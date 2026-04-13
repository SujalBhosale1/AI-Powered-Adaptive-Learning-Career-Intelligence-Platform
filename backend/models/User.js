const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // never return password in queries
  },
  // Academic Profile
  branch: { type: String, trim: true, default: '' },
  year: { type: Number, min: 1, max: 5, default: null },
  college: { type: String, trim: true, default: '' },
  cgpa: { type: Number, min: 0, max: 10, default: null },
  marks10: { type: Number, min: 0, max: 100, default: null },
  marks12: { type: Number, min: 0, max: 100, default: null },
  board: { type: String, trim: true, default: '' },
  jeeScore: { type: Number, min: 0, max: 100, default: null },
  cetScore: { type: Number, min: 0, max: 100, default: null },
  // Contact & Location
  phone: { type: String, trim: true, default: '' },
  city: { type: String, trim: true, default: '' },
  state: { type: String, trim: true, default: '' },
  // Career Info
  interests: [{ type: String, trim: true }],
  skills: [{ type: String, trim: true }],
  goals: [{ type: String, trim: true }],
  targetRole: { type: String, trim: true, default: '' },
  // Status
  profileComplete: { type: Boolean, default: false },
  profilePhoto: { type: String, default: null },
  // Learning stats (denormalized for fast dashboard queries)
  learningStreak: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: null },
  totalXP: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  profileStrength: { type: Number, default: 0 },
  profileViews: { type: Number, default: 0 },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// ── Hash password before save ────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance method: compare password ────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Update streak on activity ─────────────────────────────────────
userSchema.methods.updateStreak = function () {
  const today = new Date().toDateString();
  const lastActive = this.lastActiveDate ? new Date(this.lastActiveDate).toDateString() : null;
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (lastActive === today) {
    // Already active today, no change
  } else if (lastActive === yesterday) {
    this.learningStreak += 1;
  } else {
    this.learningStreak = 1;
  }
  this.lastActiveDate = new Date();
};

// ── Virtual: safe public profile ──────────────────────────────────
userSchema.virtual('publicProfile').get(function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    city: this.city,
    state: this.state,
    branch: this.branch,
    year: this.year,
    college: this.college,
    cgpa: this.cgpa,
    marks10: this.marks10,
    marks12: this.marks12,
    board: this.board,
    jeeScore: this.jeeScore,
    cetScore: this.cetScore,
    interests: this.interests,
    skills: this.skills,
    goals: this.goals,
    targetRole: this.targetRole,
    profileComplete: this.profileComplete,
    profilePhoto: this.profilePhoto,
    learningStreak: this.learningStreak,
    totalXP: this.totalXP,
    level: this.level,
    profileStrength: this.profileStrength,
    profileViews: this.profileViews,
    createdAt: this.createdAt,
  };
});

// ── Index ─────────────────────────────────────────────────────────
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
