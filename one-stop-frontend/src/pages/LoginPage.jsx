import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await login(email, password);
        setIsLoading(false);

        if (result.success) {
            navigate(result.user.profileComplete ? '/dashboard' : '/profile-setup');
        } else {
            setError(result.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="flex flex-col justify-center min-h-screen bg-gray-950 text-white font-sans">

            {/* HEADER */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="flex justify-center">
                    <BookOpen className="h-12 w-12 text-indigo-400" />
                </div>

                <h2 className="mt-6 text-3xl font-extrabold">
                    Welcome back
                </h2>

                <p className="mt-2 text-sm text-gray-400">
                    Sign in to access your recommendations
                </p>
            </div>

            {/* CARD */}
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-gray-900 border border-gray-700 rounded-2xl py-8 px-6 shadow-lg">

                    {/* ERROR */}
                    {error && (
                        <div className="mb-6 bg-red-500/20 text-red-200 border border-red-500/40 text-sm px-4 py-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {/* EMAIL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email address
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 
                                bg-gray-800 border border-gray-600 
                                text-white placeholder-gray-400 
                                rounded-lg 
                                focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 
                                bg-gray-800 border border-gray-600 
                                text-white placeholder-gray-400 
                                rounded-lg 
                                focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 px-4 text-sm font-bold rounded-lg text-white transition 
                            ${isLoading
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-500'
                                }`}
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    {/* FOOTER */}
                    <div className="mt-6 text-center text-sm">
                        <p className="text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300">
                                Register now
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LoginPage;