import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        setIsLoading(true);
        const result = await register(formData.name, formData.email, formData.password);
        setIsLoading(false);

        if (result.success) {
            navigate(result.user.profileComplete ? '/dashboard' : '/profile-setup');
        } else {
            setError(result.message || 'Registration failed. Try again.');
        }
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 glass-card p-10">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-white">Create an account</h2>
                    <p className="mt-2 text-sm text-indigo-200">
                        Join One Stop to start your journey
                    </p>
                </div>
                {error && (
                    <div className="mt-4 bg-red-500/20 text-red-100 border border-red-500/30 text-sm font-medium px-4 py-3 rounded-lg text-center backdrop-blur-sm">
                        {error}
                    </div>
                )}
                    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-indigo-200 mb-1">Full Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="appearance-none block w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-indigo-300/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-indigo-200 mb-1">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none block w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-indigo-300/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-indigo-200 mb-1">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none block w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-indigo-300/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-indigo-200 mb-1">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="appearance-none block w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-indigo-300/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white transition-all shadow-[0_0_15px_rgba(99,102,241,0.5)] ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
                            >
                                {isLoading ? 'Registering...' : 'Register'}
                            </button>
                        </div>
                    </form>
                    <div className="mt-6 text-center text-sm">
                        <p className="text-indigo-200">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
    );
};

export default RegisterPage;
