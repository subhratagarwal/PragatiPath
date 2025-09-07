import React from 'react';
import { motion } from 'framer-motion';
import { IssueCategory } from '../types';
import { MapPinIcon } from './icons';
import { categoryColors } from '../constants';

interface LiveMapProps {
  address: string;
  category: IssueCategory;
}

const LiveMap: React.FC<LiveMapProps> = ({ address, category }) => {
  const pinColorClass = categoryColors[category] || categoryColors[IssueCategory.Other];
  const mapUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(address)}`;

  // FIX: Assign motion components to capitalized variables to resolve TypeScript type inference issues.
  const MotionA = motion.a;
  const MotionDiv = motion.div;

  return (
    <MotionA
      href={mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      className="block w-full h-48 bg-gray-800/50 rounded-lg border border-gray-700 relative overflow-hidden shadow-lg flex items-center justify-center p-4 cursor-pointer"
      aria-label={`Open map for ${address}`}
    >
      {/* Map Background Pattern */}
      <div className="absolute inset-0 bg-map-pattern opacity-10"></div>
      <style>{`
        .bg-map-pattern {
          background-image:
            linear-gradient(rgba(107, 114, 128, 0.1) 1px, transparent 1px),
            linear-gradient(to right, rgba(107, 114, 128, 0.1) 1px, transparent 1px);
          background-size: 2rem 2rem;
        }
      `}</style>

      {/* Centered Issue Pin and Address */}
      <div className="relative flex flex-col items-center z-10">
        <MotionDiv
          initial={{ scale: 0, y: -50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
        >
          <MapPinIcon className="w-16 h-16 text-cyan-400 drop-shadow-lg" />
          <div className={`absolute top-1/2 left-1/2 w-6 h-6 rounded-full transform -translate-x-1/2 -translate-y-[135%] border-2 ${pinColorClass}`}></div>
        </MotionDiv>

        <div className="absolute -bottom-12 w-56 text-center">
             <div className="inline-block bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-semibold">
                {address}
            </div>
        </div>
      </div>
    </MotionA>
  );
};

export default LiveMap;