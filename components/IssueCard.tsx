
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Issue, IssueStatus } from '../types';
import { ChevronUpIcon, MapPinIcon } from './icons';
import IssueTimeline from './IssueTimeline';

const statusColors: Record<IssueStatus, string> = {
  [IssueStatus.Reported]: 'bg-blue-500/20 text-blue-300 border-blue-500',
  [IssueStatus.Acknowledged]: 'bg-yellow-500/20 text-yellow-300 border-yellow-500',
  [IssueStatus.InProgress]: 'bg-orange-500/20 text-orange-300 border-orange-500',
  [IssueStatus.Resolved]: 'bg-green-500/20 text-green-300 border-green-500',
  [IssueStatus.Rejected]: 'bg-red-500/20 text-red-300 border-red-500',
};

interface IssueCardProps {
  issue: Issue;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  // FIX: Assign motion component to a capitalized variable to resolve TypeScript type inference issue.
  const MotionDiv = motion.div;

  return (
    <MotionDiv
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="h-full"
    >
      <Link to={`/issues/${issue.id}`} className="block h-full">
        <div className="bg-gray-800/50 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-cyan-500/10 h-full flex flex-col">
          <img src={issue.imageUrl} alt={issue.title} className="w-full h-48 object-cover" />
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-2">
                <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full border ${statusColors[issue.status]}`}>
                    {issue.status}
                </span>
                <div className="flex items-center space-x-2 text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
                    <ChevronUpIcon className="h-5 w-5 text-cyan-400" />
                    <span className="font-bold text-white">{issue.upvotes}</span>
                </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{issue.title}</h3>
            <div className="flex items-center text-gray-400 text-sm mb-4">
              <MapPinIcon className="h-4 w-4 mr-2" />
              <span>{issue.address}</span>
            </div>
            <p className="text-gray-300 mb-4 h-20 overflow-hidden text-ellipsis flex-grow">{issue.description}</p>
            
            <div className="mt-auto">
                <IssueTimeline timeline={issue.timeline} status={issue.status}/>
            
                <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center text-sm text-gray-500">
                    <span>Reported by {issue.reportedBy}</span>
                    <span>{issue.reportedAt.toLocaleDateString()}</span>
                </div>
            </div>
          </div>
        </div>
      </Link>
    </MotionDiv>
  );
};

export default IssueCard;