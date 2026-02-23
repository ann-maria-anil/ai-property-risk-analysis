import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface RiskBreakdownChartProps {
  scores: {
    Legal: number;
    Financial: number;
    Structural: number;
    Ownership: number;
  };
}

export const RiskBreakdownChart: React.FC<RiskBreakdownChartProps> = ({ scores }) => {
  const data = [
    { subject: 'Legal', A: scores.Legal, fullMark: 100 },
    { subject: 'Financial', A: scores.Financial, fullMark: 100 },
    { subject: 'Structural', A: scores.Structural, fullMark: 100 },
    { subject: 'Ownership', A: scores.Ownership, fullMark: 100 },
  ];

  return (
    <div className="w-full h-64 bg-white rounded-3xl border border-slate-100 p-4 shadow-sm">
      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 text-center">Risk Distribution</div>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
          <Radar
            name="Risk"
            dataKey="A"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
