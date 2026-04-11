const Assessment = require('../models/Assessment');
const LearningPath = require('../models/LearningPath');
const User = require('../models/User');

exports.getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Run queries in parallel
    const [path, assessments] = await Promise.all([
      LearningPath.findOne({ userId }),
      Assessment.find({ userId }).sort('createdAt').lean()
    ]);

    // 1. Skill radar (from latest assessment)
    let skillRadar = [];
    const latestAssesment = assessments.length > 0 ? assessments[assessments.length - 1] : null;
    if (latestAssesment && latestAssesment.scores) {
      skillRadar = [
        { subject: 'DSA', score: latestAssesment.scores.dsa },
        { subject: 'Web Dev', score: latestAssesment.scores.webdev },
        { subject: 'ML', score: latestAssesment.scores.ml },
        { subject: 'Database', score: latestAssesment.scores.db },
        { subject: 'System Design', score: latestAssesment.scores.systemDesign },
      ];
    }

    // 2. Weekly progress (mocked time-series from assessments)
    const weeklyProgress = assessments.slice(-5).map((a, i) => ({
      week: `Week ${i + 1}`,
      score: a.overallScore
    }));

    // 3. Career Readiness (overall score normalized)
    const careerReadiness = latestAssesment ? latestAssesment.overallScore : 0;

    res.status(200).json({
      success: true,
      analytics: {
        skillScore: latestAssesment ? latestAssesment.overallScore : 0,
        learningStreak: req.user.learningStreak,
        totalXP: req.user.totalXP,
        level: req.user.level,
        completedTopics: path ? path.completedTopics : 0,
        careerReadiness,
        skillRadar,
        weeklyProgress,
        recentActivity: [
          { type: 'login', title: 'Logged in today', timestamp: new Date() },
          ...(path ? [{ type: 'learning', title: `Learning path progress at ${path.progressPercent}%`, timestamp: path.lastUpdated }] : [])
        ]
      }
    });

  } catch (error) {
    next(error);
  }
};
