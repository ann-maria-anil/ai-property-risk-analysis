import React from 'react';
import { motion } from 'motion/react';

interface RiskScoreGaugeProps {
  score: number;
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({ score }) => {
  const getColor = (s: number) => {
    if (s < 30) return '#10b981'; // emerald-500
    if (s < 70) return '#f59e0b'; // amber-500
    return '#ef4444'; // rose-500
  };

  const getLabel = (s: number) => {
    if (s < 30) return 'Safe';
    if (s < 70) return 'Caution';
    return 'High Risk';
  };

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-slate-100"
          />
          <motion.circle
            cx="96"
            cy="96"
            r={radius}
            stroke={getColor(score)}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-light text-slate-900">{score}</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Risk Score</span>
        </div>
      </div>
      <div className="mt-6 text-center">
        <div className="text-sm font-medium text-slate-600 mb-1">Overall Assessment</div>
        <div className="text-xl font-semibold" style={{ color: getColor(score) }}>{getLabel(score)}</div>
      </div>
    </div>
  );
};
