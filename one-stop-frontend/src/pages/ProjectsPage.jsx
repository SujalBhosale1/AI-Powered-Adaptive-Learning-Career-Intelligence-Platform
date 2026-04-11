import { useState } from 'react';
import { useStudentData } from '../hooks/useStudentData';
import { getAccuracy, getOverallScore } from '../data/skillEngine';
import { Code2, ExternalLink, Star, Clock, Users, ChevronDown, ChevronUp, Zap } from 'lucide-react';

const PROJECTS = [
  // Beginner (0–40%)
  {
    id: 1, title: 'Personal Portfolio Website', difficulty: 'Beginner', xp: 100, time: '1–2 weeks',
    topics: ['Web Dev'], tags: ['HTML', 'CSS', 'JavaScript'],
    description: 'Build your own portfolio website with sections for About, Projects, Skills and Contact.',
    why: 'Perfect first project — practice HTML/CSS layout, flexbox, and basic JavaScript interactions.',
    github: 'https://github.com/topics/portfolio-website',
    steps: ['Plan and sketch layout', 'Build structure in HTML', 'Style with CSS/Flexbox', 'Add JS interactions', 'Deploy on GitHub Pages'],
  },
  {
    id: 2, title: 'To-Do List App', difficulty: 'Beginner', xp: 120, time: '1 week',
    topics: ['Web Dev', 'Python'], tags: ['Python', 'Flask', 'SQLite'],
    description: 'A task management app with CRUD operations, built with Python Flask and SQLite.',
    why: 'Covers backend fundamentals: routes, templates, database queries, and forms.',
    github: 'https://github.com/topics/todo-list',
    steps: ['Setup Flask project', 'Create database schema', 'Implement CRUD routes', 'Build Jinja templates', 'Add basic styling'],
  },
  {
    id: 3, title: 'Quiz App', difficulty: 'Beginner', xp: 130, time: '1 week',
    topics: ['Web Dev', 'DSA'], tags: ['JavaScript', 'HTML', 'CSS'],
    description: 'A browser-based quiz with a question bank, timer, scoring, and results screen.',
    why: 'Reinforces arrays, loops, DOM manipulation, and event handling.',
    github: 'https://github.com/topics/quiz-app',
    steps: ['Design question data structure', 'Render questions dynamically', 'Implement timer', 'Calculate and display results', 'Add local score storage'],
  },

  // Intermediate (40–75%)
  {
    id: 4, title: 'Chat Application', difficulty: 'Intermediate', xp: 250, time: '2–3 weeks',
    topics: ['Web Dev', 'Networks', 'OOP'], tags: ['React', 'Node.js', 'Socket.io'],
    description: 'Real-time chat with rooms, user authentication, and message history.',
    why: 'Covers WebSockets, event-driven architecture, and full-stack React/Node integration.',
    github: 'https://github.com/topics/chat-app-nodejs',
    steps: ['Setup React + Node projects', 'Implement Socket.io events', 'Add authentication (JWT)', 'Build chat rooms', 'Store messages in MongoDB'],
  },
  {
    id: 5, title: 'E-Commerce Frontend', difficulty: 'Intermediate', xp: 280, time: '3 weeks',
    topics: ['Web Dev', 'DBMS'], tags: ['React', 'Redux', 'Tailwind CSS'],
    description: 'A product listing, cart, checkout UI with state management and mock API integration.',
    why: 'Deep practice with React component design, Redux, routing, and responsive layouts.',
    github: 'https://github.com/topics/ecommerce-react',
    steps: ['Design component tree', 'Setup Redux store', 'Fetch products from mock API', 'Implement cart logic', 'Build checkout flow'],
  },
  {
    id: 6, title: 'Student Grade Tracker', difficulty: 'Intermediate', xp: 220, time: '2 weeks',
    topics: ['Python', 'DBMS', 'OOP'], tags: ['Python', 'PostgreSQL', 'SQLAlchemy'],
    description: 'Track students, subjects, grades with a dashboard and grade distribution analytics.',
    why: 'Covers database design, ORM relationships, data aggregation, and visualization.',
    github: 'https://github.com/topics/grade-tracker',
    steps: ['Design ERD (students/subjects/grades)', 'Setup SQLAlchemy models', 'Implement CRUD operations', 'Build analytics queries', 'Add visualizations with Matplotlib'],
  },

  // Advanced (75%+)
  {
    id: 7, title: 'ML Model Deployment App', difficulty: 'Advanced', xp: 500, time: '4–5 weeks',
    topics: ['Python', 'Math', 'Web Dev'], tags: ['Python', 'FastAPI', 'scikit-learn', 'Docker'],
    description: 'Train an ML model, expose it as an API with FastAPI, containerize it, and deploy.',
    why: 'End-to-end ML pipeline: data prep, training, evaluation, API, containerization, deployment.',
    github: 'https://github.com/topics/ml-deployment',
    steps: ['Select dataset and train model', 'Evaluate and pickle model', 'Build FastAPI prediction endpoint', 'Dockerize the application', 'Deploy on Render / Railway'],
  },
  {
    id: 8, title: 'Distributed File Storage System', difficulty: 'Advanced', xp: 600, time: '5–6 weeks',
    topics: ['OS', 'Networks', 'DSA'], tags: ['Python', 'gRPC', 'Distributed Systems'],
    description: 'Build a simplified version of GFS — nodes, replication, fault tolerance, and chunking.',
    why: 'Applies real distributed systems concepts: consistency, replication, leader election.',
    github: 'https://github.com/topics/distributed-systems',
    steps: ['Design system architecture', 'Implement chunk server', 'Build master node', 'Add replication logic', 'Test fault tolerance scenarios'],
  },
  {
    id: 9, title: 'Database Query Optimizer', difficulty: 'Advanced', xp: 550, time: '4 weeks',
    topics: ['DBMS', 'DSA', 'OOP'], tags: ['Java', 'Algorithms', 'B-Trees'],
    description: 'Implement a simple SQL parser, B-tree index, and rule-based query optimizer.',
    why: 'Deep DBMS internals — parsing, indexing structures, join ordering, and execution plans.',
    github: 'https://github.com/topics/database-implementation',
    steps: ['Build SQL tokenizer/parser', 'Implement B-tree index', 'Add query planner', 'Build execution engine', 'Benchmark against naive approach'],
  },
];

const DIFFICULTY_CONFIG = {
  Beginner: { color: 'green', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  Intermediate: { color: 'blue', badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  Advanced: { color: 'violet', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
};

const ProjectsPage = () => {
  const { skillScores, getAccuracy } = useStudentData();
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('All');

  const overallScore = getOverallScore();
  const recommendedDifficulty = overallScore >= 75 ? 'Advanced' : overallScore >= 40 ? 'Intermediate' : 'Beginner';

  const filteredProjects = filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.difficulty === filter);

  const getProjectRelevance = (project) => {
    const matched = project.topics.filter(t => {
      const acc = getAccuracy(t);
      return acc !== null && acc >= 50;
    }).length;
    return Math.round((matched / project.topics.length) * 100);
  };

  return (
    <div className="py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Code2 className="h-5 w-5 text-indigo-400" />
            <span className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Project-Based Learning</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">AI-Recommended Projects</h1>
          <p className="text-indigo-200 mt-1">Projects chosen based on your current skill level and topic performance.</p>
        </div>

        {/* AI Recommendation Banner */}
        <div className="bg-gradient-to-r from-indigo-600/80 to-purple-700/80 backdrop-blur-md text-white rounded-2xl p-5 flex items-center gap-4 shadow-[0_0_30px_rgba(99,102,241,0.3)] border border-white/10">
          <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center shadow-inner">
            <Zap className="h-6 w-6 text-yellow-300" />
          </div>
          <div>
            <p className="text-indigo-200 text-sm font-semibold">🤖 AI Recommends for your level ({overallScore}% overall)</p>
            <p className="text-xl font-bold">{recommendedDifficulty} Projects</p>
            <p className="text-indigo-200 text-sm">Start with these to build confidence and portfolio value.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                filter === f
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-transparent shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                  : 'bg-white/5 text-indigo-300 border-white/10 hover:border-indigo-400/50 hover:text-indigo-200 hover:bg-white/10'
              }`}
            >
              {f}
              {f === recommendedDifficulty && filter !== f && (
                <span className="ml-1.5 text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded-full font-bold">AI Pick</span>
              )}
            </button>
          ))}
        </div>

        {/* Project Cards */}
        <div className="space-y-4">
          {filteredProjects.map(project => {
            const config = DIFFICULTY_CONFIG[project.difficulty];
            const relevance = getProjectRelevance(project);
            const isExpanded = expanded === project.id;

            return (
              <div key={project.id} className="glass-card hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="font-bold text-white text-lg">{project.title}</h3>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${config.badge}`}>
                          {project.difficulty}
                        </span>
                        {project.difficulty === recommendedDifficulty && (
                          <span className="text-[10px] bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 font-bold px-2 py-0.5 rounded-full">⭐ Recommended</span>
                        )}
                      </div>
                      <p className="text-sm text-indigo-200 leading-relaxed">{project.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-extrabold text-indigo-400">+{project.xp} XP</p>
                      <p className="text-xs text-indigo-300/50">{project.time}</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-xs bg-white/10 border border-white/10 text-indigo-200 px-2.5 py-1 rounded-lg font-medium">{tag}</span>
                    ))}
                  </div>

                  {/* Relevance + Why */}
                  {relevance > 0 && (
                    <div className="mt-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3">
                      <p className="text-xs text-indigo-300 font-semibold mb-1">💡 Why this project?</p>
                      <p className="text-xs text-indigo-200">{project.why}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3 text-xs text-indigo-300/60">
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{project.time}</span>
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />Solo / Team</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white/10 text-indigo-200 border border-white/10 rounded-lg hover:bg-white/20 transition-colors font-medium"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> GitHub Ideas
                      </a>
                      <button
                        onClick={() => setExpanded(isExpanded ? null : project.id)}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors font-semibold shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                      >
                        Steps {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Steps */}
                {isExpanded && (
                  <div className="border-t border-white/10 bg-[#0F172A]/50 p-6">
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">Step-by-Step Guide</p>
                    <div className="space-y-2">
                      {project.steps.map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                            {i + 1}
                          </div>
                          <span className="text-sm text-indigo-100 font-medium">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
