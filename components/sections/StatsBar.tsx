'use client';

import { Briefcase, Clock, MapPin, Wifi } from 'lucide-react';

const stats = [
  { icon: Briefcase, number: '30+', label: 'Projects Launched' },
  { icon: Clock, number: '2-6', label: 'Week Turnaround' },
  { icon: Wifi, number: '100%', label: 'Remote Friendly' },
  { icon: MapPin, number: '954', label: 'Fort Lauderdale Based' },
];

export default function StatsBar() {
  return (
    <div className="py-10 px-8 md:px-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-5xl mx-auto">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="text-center">
              <Icon className="w-14 h-14 text-[#A78BFA] mx-auto mb-4 stroke-[2.5]" />
              <div className="text-5xl md:text-6xl font-black text-ink mb-2">{stat.number}</div>
              <div className="text-base font-black text-ink/60 tracking-tight">{stat.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
