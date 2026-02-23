import React from 'react';
import { OwnershipEvent } from '../types';
import { Calendar, User, Info } from 'lucide-react';

interface TimelineProps {
  events: OwnershipEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
      {events.map((event, index) => (
        <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          {/* Icon */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
            <Calendar size={18} />
          </div>
          {/* Content */}
          <div className="w-[calc(100%-4rem)] md:w-[45%] p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <time className="font-mono text-xs font-bold text-emerald-600 uppercase tracking-wider">{event.year}</time>
            </div>
            <div className="text-slate-900 font-semibold mb-1">{event.event}</div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <User size={14} />
              <span>{event.party}</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {event.details}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
