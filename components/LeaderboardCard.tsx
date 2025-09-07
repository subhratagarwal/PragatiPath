
import React from 'react';
import { motion } from 'framer-motion';
import { User } from '../types';

interface LeaderboardCardProps {
  user: User;
  rank: number;
}

const rankColors: { [key: number]: string } = {
  1: 'border-yellow-400 bg-yellow-400/10 text-yellow-300 shadow-yellow-400/20',
  2: 'border-gray-300 bg-gray-300/10 text-gray-200 shadow-gray-300/20',
  3: 'border-amber-600 bg-amber-600/10 text-amber-500 shadow-amber-600/20',
};

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ user, rank }) => {
  const cardStyle = rankColors[rank] || 'border-gray-700 bg-gray-800/50';
  // FIX: Assign motion component to a capitalized variable to resolve TypeScript type inference issue.
  const MotionDiv = motion.div;

  return (
    <MotionDiv
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`flex items-center p-4 rounded-lg border shadow-lg transition-all duration-300 ${cardStyle}`}
    >
      <div className="text-2xl font-bold w-12 text-center">{rank}</div>
      <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full mx-4 border-2 border-cyan-400" />
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white">{user.name}</h3>
        <p className="text-cyan-400">{user.points.toLocaleString()} points</p>
      </div>
      <div className="flex items-center space-x-2">
        {user.badges.map(badge => (
          <div key={badge.id} className="group relative">
            <badge.icon className="h-8 w-8 text-gray-400 group-hover:text-yellow-400 transition-colors" />
            <div className="absolute bottom-full mb-2 w-48 p-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 shadow-lg">
              <p className="font-bold">{badge.name}</p>
              <p>{badge.description}</p>
            </div>
          </div>
        ))}
      </div>
    </MotionDiv>
  );
};

export default LeaderboardCard;