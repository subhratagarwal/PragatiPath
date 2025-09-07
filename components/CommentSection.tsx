import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Comment } from '../types';
import { ChatBubbleLeftIcon } from './icons';
import { mockUsers } from '../constants';

interface CommentSectionProps {
  initialComments: Comment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({ initialComments }) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      const addedComment: Comment = {
        id: `c${Date.now()}`,
        author: randomUser.name,
        avatarUrl: randomUser.avatarUrl,
        text: newComment,
        timestamp: new Date(),
      };
      setComments([addedComment, ...comments]);
      setNewComment('');
    }
  };
  
  const timeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  }

  // FIX: Assign motion component to a capitalized variable to resolve TypeScript type inference issue.
  const MotionDiv = motion.div;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
        <ChatBubbleLeftIcon className="w-6 h-6 mr-2 text-cyan-400" />
        Community Discussion ({comments.length})
      </h3>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex items-start space-x-3">
            <img src={mockUsers[3].avatarUrl} alt="User avatar" className="w-10 h-10 rounded-full"/>
            <div className="flex-1">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add to the discussion..."
                    className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-white"
                    rows={3}
                />
                <button type="submit" className="mt-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-full transition-colors">
                    Post Comment
                </button>
            </div>
        </div>
      </form>

      <div className="space-y-4">
        <AnimatePresence>
            {comments.map((comment) => (
                <MotionDiv 
                    key={comment.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start space-x-3 bg-gray-800/50 p-4 rounded-lg"
                >
                    <img src={comment.avatarUrl} alt={comment.author} className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                        <div className="flex items-baseline space-x-2">
                            <p className="font-semibold text-white">{comment.author}</p>
                            <p className="text-xs text-gray-400">{timeSince(comment.timestamp)}</p>
                        </div>
                        <p className="text-gray-300">{comment.text}</p>
                    </div>
                </MotionDiv>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CommentSection;