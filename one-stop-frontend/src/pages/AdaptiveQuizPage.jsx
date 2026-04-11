import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { allTopics } from '../data/questionBank';
import { recordQuizResults } from '../data/skillEngine';
import { awardXP, checkAndAwardBadges } from '../data/gamificationEngine';
import { updateRevision } from '../data/revisionEngine';
import { Timer, CheckCircle, XCircle, ChevronRight, Brain, Zap, BarChart3, Trophy, Loader2 } from 'lucide-react';

const QUIZ_LENGTH = 8;
const TIME_PER_QUESTION = 30;

const AdaptiveQuizPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialTopic = searchParams.get('topic') || allTopics[0];

  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [difficulty, setDifficulty] = useState(2);
  const [results, setResults] = useState([]); // [{ topic, isCorrect, difficulty, timeSpent }]
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [confusionFlag, setConfusionFlag] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [newBadges, setNewBadges] = useState([]);
  
  // NEW: State for async fetching from Ollama backend
  const [isLoading, setIsLoading] = useState(false);
  
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const fetchQuestion = async (topic, diff) => {
    try {
      setIsLoading(true);
      // Ensure backend URL matches process env or defaults
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${apiUrl}/assessment/generate`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ topic, difficulty: diff, count: 1 })
      });
      
      const data = await res.json();
      if (data.success && data.questions && data.questions.length > 0) {
        return data.questions[0];
      }
    } catch (error) {
      console.error('Error fetching question:', error);
    } finally {
      setIsLoading(false);
    }
    // Fallback if the backend/ollama is offline
    return {
      question: `Fallback: What is the main principle of ${topic}?`,
      options: ['A', 'B', 'C', 'D'],
      answer: 0,
      difficulty: diff
    };
  };

  const startQuiz = async () => {
    setQuizStarted(true);
    setResults([]);
    setQuestionIndex(0);
    setQuizDone(false);
    setDifficulty(2);
    setCurrentQ(null); // Clear previous

    const first = await fetchQuestion(initialTopic, 2);
    setCurrentQ(first);
    setSelected(null);
    setRevealed(false);
    setTimeLeft(TIME_PER_QUESTION);
    setConfusionFlag(false);
    startTimeRef.current = Date.now();
  };

  // Timer
  useEffect(() => {
    if (!quizStarted || revealed || quizDone || isLoading || !currentQ) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
           clearInterval(timerRef.current);
           handleAnswer(null); // timed out
           return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [quizStarted, currentQ, revealed, quizDone, isLoading]);

  const handleAnswer = (optIdx) => {
    clearInterval(timerRef.current);
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    const isCorrect = optIdx !== null && optIdx === currentQ?.answer;
    const confused = timeSpent > 22 || (!isCorrect && timeSpent > 15);

    setSelected(optIdx);
    setRevealed(true);
    setConfusionFlag(confused);

    const result = { topic: selectedTopic, isCorrect, difficulty: currentQ?.difficulty, timeSpent };
    setResults(prev => [...prev, result]);

    // Adaptive difficulty
    if (isCorrect) setDifficulty(d => Math.min(5, d + 1));
    else setDifficulty(d => Math.max(1, d - 1));
  };

  const handleNext = async () => {
    if (questionIndex + 1 >= QUIZ_LENGTH) {
      finishQuiz();
      return;
    }
    
    setCurrentQ(null); // Show loading spinner by clearing currentQ momentarily
    const nextQ = await fetchQuestion(selectedTopic, difficulty);
    
    setCurrentQ(nextQ);
    setQuestionIndex(prev => prev + 1);
    setSelected(null);
    setRevealed(false);
    setTimeLeft(TIME_PER_QUESTION);
    setConfusionFlag(false);
    startTimeRef.current = Date.now();
  };

  const finishQuiz = () => {
    clearInterval(timerRef.current);
    setQuizDone(true);

    const allResults = results;
    const scores = recordQuizResults(allResults);
    const { earned } = awardXP('quiz_complete');
    const correctCount = allResults.filter(r => r.isCorrect).length;
    awardXP('correct_answer', correctCount);

    const acc = Math.round((correctCount / allResults.length) * 100);
    updateRevision(selectedTopic, acc);

    const badges = checkAndAwardBadges(scores);
    setNewBadges(badges);
  };

  const correctCount = results.filter(r => r.isCorrect).length;
  const accuracy = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;

  // ─── Quiz Done Screen ──────────────────────────────────────────
  if (quizDone) {
    const xpEarned = 50 + correctCount * 10;
    return (
      <div className="min-h-screen bg-mesh py-12 flex items-center justify-center p-4">
        <div className="glass-card rounded-3xl shadow-[0_0_40px_rgba(99,102,241,0.2)] p-8 max-w-md w-full text-center border-white/20">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)]">
            <Trophy className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-1">Quiz Complete!</h2>
          <p className="text-indigo-200 mb-6 text-sm">Here's how you did on <strong className="text-white">{selectedTopic}</strong></p>

          {/* Score */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
              <p className="text-2xl font-bold text-emerald-400">{correctCount}/{results.length}</p>
              <p className="text-xs text-emerald-500 font-medium">Correct</p>
            </div>
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4">
              <p className="text-2xl font-bold text-indigo-400">{accuracy}%</p>
              <p className="text-xs text-indigo-400 font-medium">Accuracy</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
              <p className="text-2xl font-bold text-yellow-500">+{xpEarned}</p>
              <p className="text-xs text-yellow-600 font-medium">XP Earned</p>
            </div>
          </div>

          {/* Performance Bar */}
          <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-4 mb-6 text-left">
            <p className="text-xs font-semibold text-indigo-300 mb-2">Performance Per Question</p>
            <div className="flex gap-1.5">
              {results.map((r, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full shadow-[0_0_10px_currentColor] ${r.isCorrect ? 'bg-emerald-400 text-emerald-400' : 'bg-rose-400 text-rose-400'}`}
                  title={`Q${i+1}: ${r.isCorrect ? 'Correct' : 'Wrong'}`}
                />
              ))}
            </div>
          </div>

          {/* New Badges */}
          {newBadges.length > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 mb-6 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
              <p className="text-xs font-bold text-yellow-400 mb-2">🏆 New Badge{newBadges.length > 1 ? 's' : ''} Unlocked!</p>
              <div className="flex gap-3 justify-center flex-wrap">
                {newBadges.map(b => (
                  <div key={b.id} className="flex flex-col items-center gap-1">
                    <span className="text-3xl drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{b.icon}</span>
                    <span className="text-xs font-semibold text-yellow-200">{b.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {accuracy < 60 && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 mb-4 text-left">
              <p className="text-sm text-rose-200">
                <strong className="text-rose-400">💡 AI Suggestion:</strong> Your score is below 60%. We&apos;ve added {selectedTopic} to your revision queue with simplified content.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => { setQuizStarted(false); setQuizDone(false); }}
              className="flex-1 py-3 bg-white/10 text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => navigate('/progress')}
              className="flex-1 py-3 bg-indigo-600 border border-transparent text-white rounded-xl font-semibold hover:bg-indigo-500 transition-colors shadow-[0_0_15px_rgba(99,102,241,0.5)]"
            >
              View Progress
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Topic Selection Screen ────────────────────────────────────
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-mesh py-12 px-4 flex items-center justify-center">
        <div className="max-w-2xl mx-auto w-full">
          <div className="text-center mb-10">
            <div className="w-16 h-16 mx-auto mb-4 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
              <Brain className="h-8 w-8 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Adaptive AI Quiz</h1>
            <p className="text-indigo-200">Questions are dynamically generated by Ollama in real-time.</p>
          </div>

          <div className="glass-card bg-opacity-50 border border-indigo-500/20 rounded-3xl p-8 shadow-[0_0_40px_rgba(99,102,241,0.15)]">
            <h2 className="text-white font-bold text-lg mb-4">Select a Topic</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {allTopics.map(topic => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`py-3 px-4 rounded-xl text-sm font-semibold text-left transition-all border ${
                    selectedTopic === topic
                      ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white border-transparent shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                      : 'bg-[#0F172A]/50 text-indigo-300 border-white/10 hover:border-indigo-400/50 hover:text-indigo-200 hover:bg-white/5'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8 text-center">
              <div className="bg-[#0F172A]/50 border border-white/5 rounded-2xl p-4">
                <p className="text-white font-bold text-lg">{QUIZ_LENGTH}</p>
                <p className="text-indigo-300 text-xs">Questions</p>
              </div>
              <div className="bg-[#0F172A]/50 border border-white/5 rounded-2xl p-4">
                <p className="text-white font-bold text-lg">{TIME_PER_QUESTION}s</p>
                <p className="text-indigo-300 text-xs">Per Question</p>
              </div>
              <div className="bg-[#0F172A]/50 border border-white/5 rounded-2xl p-4">
                <p className="text-white font-bold text-lg">1–5</p>
                <p className="text-indigo-300 text-xs">Adaptive Level</p>
              </div>
            </div>

            <button
              onClick={startQuiz}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold text-lg rounded-2xl hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(99,102,241,0.5)] flex items-center justify-center gap-3"
            >
              <Zap className="h-5 w-5" /> Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Question Loading/Display Screen ────────────────────────────
  if (isLoading || !currentQ) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
          <p className="text-indigo-200 font-semibold animate-pulse">Ollama is generating your question...</p>
        </div>
      </div>
    );
  }

  const timerPercent = (timeLeft / TIME_PER_QUESTION) * 100;
  const timerColor = timeLeft > 15 ? '#6366f1' : timeLeft > 8 ? '#f59e0b' : '#ef4444';

  return (
    <div className="min-h-screen bg-mesh py-12 px-4">
      <div className="max-w-2xl mx-auto pt-8">

        {/* Progress Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-indigo-300 text-sm font-medium">Q {questionIndex + 1} / {QUIZ_LENGTH}</span>
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-500/30">
              Level {difficulty}
            </span>
          </div>
          {/* Timer */}
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-indigo-300" />
            <div className="w-24 bg-[#0F172A] border border-white/10 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all shadow-[0_0_10px_currentColor]"
                style={{ width: `${timerPercent}%`, backgroundColor: timerColor }}
              />
            </div>
            <span className="text-sm font-bold drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" style={{ color: timerColor }}>{timeLeft}s</span>
          </div>
        </div>

        {/* Question progress dots */}
        <div className="flex gap-1.5 mb-6">
          {Array.from({ length: QUIZ_LENGTH }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-all shadow-[0_0_5px_currentColor] border ${
                i < results.length
                  ? results[i].isCorrect ? 'bg-emerald-400 border-transparent text-emerald-400' : 'bg-rose-400 border-transparent text-rose-400'
                  : i === questionIndex
                  ? 'bg-indigo-400 border-transparent text-indigo-400'
                  : 'bg-[#0F172A] border-white/10 text-transparent'
              }`}
            />
          ))}
        </div>

        {/* Confusion indicator */}
        {confusionFlag && revealed && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-4 flex items-center gap-2">
            <span className="text-amber-400 text-sm">⏱ You took a while on this one. AI will simplify the next question.</span>
          </div>
        )}

        {/* Question Card */}
        <div className="glass-card shadow-[0_0_20px_rgba(99,102,241,0.1)] border-white/10 rounded-3xl p-8 mb-6">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-4">
            {selectedTopic} · Difficulty {currentQ.difficulty}/5
          </p>
          <h2 className="text-xl font-bold text-white leading-relaxed mb-2">{currentQ.question}</h2>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            let optClass = 'bg-[#0F172A]/50 border-white/10 text-indigo-100 hover:bg-white/10 hover:border-indigo-400/50 cursor-pointer shadow-sm';
            if (revealed) {
              if (idx === currentQ.answer) optClass = 'bg-emerald-500/20 border-emerald-400/60 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
              else if (idx === selected && idx !== currentQ.answer) optClass = 'bg-rose-500/20 border-rose-400/60 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)]';
              else optClass = 'bg-white/5 border-white/5 text-indigo-200/50 cursor-default';
            }

            return (
              <button
                key={idx}
                disabled={revealed}
                onClick={() => handleAnswer(idx)}
                className={`w-full p-4 rounded-2xl border text-left font-medium flex items-center gap-4 transition-all ${optClass}`}
              >
                <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm font-bold shrink-0 shadow-inner border border-white/10">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{opt}</span>
                {revealed && idx === currentQ.answer && <CheckCircle className="h-5 w-5 text-emerald-400 ml-auto shrink-0 drop-shadow-[0_0_5px_currentColor]" />}
                {revealed && idx === selected && idx !== currentQ.answer && <XCircle className="h-5 w-5 text-rose-400 ml-auto shrink-0 drop-shadow-[0_0_5px_currentColor]" />}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        {revealed && (
          <button
            onClick={handleNext}
            className="mt-6 w-full py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-xl shadow-indigo-500/20"
          >
            {questionIndex + 1 >= QUIZ_LENGTH ? (
              <><BarChart3 className="h-5 w-5" /> View Results</>
            ) : (
              <>Next Question <ChevronRight className="h-5 w-5" /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default AdaptiveQuizPage;
