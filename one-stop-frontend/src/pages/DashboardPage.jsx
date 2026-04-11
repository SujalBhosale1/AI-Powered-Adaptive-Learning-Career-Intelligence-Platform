import RecommendationCard from '../components/RecommendationCard';
import SkillBadge from '../components/SkillBadge';
import RoadmapTimeline from '../components/RoadmapTimeline';
import StatsOverview from '../components/StatsOverview';
import ActivityFeed from '../components/ActivityFeed';
import XPBadge from '../components/XPBadge';
import StreakTracker from '../components/StreakTracker';
import ConfusionAlert from '../components/ConfusionAlert';
import ProgressGraph from '../components/ProgressGraph';
import CalendarStreakTracker from '../components/CalendarStreakTracker';
import { useStudentData } from '../hooks/useStudentData';
import { getEngineeredData } from '../data/dummyData';
import { Lightbulb, Target, Briefcase, TrendingUp, BookOpen, ExternalLink, Brain, Zap, Users, Compass, Code2, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const { xpData, confusedTopics, revisionQueue, overallScore } = useStudentData();
  const { user } = useAuth();
  
  const userBranch = user?.profile?.branch || user?.branch || user?.targetRole || "Computer Science";
  const branchData = getEngineeredData(userBranch);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Dashboard</h1>
          <p className="text-indigo-200 mt-1">Welcome back, {user?.name ? user.name.split(' ')[0] : 'Student'}! Your AI-powered learning journey awaits.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/quiz" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg text-sm">
            <Zap className="h-4 w-4" /> Take Quiz
          </Link>
          <Link to="/learn" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors text-sm shadow-sm">
            <Brain className="h-4 w-4" /> Learn
          </Link>
        </div>
      </div>

      {/* Interactive Navigation Hub */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Learn Section */}
        <div className="glass-card p-6 border-indigo-500/30 hover:border-indigo-400/50 transition-colors shadow-[0_0_20px_rgba(99,102,241,0.1)]">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Brain className="text-indigo-400" /> Interactive Learning
            </h2>
            <div className="grid grid-cols-2 gap-3">
                <Link to="/learn" className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-center group">
                    <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform drop-shadow-md">📚</span>
                    <span className="text-sm font-semibold text-indigo-100">Learning Paths</span>
                </Link>
                <Link to="/quiz" className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-center group">
                    <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">⚡</span>
                    <span className="text-sm font-semibold text-indigo-100">Adaptive Quiz</span>
                </Link>
                <Link to="/progress" className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-center group">
                    <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform drop-shadow-md">📊</span>
                    <span className="text-sm font-semibold text-indigo-100">Progress</span>
                </Link>
                <Link to="/projects" className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-center group">
                    <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform drop-shadow-md">🛠️</span>
                    <span className="text-sm font-semibold text-indigo-100">Projects</span>
                </Link>
            </div>
        </div>

        {/* Explore Section */}
        <div className="glass-card p-6 border-purple-500/30 hover:border-purple-400/50 transition-colors shadow-[0_0_20px_rgba(168,85,247,0.1)]">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Compass className="text-purple-400" /> Explore & Connect
            </h2>
            <div className="grid grid-cols-2 gap-3">
                <Link to="/career" className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-center group">
                    <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform drop-shadow-md">🗺️</span>
                    <span className="text-sm font-semibold text-purple-100">Career Paths</span>
                </Link>
                <Link to="/peers" className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-center group">
                    <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">👥</span>
                    <span className="text-sm font-semibold text-purple-100">Peer Match</span>
                </Link>
                <Link to="/leaderboard" className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-center group">
                    <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform drop-shadow-md">🏆</span>
                    <span className="text-sm font-semibold text-purple-100">Leaderboard</span>
                </Link>
                <Link to="/flow" className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-center group">
                    <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform drop-shadow-md">🔁</span>
                    <span className="text-sm font-semibold text-purple-100">How It Works</span>
                </Link>
            </div>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview />

      {/* Interactive Visualizations Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
              <ProgressGraph />
          </div>
          <div className="md:col-span-1">
              <CalendarStreakTracker streak={xpData?.streak ?? 0} />
          </div>
      </div>

      {/* Confusion Alert */}
      {confusedTopics.length > 0 && <ConfusionAlert topics={confusedTopics} />}

      {/* Revision Queue Alert */}
      {revisionQueue.length > 0 && (
        <div className="glass-card border-violet-500/30 p-5 flex items-center gap-4">
          <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center text-xl shrink-0 border border-violet-400/30">🔁</div>
          <div className="flex-1">
            <h3 className="font-bold text-violet-300 text-sm">Revision Due Today</h3>
            <p className="text-violet-200/80 text-sm">
              {revisionQueue.slice(0, 3).map(r => r.topic).join(', ')} {revisionQueue.length > 3 ? `+${revisionQueue.length - 3} more` : ''}
            </p>
          </div>
          <Link to="/progress" className="shrink-0 px-4 py-2 bg-violet-600/80 text-white text-sm font-semibold rounded-xl hover:bg-violet-500 transition-colors border border-violet-400/50">
            Review Now
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">

          {/* Personalized Roadmap */}
          <section className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-cyan-400 h-5 w-5 drop-shadow-sm" />
              <h2 className="text-lg font-bold text-white">Your Personalized Roadmap</h2>
            </div>
            <RoadmapTimeline steps={branchData.roadmap} />
          </section>

          {/* Peer Match & Projects CTA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/peers" className="glass-card p-5 text-white hover:opacity-90 transition-opacity flex items-center gap-3">
              <Users className="h-8 w-8 text-cyan-300 drop-shadow-md" />
              <div>
                <p className="font-bold">Peer Match</p>
                <p className="text-cyan-100 text-xs">Find study partners with complementary skills</p>
              </div>
            </Link>
            <Link to="/projects" className="glass-card p-5 text-white hover:opacity-90 transition-opacity flex items-center gap-3">
              <Code2 className="h-8 w-8 text-purple-300 drop-shadow-md" />
              <div>
                <p className="font-bold">Build Projects</p>
                <p className="text-violet-100 text-xs">AI-recommended projects for your level</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">

          <ActivityFeed branch={userBranch} />

          {/* Skill Gap */}
          <section className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Target className="text-rose-400 h-5 w-5 drop-shadow-sm" />
              <h2 className="text-lg font-bold text-white">Skill Gap Analysis</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {branchData.skills.required.map(skill => (
                    <SkillBadge key={skill} skill={skill} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-3">Missing / To Learn</h3>
                <div className="flex flex-wrap gap-2">
                  {branchData.skills.missing.map(skill => (
                    <SkillBadge key={skill} skill={skill} missing={true} />
                  ))}
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg border border-white/10">
                <p className="text-xs text-indigo-100">
                  <strong>Recommendation:</strong> {branchData.skills.recommendation}
                </p>
              </div>
            </div>
          </section>

          {/* Quick Learn CTA */}
          <section className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-sm border border-transparent p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="text-white h-5 w-5" />
              <h2 className="text-lg font-bold">Quick Learn</h2>
            </div>
            <p className="text-sm text-indigo-100 mb-4">Master Python Basics in 30 mins with our interactive guide.</p>
            <Link to="/learn" className="w-full py-2 bg-white text-indigo-600 font-semibold rounded-lg text-sm hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
              Start Learning <ExternalLink className="h-3 w-3" />
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
