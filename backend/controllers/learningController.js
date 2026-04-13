const LearningPath = require('../models/LearningPath');
const Assessment = require('../models/Assessment');
const { generateLearningPath } = require('../services/geminiService');

exports.getPath = async (req, res, next) => {
  try {
    let path = await LearningPath.findOne({ userId: req.user.id });

    if (!path) {
      // Check if user has taken assessment
      const lastAssessment = await Assessment.findOne({ userId: req.user.id }).sort('-createdAt');
      
      const targetRole = req.user.targetRole || 'Software Engineer';
      const topics = await generateLearningPath(lastAssessment, targetRole);

      path = await LearningPath.create({
        userId: req.user.id,
        topics: topics,
        targetRole: targetRole,
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

exports.getNotes = async (req, res, next) => {
  try {
    const { topic } = req.query;
    if (!topic) {
      return res.status(400).json({ success: false, message: 'Topic is required' });
    }

    // Get user recent assessment to determine weak areas
    const lastAssessment = await Assessment.findOne({ userId: req.user.id }).sort('-createdAt');
    const weakAreas = lastAssessment ? lastAssessment.weakAreas : [];
    const level = req.user.level || 1;

    const { generateStudyNotes } = require('../services/geminiService');
    const notesHtml = await generateStudyNotes(topic, level, weakAreas);

    res.status(200).json({
      success: true,
      notes: notesHtml,
    });
  } catch (error) {
    next(error);
  }
};
