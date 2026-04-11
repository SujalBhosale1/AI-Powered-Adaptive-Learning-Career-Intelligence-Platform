const ChatHistory = require('../models/ChatHistory');
const { chatWithMentor } = require('../services/geminiService');

exports.sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    let history = await ChatHistory.findOne({ userId: req.user.id });
    if (!history) {
      history = new ChatHistory({ userId: req.user.id, messages: [] });
    }

    // Add user message to DB
    history.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Extract recent context for Ollama (last 5 interactions)
    const historyContext = history.messages.slice(-10, -1).map(m => 
        `${m.role === 'user' ? 'Student' : 'Mentor'}: ${m.content}`
    );

    // Call Ollama
    const { response } = await chatWithMentor(message, historyContext);

    // Add bot response
    const botMessage = {
      role: 'assistant',
      content: response,
      suggestions: [],
      timestamp: new Date()
    };
    
    history.messages.push(botMessage);
    await history.save(); // triggers save hook

    res.status(200).json({
      success: true,
      reply: botMessage,
    });
  } catch (error) {
    next(error);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const history = await ChatHistory.findOne({ userId: req.user.id });
    
    res.status(200).json({
      success: true,
      messages: history ? history.messages : [],
    });
  } catch (error) {
    next(error);
  }
};
