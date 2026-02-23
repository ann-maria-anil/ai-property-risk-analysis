import React from 'react';
import { RiskFactor } from '../types';
import { AlertTriangle, ShieldCheck, Info, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface RiskCardProps {
  risk: RiskFactor;
}

export const RiskCard: React.FC<RiskCardProps> = ({ risk }) => {
  const severityColors = {
    Low: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Medium: "bg-amber-50 text-amber-700 border-amber-100",
    High: "bg-rose-50 text-rose-700 border-rose-100"
  };

  const icons = {
    Legal: <AlertCircle size={18} />,
    Financial: <AlertTriangle size={18} />,
    Structural: <Info size={18} />,
    Ownership: <ShieldCheck size={18} />
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-50 text-slate-600">
            {icons[risk.type]}
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">{risk.type} Risk</h4>
            <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border", severityColors[risk.severity])}>
              {risk.severity} Severity
            </span>
          </div>
        </div>
      </div>
      <p className="text-sm text-slate-600 mb-4 leading-relaxed">
        {risk.description}
      </p>
      <div className="pt-4 border-t border-slate-50">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Recommendation</div>
        <p className="text-sm text-slate-800 font-medium">
          {risk.recommendation}
        </p>
      </div>
    </div>
  );
};
