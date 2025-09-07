import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import IssueCard from '../components/IssueCard';
import { Issue, IssueCategory, IssueStatus } from '../types';
import { Squares2x2Icon, MapIcon } from '../components/icons';
import MapView from '../components/MapView';

const FilterButton = ({ value, state, setState, children }: { value: string, state: string, setState: (val: any) => void, children: React.ReactNode }) => (
  <button
    onClick={() => setState(value)}
    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${state === value ? 'bg-cyan-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
  >
    {children}
  </button>
);

interface IssuesFeedProps {
  issues: Issue[];
}

const IssuesFeed: React.FC<IssuesFeedProps> = ({ issues }) => {
  const [searchParams] = useSearchParams();
  const dashboardFilter = searchParams.get('filter');

  const [filterCategory, setFilterCategory] = useState<IssueCategory | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<IssueStatus | 'All'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  
  const userHasFiltered = filterCategory !== 'All' || filterStatus !== 'All';

  const displayedIssues = useMemo(() => {
    let dataToFilter = issues;
    
    // Apply dashboard filter only if user hasn't interacted with page filters
    if (dashboardFilter && !userHasFiltered) {
        switch(dashboardFilter) {
          case 'open':
            dataToFilter = issues.filter(i => i.status !== IssueStatus.Resolved && i.status !== IssueStatus.Rejected);
            break;
          case 'resolved_today': // Note: In a real app, this would check the resolution date.
            dataToFilter = issues.filter(i => i.status === IssueStatus.Resolved);
            break;
          case 'high_priority':
            dataToFilter = issues.filter(i => i.priority === 'High' || i.priority === 'Critical');
            break;
        }
    }
    
    // Always apply page-level filters
    return dataToFilter.filter(issue => {
      const categoryMatch = filterCategory === 'All' || issue.category === filterCategory;
      const statusMatch = filterStatus === 'All' || issue.status === filterStatus;
      return categoryMatch && statusMatch;
    });
  }, [issues, dashboardFilter, userHasFiltered, filterCategory, filterStatus]);

  const getFilterTitle = () => {
    if (userHasFiltered) return 'Filtered Issues';
    switch(dashboardFilter) {
      case 'open': return 'Showing: Open Issues';
      case 'resolved_today': return 'Showing: Resolved Issues';
      case 'high_priority': return 'Showing: High Priority Issues';
      default: return 'Live Issues Feed';
    }
  };

  // FIX: Assign motion component to a capitalized variable to resolve TypeScript type inference issue.
  const MotionDiv = motion.div;

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold text-center mb-4">{getFilterTitle()}</h1>
      <p className="text-center text-gray-400 mb-8">Browse, upvote, and track civic issues reported by the community.</p>

      <div className="mb-8 p-4 bg-gray-800/50 rounded-lg space-y-4">
        <div className="flex flex-col md:flex-row justify-center gap-4">
            <div className="flex items-center gap-2 flex-wrap justify-center">
                <span className="font-semibold mr-2">Category:</span>
                <FilterButton value="All" state={filterCategory} setState={setFilterCategory}>All</FilterButton>
                {Object.values(IssueCategory).map(cat => (
                    <FilterButton key={cat} value={cat} state={filterCategory} setState={setFilterCategory}>{cat}</FilterButton>
                ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
                <span className="font-semibold mr-2">Status:</span>
                <FilterButton value="All" state={filterStatus} setState={setFilterStatus}>All</FilterButton>
                {Object.values(IssueStatus).map(stat => (
                    <FilterButton key={stat} value={stat} state={filterStatus} setState={setFilterStatus}>{stat}</FilterButton>
                ))}
            </div>
        </div>
        <div className="flex justify-center items-center pt-4 border-t border-gray-700">
            <span className="font-semibold mr-4">View:</span>
            <div className="flex items-center bg-gray-900/50 p-1 rounded-full">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-cyan-500' : 'hover:bg-gray-700'}`} aria-label="Grid View">
                    <Squares2x2Icon className="w-5 h-5"/>
                </button>
                <button onClick={() => setViewMode('map')} className={`p-2 rounded-full transition-colors ${viewMode === 'map' ? 'bg-cyan-500' : 'hover:bg-gray-700'}`} aria-label="Map View">
                    <MapIcon className="w-5 h-5"/>
                </button>
            </div>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <MotionDiv
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            {viewMode === 'grid' ? (
                <MotionDiv layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                    {displayedIssues.map(issue => (
                        <IssueCard key={issue.id} issue={issue} />
                    ))}
                    </AnimatePresence>
                </MotionDiv>
            ) : (
                <MapView issues={displayedIssues} />
            )}
        </MotionDiv>
      </AnimatePresence>

      {displayedIssues.length === 0 && (
        <div className="text-center py-16">
            <p className="text-xl text-gray-500">No issues found matching your filters.</p>
        </div>
      )}
    </MotionDiv>
  );
};

export default IssuesFeed;