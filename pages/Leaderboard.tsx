
import React from 'react';
import { motion } from 'framer-motion';
import LeaderboardCard from '../components/LeaderboardCard';
import { mockUsers } from '../constants';

const Leaderboard = () => {
  const sortedUsers = [...mockUsers].sort((a, b) => b.points - a.points);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // FIX: Assign motion components to capitalized variables to resolve TypeScript type inference issues.
  const MotionDiv = motion.div;
  const MotionH1 = motion.h1;
  const MotionP = motion.p;

  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-4xl mx-auto"
    >
      <header className="text-center mb-12">
        <MotionH1 variants={itemVariants} className="text-5xl font-extrabold text-cyan-400 mb-2">Community Champions</MotionH1>
        <MotionP variants={itemVariants} className="text-lg text-gray-300">Celebrating the top contributors making our city a better place.</MotionP>
      </header>

      <MotionDiv variants={containerVariants} className="space-y-4">
        {sortedUsers.map((user, index) => (
          <MotionDiv key={user.id} variants={itemVariants}>
            <LeaderboardCard user={user} rank={index + 1} />
          </MotionDiv>
        ))}
      </MotionDiv>
    </MotionDiv>
  );
};

export default Leaderboard;