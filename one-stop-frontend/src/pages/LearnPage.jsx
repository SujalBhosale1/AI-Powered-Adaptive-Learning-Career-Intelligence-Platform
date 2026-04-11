import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LearningCard from '../components/LearningCard';
import { useStudentData } from '../hooks/useStudentData';
import { getAccuracy, getTopicStatus, getRecommendedDifficulty } from '../data/skillEngine';
import { BookOpen, Filter, TrendingUp, Zap, Brain } from 'lucide-react';

const TOPIC_DESCRIPTIONS = {
  Python: 'Variables, functions, OOP, generators, decorators, and more.',
  DSA: 'Arrays, trees, graphs, sorting, dynamic programming, and complexity.',
  OOP: 'Classes, inheritance, polymorphism, SOLID principles, design patterns.',
  OS: 'Processes, scheduling, memory management, deadlocks, file systems.',
  DBMS: 'SQL, normalization, ACID, transactions, indexing, query optimization.',
  Networks: 'OSI model, TCP/IP, DNS, HTTP, routing, security protocols.',
  'Web Dev': 'HTML/CSS, JavaScript, React, REST APIs, browser internals.',
  Math: 'Logic, sets, graph theory, probability, matrices, calculus basics.',
};

const FILTERS = ['All', 'Weak', 'Learning', 'Mastered', 'Not Started'];

const LearnPage = () => {
  const navigate = useNavigate();
  const { skillScores, prioritizedTopics, confusedTopics } = useStudentData();
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredTopics = prioritizedTopics.filter(topic => {
    const status = getTopicStatus(topic);
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Weak') return status === 'weak';
    if (activeFilter === 'Learning') return status === 'learning';
    if (activeFilter === 'Mastered') return status === 'mastered';
    if (activeFilter === 'Not Started') return status === 'untouched';
    return true;
  });

  const handleStart = (topic) => {
    navigate(`/quiz?topic=${encodeURIComponent(topic)}`);
  };

  const masteredCount = prioritizedTopics.filter(t => getTopicStatus(t) === 'mastered').length;
  const weakCount = prioritizedTopics.filter(t => getTopicStatus(t) === 'weak').length;
  const learningCount = prioritizedTopics.filter(t => getTopicStatus(t) === 'learning').length;

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-6 w-6 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Adaptive Learning</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Your Learning Path</h1>
            <p className="text-indigo-200 mt-1">Topics are prioritized based on your performance. Weakest first.</p>
          </div>
          <div className="flex gap-4 text-center">
            <div className="glass-card bg-emerald-500/10 border-emerald-500/20 px-4 py-2">
              <p className="text-2xl font-bold text-emerald-400">{masteredCount}</p>
              <p className="text-xs text-emerald-500 font-medium">Mastered</p>
            </div>
            <div className="glass-card bg-indigo-500/10 border-indigo-500/20 px-4 py-2">
              <p className="text-2xl font-bold text-indigo-400">{learningCount}</p>
              <p className="text-xs text-indigo-400 font-medium">Learning</p>
            </div>
            <div className="glass-card bg-rose-500/10 border-rose-500/20 px-4 py-2">
              <p className="text-2xl font-bold text-rose-400">{weakCount}</p>
              <p className="text-xs text-rose-500 font-medium">Weak</p>
            </div>
          </div>
        </div>

        {/* Confusion Banner */}
        {confusedTopics.length > 0 && (
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-5 text-white flex items-start gap-4 shadow-lg">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">🤖 AI Detected Confusion</h3>
              <p className="text-amber-100 text-sm mt-0.5">
                You seem to be struggling with <strong>{confusedTopics.join(', ')}</strong>.
                We&apos;ve moved these to the top and simplified the difficulty level for you.
              </p>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          <Filter className="h-5 w-5 text-indigo-400 self-center mr-2" />
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeFilter === f
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-transparent'
                  : 'bg-white/5 border border-white/10 text-indigo-300 hover:bg-white/10 hover:text-indigo-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Next Recommended Banner */}
        {filteredTopics.length > 0 && (
          <div className="bg-gradient-to-r from-indigo-600/80 to-purple-600/80 backdrop-blur-md rounded-2xl p-5 text-white flex items-center justify-between gap-4 shadow-[0_0_30px_rgba(99,102,241,0.3)] border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center shadow-inner">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wider">🤖 AI Recommends Next</p>
                <p className="text-xl font-bold">{filteredTopics[0]}</p>
                <p className="text-indigo-200 text-sm">
                  {getAccuracy(filteredTopics[0]) !== null
                    ? `Current accuracy: ${getAccuracy(filteredTopics[0])}%`
                    : 'You haven\'t started this topic yet'}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleStart(filteredTopics[0])}
              className="shrink-0 px-6 py-3 bg-white/20 border border-white/30 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/30 transition-colors shadow-md"
            >
              Start Now →
            </button>
          </div>
        )}

        {/* Topic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredTopics.map(topic => (
            <LearningCard
              key={topic}
              topic={topic}
              status={getTopicStatus(topic)}
              accuracy={getAccuracy(topic)}
              recommendedDifficulty={getRecommendedDifficulty(topic)}
              description={TOPIC_DESCRIPTIONS[topic]}
              onStart={handleStart}
            />
          ))}
        </div>

        {filteredTopics.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="h-12 w-12 text-indigo-500/30 mx-auto mb-4" />
            <p className="text-indigo-300">No topics match this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnPage;
