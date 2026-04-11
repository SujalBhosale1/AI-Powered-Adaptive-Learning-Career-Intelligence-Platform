const SkillBadge = ({ skill, missing = false }) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border";
    const colors = missing
        ? "bg-red-500/20 text-red-400 border-red-500/30"
        : "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";

    return (
        <span className={`${baseClasses} ${colors}`}>
            {skill}
        </span>
    );
};

export default SkillBadge;
