const CareerRecommendation = require('../models/CareerRecommendation');
const { predictCareers, generateCareerFlowchart } = require('../services/geminiService');

exports.suggestCareers = async (req, res, next) => {
  try {
    // Generate fresh recommendations based on user's current skills
    const userSkills = req.user.skills && req.user.skills.length ? req.user.skills : ['Python', 'SQL', 'HTML'];

    const profile = { branch: req.user.branch || 'General', interests: req.user.interests || [] };
    const analytics = { avgScore: 85 }; // In a real app we'd fetch this from Assessments

    const mlResponse = await predictCareers(profile, analytics);

    let rec = await CareerRecommendation.findOne({ userId: req.user.id });
    
    if (!rec) {
      rec = new CareerRecommendation({ userId: req.user.id });
    }

    // Update with latest ML response
    rec.careers = mlResponse.matches.map(m => ({
      title: m.career,
      matchPercent: m.match_percent,
      gapSkills: m.gap_skills,
      salaryRange: m.salary,
      roadmap: [`Learn ${m.gap_skills[0]}`, `Build a project using ${userSkills[0]}`],
      requiredSkills: [...m.gap_skills, ...userSkills].slice(0, 5),
      masteredSkills: userSkills,
      topCompanies: ['TechCorp', 'InnovateInc']
    }));
    
    rec.basedOnSkills = userSkills;
    rec.mlConfidence = mlResponse.confidence || 0.8;
    rec.generatedAt = new Date();
    
    await rec.save(); // pre-save hook will sort them and set topMatch

    res.status(200).json({
      success: true,
      recommendation: rec,
    });
  } catch (error) {
    next(error);
  }
};

exports.getGapAnalysis = async (req, res, next) => {
  try {
    const { targetRole } = req.query;
    const userRole = targetRole || req.user.targetRole;
    
    const rec = await CareerRecommendation.findOne({ userId: req.user.id });
    if (!rec) {
      return res.status(404).json({ success: false, message: 'Generate career suggestions first' });
    }

    const career = userRole 
      ? rec.careers.find(c => c.title.toLowerCase().includes(userRole.toLowerCase()))
      : rec.careers[0];

    if (!career) {
      return res.status(404).json({ success: false, message: 'Role not found in current recommendations' });
    }

    res.status(200).json({
      success: true,
      career: career.title,
      gapSkills: career.gapSkills,
      masteredSkills: career.masteredSkills,
      matchPercent: career.matchPercent
    });
  } catch (error) {
    next(error);
  }
};

exports.getFlowchart = async (req, res, next) => {
  try {
    const branch = req.query.branch || req.user.branch || 'Computer Science';
    const flowchart = await generateCareerFlowchart(branch);
    res.status(200).json({ success: true, flowchart });
  } catch (error) {
    next(error);
  }
};
