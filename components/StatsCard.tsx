import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
  color?: 'cyan' | 'red' | 'yellow' | 'green';
}

const colorStyles = {
    cyan: {
        bg: 'bg-cyan-500/20',
        text: 'text-cyan-400',
    },
    red: {
        bg: 'bg-red-500/20',
        text: 'text-red-400',
    },
    yellow: {
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-400',
    },
    green: {
        bg: 'bg-green-500/20',
        text: 'text-green-400',
    }
};


const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, title, value, change, changeType, color = 'cyan' }) => {
  const changeColor = changeType === 'increase' ? 'text-green-400' : 'text-red-400';
  const styles = colorStyles[color];
  // FIX: Assign motion component to a capitalized variable to resolve TypeScript type inference issue.
  const MotionDiv = motion.div;
  
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300, duration: 0.5 }}
      className="bg-gray-800/60 p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col justify-between h-full cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-300">{title}</h3>
        <div className={`${styles.bg} p-2 rounded-md`}>
          <Icon className={`h-6 w-6 ${styles.text}`} />
        </div>
      </div>
      <div>
        <p className="text-4xl font-bold text-white">{value}</p>
        {change && (
          <p className={`text-sm mt-1 ${changeColor}`}>
            {change} vs last month
          </p>
        )}
      </div>
    </MotionDiv>
  );
};

export default StatsCard;