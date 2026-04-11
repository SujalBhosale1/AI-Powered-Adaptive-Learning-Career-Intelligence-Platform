const LearningPath = require('../models/LearningPath');
const Assessment = require('../models/Assessment');

exports.getPath = async (req, res, next) => {
  try {
    let path = await LearningPath.findOne({ userId: req.user.id });

    if (!path) {
      // Check if user has taken assessment
      const lastAssessment = await Assessment.findOne({ userId: req.user.id }).sort('-createdAt');
      
      const topics = generateTopicsFromAssessment(lastAssessment);

      path = await LearningPath.create({
        userId: req.user.id,
        topics: topics,
        targetRole: req.user.targetRole || 'Software Engineer',
      });
    }

    res.status(200).json({
      success: true,
      learningPath: path,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProgress = async (req, res, next) => {
  try {
    const { topicId, status } = req.body;

    const path = await LearningPath.findOne({ userId: req.user.id });
    if (!path) {
      return res.status(404).json({ success: false, message: 'Learning path not found' });
    }

    const topic = path.topics.find(t => t.id === topicId);
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found in path' });
    }

    if (status === 'in_progress' && topic.status === 'not_started') {
      topic.startedAt = new Date();
    } else if (status === 'completed' && topic.status !== 'completed') {
      topic.completedAt = new Date();
      // Add XP to user
      req.user.totalXP += topic.xpReward || 50;
      req.user.level = Math.floor(req.user.totalXP / 1000) + 1;
      await req.user.save({ validateBeforeSave: false });
    }

    topic.status = status;
    await path.save(); // triggers save hook to recount stats

    res.status(200).json({
      success: true,
      learningPath: path,
    });
  } catch (error) {
    next(error);
  }
};

// Simple generator logic based on assessment results
function generateTopicsFromAssessment(assessment) {
  const topics = [];
  const baseTopics = [
    { id: 't1', title: 'Arrays & Strings Fundamentals', subject: 'dsa', difficulty: 1 },
    { id: 't2', title: 'HTML Semantic Elements', subject: 'webdev', difficulty: 1 },
    { id: 't3', title: 'SQL Joins & Groupings', subject: 'db', difficulty: 2 },
    { id: 't4', title: 'Trees & Graph Traversal', subject: 'dsa', difficulty: 3 },
    { id: 't5', title: 'React Hooks & State', subject: 'webdev', difficulty: 3 },
    { id: 't6', title: 'Linear Regression', subject: 'ml', difficulty: 2 },
    { id: 't7', title: 'Load Balancing & Caching', subject: 'systemDesign', difficulty: 3 },
    { id: 't8', title: 'Dynamic Programming Basics', subject: 'dsa', difficulty: 4 },
  ];

  // If no assessment, return all
  if (!assessment) {
    return baseTopics.map(t => ({ ...t, status: 'not_started', resources: [] }));
  }

  // Prioritize topics based on weak areas
  for (const topic of baseTopics) {
    // If subject is a strong area, we can mark an easy topic as completed or keep it normal
    if (assessment.strongAreas.includes(topic.subject) && topic.difficulty <= 2) {
      topics.push({ ...topic, status: 'completed', completedAt: new Date() });
    } else {
      topics.push({ ...topic, status: 'not_started' });
    }
  }

  // Add dummy resources
  return topics.map(t => ({
    ...t,
    resources: [
      { title: `Introduction to ${t.title}`, url: 'https://youtube.com', type: 'video', duration: '15 min' },
      { title: `${t.title} Cheat Sheet`, url: 'https://dev.to', type: 'article', duration: '5 min' }
    ]
  }));
}
