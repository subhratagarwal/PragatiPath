
import React from 'react';
import { motion } from 'framer-motion';
import { IssueStatus } from '../types';

interface IssueTimelineProps {
  timeline: { status: IssueStatus; date: Date; notes?: string }[];
  status: IssueStatus;
}

const allStatuses: IssueStatus[] = [
  IssueStatus.Reported,
  IssueStatus.Acknowledged,
  IssueStatus.InProgress,
  IssueStatus.Resolved,
];

const statusColors: Record<IssueStatus, { bg: string, border: string }> = {
    [IssueStatus.Reported]: { bg: 'bg-blue-500', border: 'border-blue-500' },
    [IssueStatus.Acknowledged]: { bg: 'bg-yellow-500', border: 'border-yellow-500' },
    [IssueStatus.InProgress]: { bg: 'bg-orange-500', border: 'border-orange-500' },
    [IssueStatus.Resolved]: { bg: 'bg-green-500', border: 'border-green-500' },
    [IssueStatus.Rejected]: { bg: 'bg-red-500', border: 'border-red-500' },
};

const IssueTimeline: React.FC<IssueTimelineProps> = ({ timeline, status }) => {
    const currentStatusIndex = allStatuses.indexOf(status);
    // FIX: Assign motion component to a capitalized variable to resolve TypeScript type inference issue.
    const MotionDiv = motion.div;

    return (
        <div>
            <div className="flex items-center justify-between relative">
                {allStatuses.map((s, index) => (
                    <div key={s} className="flex-1 flex flex-col items-center z-10">
                        <div className={`w-4 h-4 rounded-full transition-colors duration-500 ${index <= currentStatusIndex ? statusColors[s].bg : 'bg-gray-600'}`}></div>
                        <p className={`mt-1 text-xs text-center ${index <= currentStatusIndex ? 'text-white' : 'text-gray-500'}`}>{s}</p>
                    </div>
                ))}

                <div className="absolute top-2 left-0 w-full h-0.5 bg-gray-600">
                    <MotionDiv
                        className={`h-full ${statusColors[status].bg}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStatusIndex / (allStatuses.length - 1)) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                </div>
            </div>
            
            {timeline.slice(-1)[0]?.notes && (
                 <div className="mt-4 p-2 text-xs text-center bg-gray-700/50 rounded-md text-gray-300">
                    <strong>Last Update:</strong> {timeline.slice(-1)[0].notes}
                </div>
            )}
        </div>
    );
};

export default IssueTimeline;