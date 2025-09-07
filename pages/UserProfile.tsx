import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { mockUsers, mockIssues } from '../constants';
import ReportedIssueRow from '../components/ReportedIssueRow';
import { StarIcon } from '../components/icons';
import { IssueStatus } from '../types';

const UserProfile = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    
    // The user object is guaranteed to exist because this is a protected route.
    if (!user) {
        return null;
    }

    const [name, setName] = useState(user.name);
    const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);

    const MotionDiv = motion.div;
    const MotionImg = motion.img;
    const MotionForm = motion.form;

    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser({ ...user, name, avatarUrl });
        setIsEditing(false);
    };

    const AccountDetailsEditor = () => (
         <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Account Details</h2>
                <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors px-4 py-2 rounded-full hover:bg-cyan-500/10"
                >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>
            {isEditing ? (
                <MotionForm 
                    onSubmit={handleProfileUpdate} 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full rounded-md border-0 bg-white/5 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-cyan-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-300 mb-1">Avatar URL</label>
                        <input
                            type="text"
                            id="avatarUrl"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            className="block w-full rounded-md border-0 bg-white/5 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-cyan-500"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-full transition-colors">Save Changes</button>
                    </div>
                </MotionForm>
            ) : (
                <div className="space-y-2 text-gray-300">
                    <p><strong>Full Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
            )}
        </div>
    );

    const AdminProfile = () => {
        const keyIssues = mockIssues
            .filter(issue => 
                (issue.priority === 'Critical' || issue.priority === 'High') && 
                issue.status !== IssueStatus.Resolved &&
                issue.status !== IssueStatus.Rejected
            )
            .sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime());

        return (
            <>
                <header className="flex flex-col sm:flex-row items-center gap-6 p-8 bg-gray-800/50 rounded-lg border border-gray-700 mb-8">
                    <MotionImg 
                        src={user.avatarUrl} 
                        alt={user.name}
                        className="w-32 h-32 rounded-full border-4 border-cyan-400 shadow-lg" 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                    />
                    <div className="text-center sm:text-left">
                        <h1 className="text-4xl font-bold text-white">{user.name}</h1>
                        <p className="text-lg font-semibold text-yellow-400 mt-2">Administrator Account</p>
                    </div>
                </header>
                
                <AccountDetailsEditor />

                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">High-Priority Active Issues ({keyIssues.length})</h2>
                    <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
                        <div className="divide-y divide-gray-700">
                           {keyIssues.length > 0 ? (
                                keyIssues.map(issue => <ReportedIssueRow key={issue.id} issue={issue} />)
                            ) : (
                                <div className="p-8 text-center text-gray-400">
                                    No high-priority issues require attention.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </>
        )
    };

    const CitizenProfile = () => {
        const fullUserDetails = mockUsers.find(u => u.id === user.id);
        const reportedIssues = fullUserDetails 
            ? mockIssues.filter(issue => issue.reportedBy === fullUserDetails.name).sort((a,b) => b.reportedAt.getTime() - a.reportedAt.getTime())
            : [];
        const { points, rank, badges } = fullUserDetails || { points: 0, rank: 'N/A', badges: []};

        return (
            <>
                <header className="flex flex-col sm:flex-row items-center gap-6 p-8 bg-gray-800/50 rounded-lg border border-gray-700 mb-8">
                    <MotionImg 
                        src={user.avatarUrl} 
                        alt={user.name}
                        className="w-32 h-32 rounded-full border-4 border-cyan-400 shadow-lg" 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                    />
                    <div className="text-center sm:text-left">
                        <h1 className="text-4xl font-bold text-white">{user.name}</h1>
                        <div className="flex items-center justify-center sm:justify-start gap-4 mt-2 text-gray-300">
                            <span className="font-semibold text-cyan-400 text-lg">{points.toLocaleString()} Points</span>
                            <span className="text-gray-500">|</span>
                            <span>Community Rank: <span className="font-bold text-white">#{rank}</span></span>
                        </div>
                    </div>
                </header>

                <AccountDetailsEditor />

                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">My Badges</h2>
                    {badges.length > 0 ? (
                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {badges.map((badge, index) => (
                                <MotionDiv 
                                    key={badge.id}
                                    className="bg-gray-800 p-4 rounded-lg text-center flex flex-col items-center border border-gray-700"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                >
                                    <badge.icon className="w-12 h-12 text-yellow-400 mb-2" />
                                    <h3 className="font-semibold text-white">{badge.name}</h3>
                                    <p className="text-xs text-gray-400">{badge.description}</p>
                                </MotionDiv>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-gray-800/50 rounded-lg border border-dashed border-gray-700">
                            <p className="text-gray-400">No badges earned yet. Keep reporting to unlock them!</p>
                        </div>
                    )}
                </div>

                <div>
                     <h2 className="text-2xl font-bold text-white mb-4">My Reported Issues ({reportedIssues.length})</h2>
                     <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
                        <div className="divide-y divide-gray-700">
                            {reportedIssues.length > 0 ? (
                                reportedIssues.map(issue => <ReportedIssueRow key={issue.id} issue={issue} />)
                            ) : (
                                <div className="p-8 text-center text-gray-400">
                                    You haven't reported any issues yet.
                                </div>
                            )}
                        </div>
                     </div>
                </div>
            </>
        );
    };

    return (
        <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto"
        >
            {user.role === 'admin' ? <AdminProfile /> : <CitizenProfile />}
        </MotionDiv>
    );
};

export default UserProfile;