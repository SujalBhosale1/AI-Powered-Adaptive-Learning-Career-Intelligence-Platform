import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import ProgressPage from './pages/ProgressPage';
import PaymentPage from './pages/PaymentPage';
import CreditPage from './pages/CreditPage';
import HelpPage from './pages/HelpPage';
import FlowPage from './pages/FlowPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
// ── NEW PAGES ──────────────────────────────────────────────────────
import LearnPage from './pages/LearnPage';
import AdaptiveQuizPage from './pages/AdaptiveQuizPage';
import LeaderboardPage from './pages/LeaderboardPage';
import PeerMatchPage from './pages/PeerMatchPage';
import CareerPathPage from './pages/CareerPathPage';
import ProjectsPage from './pages/ProjectsPage';
// ── AI ASSESSMENT PIPELINE ────────────────────────────────────────
import InitialAssessmentPage from './pages/InitialAssessmentPage';
import AIAnalysisPage from './pages/AIAnalysisPage';
// ─────────────────────────────────────────────────────────────────
import ChatbotWidget from './components/ChatbotWidget';
import Layout from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile-setup" element={<ProfileSetupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/flow" element={<FlowPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/credit" element={<CreditPage />} />
          <Route path="/help" element={<HelpPage />} />
          {/* ── Adaptive Learning Platform ── */}
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/peers" element={<PeerMatchPage />} />
          <Route path="/career" element={<CareerPathPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Route>
        {/* Full-screen pages (no Navbar) */}
        <Route path="/quiz" element={<AdaptiveQuizPage />} />
        <Route path="/initial-assessment" element={<InitialAssessmentPage />} />
        <Route path="/ai-analysis" element={<AIAnalysisPage />} />
      </Routes>
      <ChatbotWidget />
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
