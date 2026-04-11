import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Brain, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Navigation links removed, they are now interactively hosted on Dashboard

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, label, mobile = false }) => {
    const active = isActive(to);
    const base = mobile
      ? 'block pl-3 pr-4 py-2.5 border-l-4 text-sm font-medium transition-colors'
      : 'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors whitespace-nowrap';
    const style = active
      ? (mobile ? 'bg-indigo-500/20 border-indigo-400 text-white' : 'border-indigo-400 text-white shadow-[0_4px_10px_-4px_rgba(99,102,241,0.5)]')
      : (mobile ? 'border-transparent text-indigo-200 hover:bg-white/5 hover:text-white' : 'border-transparent text-indigo-300 hover:text-white');
    return <Link to={to} className={`${base} ${style}`} onClick={() => setIsOpen(false)}>{label}</Link>;
  };

  // Dropdown menus removed per user request

  return (
    <nav className="bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                    AI
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text hidden lg:block">
                    AI Learn
                </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex md:space-x-4 items-center">
              <NavLink to="/" label="Home" />
              {user && (
                <NavLink to="/dashboard" label="Dashboard" />
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-white hover:text-indigo-300 transition-colors">
                  {user.profilePhoto ? (
                    <img src={user.profilePhoto} alt="Profile" className="h-8 w-8 rounded-full object-cover border border-white/20" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-indigo-300">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                <button 
                  onClick={logout}
                  className="p-2 rounded-xl text-indigo-300 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm text-gray-300 hover:text-white transition">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm text-white bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.6)] hover:scale-105 transition">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="-mr-2 flex items-center md:hidden gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-indigo-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-card mx-4 mt-2 mb-4 border-t-0 rounded-t-none">
          <div className="pt-2 pb-3 space-y-0.5">
            <NavLink to="/" label="🏠 Home" mobile />
            {user && (
              <>
                <NavLink to="/dashboard" label="📋 Dashboard" mobile />
              </>
            )}
            <div className="px-3 pt-3 pb-1">
              <p className="text-[10px] font-bold text-indigo-300/50 uppercase tracking-widest mb-1">Account</p>
            </div>
            {user ? (
              <>
                <NavLink to="/profile" label={`👤 ${user.name}`} mobile />
                <button 
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="w-full text-left block pl-3 pr-4 py-2.5 border-l-4 border-transparent text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" label="👤 Login" mobile />
                <NavLink to="/register" label="🚀 Register" mobile />
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
