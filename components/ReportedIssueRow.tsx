import React from 'react';
import { Link } from 'react-router-dom';
import { Issue, IssueStatus } from '../types';
import { ChevronRightIcon } from './icons';

const statusColors: Record<IssueStatus, string> = {
  [IssueStatus.Reported]: 'bg-blue-500/20 text-blue-300',
  [IssueStatus.Acknowledged]: 'bg-yellow-500/20 text-yellow-300',
  [IssueStatus.InProgress]: 'bg-orange-500/20 text-orange-300',
  [IssueStatus.Resolved]: 'bg-green-500/20 text-green-300',
  [IssueStatus.Rejected]: 'bg-red-500/20 text-red-300',
};

interface ReportedIssueRowProps {
  issue: Issue;
}

const ReportedIssueRow: React.FC<ReportedIssueRowProps> = ({ issue }) => {
  return (
    <Link 
        to={`/issues/${issue.id}`}
        className="block p-4 hover:bg-gray-700/50 transition-colors duration-200"
    >
        <div className="flex justify-between items-center">
            <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold text-white truncate">{issue.title}</p>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${statusColors[issue.status]}`}>
                        {issue.status}
                    </span>
                    <span>{issue.reportedAt.toLocaleDateString()}</span>
                </div>
            </div>
            <div className="ml-4 flex-shrink-0">
                <ChevronRightIcon className="w-6 h-6 text-gray-500" />
            </div>
        </div>
    </Link>
  );
};

export default ReportedIssueRow;