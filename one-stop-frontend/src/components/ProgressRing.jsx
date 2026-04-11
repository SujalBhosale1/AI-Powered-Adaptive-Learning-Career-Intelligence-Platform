// Animated SVG Progress Ring — shows accuracy % per topic

const ProgressRing = ({ percentage = 0, size = 80, stroke = 8, color = '#6366f1', label = '', sublabel = '' }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={stroke}
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-bold text-slate-800">{percentage}%</span>
        </div>
      </div>
      {label && <p className="text-xs font-semibold text-slate-700 text-center leading-tight">{label}</p>}
      {sublabel && <p className="text-[10px] text-slate-400 text-center">{sublabel}</p>}
    </div>
  );
};

export default ProgressRing;
