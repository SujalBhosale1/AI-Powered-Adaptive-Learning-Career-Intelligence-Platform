import { useState } from 'react';
import { User, Mail, School, MapPin, Edit2, Save, X } from 'lucide-react';
import { engineeredData } from '../data/dummyData';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
    const { user, updateProfile } = useAuth();
    
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editData, setEditData] = useState({});
    
    // Fallback to dummy data for fields not yet captured in DB
    const dummyStudent = engineeredData.student;
    
    // Use MongoDB data if available
    const name = user?.name || dummyStudent.name;
    const email = user?.email || dummyStudent.email || "student@example.com";
    const role = user?.targetRole || "Engineering Student";
    const interests = user?.interests?.length > 0 ? user.interests : dummyStudent.interests;
    
    const handleEditClick = () => {
        setEditData({
            name: user?.name || '',
            city: user?.city || '',
            state: user?.state || '',
            board: user?.board || '',
            marks10: user?.marks10 || '',
            marks12: user?.marks12 || '',
            cetScore: user?.cetScore || '',
            jeeScore: user?.jeeScore || '',
            profilePhoto: user?.profilePhoto || null
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Map editData directly to API payload format, ensuring numbers for scores
        const payload = {
            ...editData,
            marks10: Number(editData.marks10) || null,
            marks12: Number(editData.marks12) || null,
            cetScore: Number(editData.cetScore) || null,
            jeeScore: Number(editData.jeeScore) || null,
        };
        const result = await updateProfile(payload);
        setIsSaving(false);
        if(result.success) {
            setIsEditing(false);
        } else {
            alert(result.message || "Failed to update profile");
        }
    };

    // DB synced academic properties
    const board12 = user?.board || dummyStudent.education.board12;
    const location = (user?.city && user?.state) ? `${user.city}, ${user.state}` : "Mumbai, India";
    
    // DB synced exam scores
    const marks10 = user?.marks10 !== undefined && user?.marks10 !== null ? `${user.marks10}%` : dummyStudent.education.marks10;
    const marks12 = user?.marks12 !== undefined && user?.marks12 !== null ? `${user.marks12}%` : dummyStudent.education.marks12;
    const cet = user?.cetScore !== undefined && user?.cetScore !== null ? `${user.cetScore} percentile` : dummyStudent.examScores.cet;
    const jee = user?.jeeScore !== undefined && user?.jeeScore !== null ? `${user.jeeScore} percentile` : dummyStudent.examScores.jee;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Profile Header Card */}
            <div className="glass-card overflow-hidden mb-8 shadow-lg">
                <div className="h-32 bg-gradient-to-r from-purple-500/20 via-indigo-600/40 to-blue-500/20 mix-blend-screen backdrop-blur-md"></div>
                <div className="px-8 pb-8 relative z-10">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="p-1 bg-[#0F172A] rounded-full relative group shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                            <div className="h-24 w-24 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 border-4 border-[#0F172A] overflow-hidden">
                                {(isEditing ? editData.profilePhoto : user?.profilePhoto) ? (
                                    <img src={isEditing ? editData.profilePhoto : user.profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    <User className="h-12 w-12" />
                                )}
                            </div>
                            {isEditing && (
                                <label className="absolute inset-2 flex items-center justify-center bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity z-10 m-1">
                                    <span className="text-xs font-semibold">Upload Photo</span>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                if (file.size > 2 * 1024 * 1024) {
                                                    alert("Image size should be less than 2MB");
                                                    return;
                                                }
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setEditData({...editData, profilePhoto: reader.result});
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </label>
                            )}
                        </div>
                        
                        {isEditing ? (
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setIsEditing(false)}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-indigo-200 font-medium hover:bg-white/10 transition-colors shadow-sm"
                                >
                                    <X className="h-4 w-4" />
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 border border-transparent rounded-lg text-white font-medium shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all ${isSaving ? 'opacity-50' : 'hover:scale-105'}`}
                                >
                                    <Save className="h-4 w-4" />
                                    {isSaving ? 'Saving...' : 'Save Profile'}
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={handleEditClick}
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-indigo-200 font-medium hover:bg-white/10 transition-colors shadow-sm"
                            >
                                <Edit2 className="h-4 w-4" />
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <div>
                        {isEditing ? (
                            <input 
                                type="text"
                                value={editData.name}
                                onChange={e => setEditData({...editData, name: e.target.value})}
                                className="text-3xl font-bold text-white border-b-2 border-indigo-500/50 focus:border-indigo-400 focus:outline-none bg-transparent"
                                placeholder="Full Name"
                            />
                        ) : (
                            <h1 className="text-3xl font-bold text-white">{name}</h1>
                        )}
                        <p className="text-indigo-300 text-lg mt-1">{role}</p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-6 text-indigo-200">
                        <div className="flex items-center gap-2">
                            <School className="h-5 w-5 text-indigo-400" />
                            {isEditing ? (
                                <input 
                                    type="text"
                                    value={editData.board}
                                    onChange={e => setEditData({...editData, board: e.target.value})}
                                    className="border-b border-white/20 focus:border-indigo-400 focus:outline-none bg-transparent w-32 placeholder-indigo-400/50 text-white"
                                    placeholder="Board details"
                                />
                            ) : <span>{board12}</span>}
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-indigo-400" />
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <input 
                                        type="text"
                                        value={editData.city}
                                        onChange={e => setEditData({...editData, city: e.target.value})}
                                        className="border-b border-white/20 focus:border-indigo-400 focus:outline-none bg-transparent w-24 placeholder-indigo-400/50 text-white"
                                        placeholder="City"
                                    />
                                    <input 
                                        type="text"
                                        value={editData.state}
                                        onChange={e => setEditData({...editData, state: e.target.value})}
                                        className="border-b border-white/20 focus:border-indigo-400 focus:outline-none bg-transparent w-24 placeholder-indigo-400/50 text-white"
                                        placeholder="State"
                                    />
                                </div>
                            ) : <span>{location}</span>}
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-indigo-400" />
                            <span>{email}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Academic Info */}
                <div className="glass-card p-6 border-indigo-500/10">
                    <h2 className="text-lg font-bold text-white mb-4">Academic Background</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-white/10 last:border-0">
                            <span className="text-indigo-200">10th Grade Score</span>
                            {isEditing ? (
                                <input 
                                    type="number"
                                    value={editData.marks10}
                                    onChange={e => setEditData({...editData, marks10: e.target.value})}
                                    className="font-semibold text-white text-right w-20 border-b border-white/20 focus:outline-none focus:border-indigo-400 bg-transparent placeholder-indigo-400/50"
                                />
                            ) : <span className="font-semibold text-white">{marks10}</span>}
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/10 last:border-0">
                            <span className="text-indigo-200">12th Grade Score</span>
                            {isEditing ? (
                                <input 
                                    type="number"
                                    value={editData.marks12}
                                    onChange={e => setEditData({...editData, marks12: e.target.value})}
                                    className="font-semibold text-white text-right w-20 border-b border-white/20 focus:outline-none focus:border-indigo-400 bg-transparent placeholder-indigo-400/50"
                                />
                            ) : <span className="font-semibold text-white">{marks12}</span>}
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/10 last:border-0">
                            <span className="text-indigo-200">CET Score</span>
                            {isEditing ? (
                                <input 
                                    type="number"
                                    value={editData.cetScore}
                                    onChange={e => setEditData({...editData, cetScore: e.target.value})}
                                    className="font-semibold text-white text-right w-20 border-b border-white/20 focus:outline-none focus:border-indigo-400 bg-transparent placeholder-indigo-400/50"
                                />
                            ) : <span className="font-semibold text-white">{cet}</span>}
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/10 last:border-0">
                            <span className="text-indigo-200">JEE Mains Score</span>
                            {isEditing ? (
                                <input 
                                    type="number"
                                    value={editData.jeeScore}
                                    onChange={e => setEditData({...editData, jeeScore: e.target.value})}
                                    className="font-semibold text-white text-right w-20 border-b border-white/20 focus:outline-none focus:border-indigo-400 bg-transparent placeholder-indigo-400/50"
                                />
                            ) : <span className="font-semibold text-white">{jee}</span>}
                        </div>
                    </div>
                </div>

                {/* Interests */}
                <div className="glass-card p-6 border-purple-500/10">
                    <h2 className="text-lg font-bold text-white mb-4">Interests / Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {interests.map((interest, idx) => (
                            <span key={idx} className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium border border-indigo-500/30">
                                {interest}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
