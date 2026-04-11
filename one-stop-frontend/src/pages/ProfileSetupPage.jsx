import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Award, Target, Save, Briefcase, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ProfileSetupPage = () => {
    const navigate = useNavigate();
    const { setupProfile } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        phone: '',
        city: '',
        state: '',
        marks10: '',
        marks12: '',
        board: 'CBSE',
        jeeScore: '',
        cetScore: '',
        targetBranch: '',
        interests: {
            robotics: false,
            coding: false,
            electronics: false,
            mechanics: false,
            ai_ml: false
        }
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                interests: { ...prev.interests, [name]: checked }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const apiPayload = {
            branch: formData.targetBranch || 'Undecided',
            year: 1,
            college: 'N/A',
            cgpa: 0,

            phone: formData.phone,
            city: formData.city,
            state: formData.state,
            marks10: Number(formData.marks10) || null,
            marks12: Number(formData.marks12) || null,
            board: formData.board,
            jeeScore: Number(formData.jeeScore) || null,
            cetScore: Number(formData.cetScore) || null,

            interests: Object.keys(formData.interests).filter(k => formData.interests[k]),
            skills: [],
            goals: ['Get Placed'],
            targetRole: formData.targetBranch === 'CS' ? 'Software Engineer' : (formData.targetBranch || 'Engineer')
        };

        const result = await setupProfile(apiPayload);
        setIsLoading(false);

        if (result.success) {
            // First time user → take them through the assessment pipeline
            navigate('/initial-assessment');
        } else {
            setError(result.message);
        }
    };
    return (
        <div className="py-12 px-4 flex items-center justify-center">
            <div className="max-w-3xl w-full mx-auto">

                {/* HEADER */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Complete Your Profile</h1>
                    <p className="mt-2 text-indigo-200">
                        Help us personalize your recommendation engine.
                    </p>
                </div>

                {/* CARD */}
                <div className="glass-card">

                    {error && (
                        <div className="mx-8 mt-8 bg-red-500/20 text-red-200 border border-red-500/40 px-4 py-3 rounded-xl text-center backdrop-blur-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">

                        {/* SECTION 1 */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                                <MapPin className="text-indigo-400 h-5 w-5" />
                                Location & Contact
                            </h2>

                            <div className="grid md:grid-cols-3 gap-6">
                                {["phone", "city", "state"].map((field) => (
                                    <input
                                        key={field}
                                        name={field}
                                        placeholder={field}
                                        required
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-indigo-300/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                ))}
                            </div>
                        </div>

                        <hr className="border-white/10" />

                        {/* SECTION 2 */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                                <BookOpen className="text-indigo-400 h-5 w-5" />
                                Academic History
                            </h2>

                            <div className="grid md:grid-cols-3 gap-6">
                                <input type="number" name="marks10" placeholder="10th %" onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-indigo-300/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />

                                <input type="number" name="marks12" placeholder="12th %" onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-indigo-300/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />

                                <select name="board" onChange={handleChange}
                                    className="w-full px-4 py-3 bg-[#0F172A] border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 form-select">
                                    <option>CBSE</option>
                                    <option>ICSE</option>
                                    <option>State Board</option>
                                </select>
                            </div>
                        </div>

                        <hr className="border-white/10" />

                        {/* SECTION 3 */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                                <Award className="text-indigo-400 h-5 w-5" />
                                Competitive Exams
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <input type="number" name="jeeScore" placeholder="JEE %" onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-indigo-300/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />

                                <input type="number" name="cetScore" placeholder="CET %" onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 placeholder-indigo-300/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                        </div>

                        <hr className="border-white/10" />

                        {/* SECTION 4 */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                                <Target className="text-indigo-400 h-5 w-5" />
                                Areas of Interest
                            </h2>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {Object.keys(formData.interests).map((interest) => (
                                    <label key={interest}
                                        className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">

                                        <input
                                            type="checkbox"
                                            name={interest}
                                            checked={formData.interests[interest]}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-indigo-600 border-white/20 rounded focus:ring-indigo-500 bg-white/10"
                                        />

                                        <span className="capitalize text-indigo-100">
                                            {interest.replace('_', ' ')}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <hr className="border-white/10" />

                        {/* SECTION 5 */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                                <Briefcase className="text-indigo-400 h-5 w-5" />
                                Future Goals
                            </h2>

                            <select
                                name="targetBranch"
                                required
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#0F172A] border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 form-select"
                            >
                                <option value="">Select a preference...</option>
                                <option>Computer Science</option>
                                <option>Information Technology</option>
                                <option>Electronics</option>
                                <option>Mechanical</option>
                                <option>Civil</option>
                                <option>Undecided</option>
                            </select>
                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all shadow-[0_0_15px_rgba(99,102,241,0.5)] ${isLoading
                                ? 'bg-indigo-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                }`}
                        >
                            {isLoading ? 'Saving...' : 'Complete Profile & Go to Dashboard'}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}
export default ProfileSetupPage;
