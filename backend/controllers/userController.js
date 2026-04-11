const User = require('../models/User');

exports.setupProfile = async (req, res, next) => {
  try {
    const { 
      // Existing
      branch, year, college, cgpa, interests, skills, goals, targetRole,
      // New
      phone, city, state, marks10, marks12, board, jeeScore, cetScore 
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        branch, year, college, cgpa, interests, skills, goals, targetRole,
        phone, city, state, marks10, marks12, board, jeeScore, cetScore,
        profileComplete: true
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      user: user.publicProfile,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    // Prevent updating password through this route
    const { password, email, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      user: user.publicProfile,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user.publicProfile,
    });
  } catch (error) {
    next(error);
  }
};
