import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Issue, IssueStatus } from '../types';
import { 
    ChevronUpIcon, 
    MapPinIcon, 
    CalendarDaysIcon, 
    BuildingOffice2Icon,
    ShareIcon,
    LinkIcon,
    EnvelopeIcon,
    SocialIcon,
    socialIconPaths
} from '../components/icons';
import CommentSection from '../components/CommentSection';
import LiveMap from '../components/LiveMap';
import AdminActions from '../components/AdminActions';

interface IssueDetailProps {
  issues: Issue[];
  isAdmin: boolean;
  updateIssue: (issue: Issue) => void;
}

const statusColors: Record<IssueStatus, string> = {
  [IssueStatus.Reported]: 'bg-blue-500/20 text-blue-300 border-blue-500',
  [IssueStatus.Acknowledged]: 'bg-yellow-500/20 text-yellow-300 border-yellow-500',
  [IssueStatus.InProgress]: 'bg-orange-500/20 text-orange-300 border-orange-500',
  [IssueStatus.Resolved]: 'bg-green-500/20 text-green-300 border-green-500',
  [IssueStatus.Rejected]: 'bg-red-500/20 text-red-300 border-red-500',
};

const priorityColors: Record<Issue['priority'], string> = {
    'Low': 'bg-gray-500/20 text-gray-300',
    'Medium': 'bg-yellow-500/20 text-yellow-300',
    'High': 'bg-orange-500/20 text-orange-300',
    'Critical': 'bg-red-500/20 text-red-300',
}

const IssueDetail: React.FC<IssueDetailProps> = ({ issues, isAdmin, updateIssue }) => {
  const { issueId } = useParams<{ issueId: string }>();
  
  const issue = useMemo(() => issues.find(i => i.id === issueId), [issues, issueId]);
  
  const [upvotes, setUpvotes] = useState(issue?.upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isSharePopoverOpen, setIsSharePopoverOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Copy Link');

  // FIX: Assign motion component to a capitalized variable to resolve TypeScript type inference issue.
  const MotionDiv = motion.div;

  const handleUpvote = () => {
    if (!hasUpvoted) {
        setUpvotes(upvotes + 1);
        setHasUpvoted(true);
    } else {
        setUpvotes(upvotes - 1);
        setHasUpvoted(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus('Copy Link'), 2000);
    }).catch(err => {
        console.error('Failed to copy link: ', err);
        setCopyStatus('Failed to copy');
    });
  };

  if (!issue) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-red-400">Issue Not Found</h1>
        <p className="text-gray-400 mt-4">The issue you are looking for does not exist or may have been removed.</p>
        <Link to="/issues" className="mt-6 inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-full">
            Back to Issues Feed
        </Link>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const shareText = `Check out this civic issue: "${issue.title}"`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const emailShareUrl = `mailto:?subject=${encodeURIComponent(issue.title)}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto"
    >
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{issue.title}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-gray-400">
            <div className="flex items-center"><MapPinIcon className="w-4 h-4 mr-2"/> {issue.address}</div>
            <div className="flex items-center"><CalendarDaysIcon className="w-4 h-4 mr-2"/> Reported on {issue.reportedAt.toLocaleDateString()}</div>
            {issue.assignedDepartment && <div className="flex items-center font-semibold text-yellow-400"><BuildingOffice2Icon className="w-4 h-4 mr-2"/> Assigned to {issue.assignedDepartment}</div>}
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
            <MotionDiv whileHover={{ scale: 1.02 }} className="rounded-lg overflow-hidden shadow-2xl">
                 <img src={issue.imageUrl} alt={issue.title} className="w-full h-auto object-cover" />
            </MotionDiv>
            
            <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-3">Description</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{issue.description}</p>
            </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-6">
            <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${statusColors[issue.status]}`}>{issue.status}</span>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${priorityColors[issue.priority]}`}>{issue.priority} Priority</span>
                </div>

                <div className="flex items-stretch gap-2">
                    <button 
                        onClick={handleUpvote}
                        className={`flex-grow flex items-center justify-center space-x-2 py-3 px-4 rounded-full font-bold text-lg transition-colors ${hasUpvoted ? 'bg-cyan-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`}
                    >
                        <ChevronUpIcon className="w-6 h-6"/>
                        <span>Upvote ({upvotes})</span>
                    </button>
                    <div className="relative">
                        <button 
                            onClick={() => setIsSharePopoverOpen(true)}
                            aria-label="Share issue"
                            className="h-full px-4 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
                        >
                            <ShareIcon className="w-6 h-6"/>
                        </button>
                         <AnimatePresence>
                            {isSharePopoverOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsSharePopoverOpen(false)}></div>
                                    <MotionDiv
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 bottom-full mb-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-2 z-20"
                                    >
                                       <h3 className="px-2 py-1 text-sm font-semibold text-white">Share Issue</h3>
                                       <div className="mt-1 space-y-1">
                                            <button onClick={handleCopyLink} className="w-full flex items-center space-x-2 text-left px-2 py-2 text-sm text-gray-200 rounded-md hover:bg-gray-700 transition-colors">
                                                <LinkIcon className="w-4 h-4"/> <span>{copyStatus}</span>
                                            </button>
                                            <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" className="w-full flex items-center space-x-2 text-left px-2 py-2 text-sm text-gray-200 rounded-md hover:bg-gray-700 transition-colors">
                                                <SocialIcon path={socialIconPaths.twitter} className="w-4 h-4" /> <span>Share on Twitter</span>
                                            </a>
                                            <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer" className="w-full flex items-center space-x-2 text-left px-2 py-2 text-sm text-gray-200 rounded-md hover:bg-gray-700 transition-colors">
                                                <SocialIcon path={socialIconPaths.facebook} className="w-4 h-4" /> <span>Share on Facebook</span>
                                            </a>
                                            <a href={emailShareUrl} className="w-full flex items-center space-x-2 text-left px-2 py-2 text-sm text-gray-200 rounded-md hover:bg-gray-700 transition-colors">
                                                <EnvelopeIcon className="w-4 h-4" /> <span>Share via Email</span>
                                            </a>
                                       </div>
                                    </MotionDiv>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {isAdmin && <AdminActions issue={issue} updateIssue={updateIssue} />}
            
            <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Location</h3>
                <LiveMap address={issue.address} category={issue.category} />
            </div>

            <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Status History</h3>
                <div className="relative border-l-2 border-gray-600 pl-6 space-y-6">
                    {issue.timeline.map((item, index) => (
                        <div key={index} className="relative">
                            <div className={`absolute -left-7 w-4 h-4 rounded-full ${statusColors[item.status].replace('bg-', 'border-').replace('/20', '')} bg-gray-800 border-2`}></div>
                            <p className={`font-semibold ${statusColors[item.status].replace('bg-', 'text-').replace('/20', '')}`}>{item.status}</p>
                            <p className="text-sm text-gray-400">{item.date.toLocaleString()}</p>
                            {item.notes && <p className="text-sm text-gray-300 mt-1 italic">"{item.notes}"</p>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
      
      <div className="mt-8 lg:col-span-3">
        <CommentSection initialComments={issue.comments || []} />
      </div>

    </MotionDiv>
  );
};

export default IssueDetail;