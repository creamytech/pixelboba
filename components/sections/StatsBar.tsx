'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Briefcase, Clock, MapPin, Wifi } from 'lucide-react';

const stats = [
  {
    icon: Briefcase,
    number: 30,
    suffix: '+',
    label: 'Projects Launched',
    color: 'from-taro to-deep-taro',
  },
  {
    icon: Clock,
    number: 6,
    suffix: '',
    prefix: '2-',
    label: 'Week Turnaround',
    color: 'from-matcha to-matcha/80',
  },
  {
    icon: Wifi,
    number: 100,
    suffix: '%',
    label: 'Remote Friendly',
    color: 'from-milk-tea to-milk-tea/70',
  },
  {
    icon: MapPin,
    number: 954,
    suffix: '',
    label: 'Fort Lauderdale Based',
    color: 'from-taro/80 to-matcha',
  },
];

function Counter({
  target,
  suffix = '',
  prefix = '',
}: {
  target: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = target / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return (
    <span ref={ref} className="font-bold">
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

export default function StatsBar() {
  return (
    <section className="py-12 bg-gradient-to-r from-slate-bg via-slate-bg/95 to-slate-bg relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-taro rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-matcha rounded-full blur-3xl"></div>
      </div>

      {/* Animated pearls */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-taro/30 rounded-full"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 30}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.2, 0.5, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3 + i * 0.3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 5 }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="text-3xl md:text-4xl font-display text-white mb-2">
                    <Counter target={stat.number} suffix={stat.suffix} prefix={stat.prefix} />
                  </div>
                  <div className="text-sm md:text-base text-gray-300 font-medium">{stat.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
