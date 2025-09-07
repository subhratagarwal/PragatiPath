import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Issue, IssueCategory } from '../types';
import { MapPinIcon, XMarkIcon } from './icons';
import { categoryColors } from '../constants';

interface MapViewProps {
  issues: Issue[];
}

// Simple hash function to get a pseudo-random but deterministic position
const getPositionForIssue = (issueId: string) => {
  let hash = 0;
  for (let i = 0; i < issueId.length; i++) {
    const char = issueId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const x = (Math.abs(hash) % 90) + 5; // 5% to 95% for x
  
  // A slightly different hash for y
  let hashY = 0;
  for (let i = issueId.length - 1; i >= 0; i--) {
     const char = issueId.charCodeAt(i);
     hashY = ((hashY << 5) - hashY) + char;
     hashY |= 0;
  }
  const y = (Math.abs(hashY) % 80) + 10; // 10% to 90% for y

  return { top: `${y}%`, left: `${x}%` };
};

const MapView: React.FC<MapViewProps> = ({ issues }) => {
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
  };

  // FIX: Assign motion components to capitalized variables to resolve TypeScript type inference issues.
  const MotionDiv = motion.div;
  const MotionButton = motion.button;

  return (
    <div className="w-full h-[70vh] bg-gray-800/50 rounded-lg border border-gray-700 relative overflow-hidden shadow-lg">
      <div className="absolute inset-0 bg-map-pattern opacity-10"></div>
      <style>{`
        .bg-map-pattern {
          background-image:
            linear-gradient(rgba(107, 114, 128, 0.1) 1px, transparent 1px),
            linear-gradient(to right, rgba(107, 114, 128, 0.1) 1px, transparent 1px);
          background-size: 2rem 2rem;
        }
      `}</style>
      
      <MotionDiv
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full h-full"
      >
        {issues.map(issue => {
          const { top, left } = getPositionForIssue(issue.id);
          return (
            <MotionButton
              key={issue.id}
              variants={itemVariants}
              onClick={() => setActiveIssue(issue)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ top, left }}
              aria-label={`View issue: ${issue.title}`}
            >
              <MapPinIcon className={`w-8 h-8 text-cyan-400 drop-shadow-lg transition-transform hover:scale-125 ${activeIssue?.id === issue.id ? 'scale-125' : ''}`} />
              <div className={`absolute top-1/2 left-1/2 w-4 h-4 rounded-full transform -translate-x-1/2 -translate-y-[130%] opacity-80 border-2 ${categoryColors[issue.category]}`}></div>
            </MotionButton>
          );
        })}
      </MotionDiv>

      <AnimatePresence>
        {activeIssue && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl p-4"
          >
            <div className="flex">
                <div className="flex-1">
                    <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full mb-2 text-white ${categoryColors[activeIssue.category]}`}>
                        {activeIssue.category}
                    </span>
                    <h3 className="font-bold text-white">{activeIssue.title}</h3>
                    <p className="text-sm text-gray-400">{activeIssue.address}</p>
                    <Link to={`/issues/${activeIssue.id}`} className="text-cyan-400 hover:underline text-sm font-semibold mt-2 inline-block">
                        View Details &rarr;
                    </Link>
                </div>
                <button onClick={() => setActiveIssue(null)} className="ml-2 text-gray-400 hover:text-white self-start">
                    <XMarkIcon className="w-5 h-5"/>
                </button>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapView;