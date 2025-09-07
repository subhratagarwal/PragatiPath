// import { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { Filter, Search, MapPin, Clock, User, ThumbsUp, MessageCircle } from 'lucide-react'
// import { issueAPI } from '../services/api'
// import toast from 'react-hot-toast'

// const IssuesFeed = () => {
//   const [issues, setIssues] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [filters, setFilters] = useState({
//     category: '',
//     status: '',
//     priority: '',
//     search: ''
//   })

//   const categories = [
//     'pothole', 'streetlight', 'garbage', 'water', 'sewage', 'road', 'parks', 'other'
//   ]

//   const statuses = [
//     'reported', 'acknowledged', 'in_progress', 'resolved', 'rejected'
//   ]

//   const priorities = [
//     'low', 'medium', 'high', 'critical'
//   ]

//   useEffect(() => {
//     fetchIssues()
//   }, [filters])

//   const fetchIssues = async () => {
//     try {
//       setLoading(true)
//       const response = await issueAPI.getAll(filters)
//       setIssues(response.data.data)
//     } catch (error) {
//       toast.error('Failed to fetch issues')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleUpvote = async (issueId) => {
//     try {
//       await issueAPI.upvote(issueId)
//       // Update local state
//       setIssues(prev => prev.map(issue => 
//         issue._id === issueId 
//           ? { ...issue, upvoteCount: issue.upvoteCount + 1 }
//           : issue
//       ))
//       toast.success('Upvoted!')
//     } catch (error) {
//       toast.error('Failed to upvote')
//     }
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'resolved': return 'bg-green-100 text-green-800'
//       case 'in_progress': return 'bg-blue-100 text-blue-800'
//       case 'acknowledged': return 'bg-yellow-100 text-yellow-800'
//       case 'rejected': return 'bg-red-100 text-red-800'
//       default: return 'bg-gray-100 text-gray-800'
//     }
//   }

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'critical': return 'bg-red-100 text-red-800'
//       case 'high': return 'bg-orange-100 text-orange-800'
//       case 'medium': return 'bg-yellow-100 text-yellow-800'
//       default: return 'bg-green-100 text-green-800'
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           <h1 className="text-3xl font-bold text-gray-900 mb-8">Community Issues</h1>

//           {/* Filters */}
//           <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex-1">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                   <input
//                     type="text"
//                     placeholder="Search issues..."
//                     value={filters.search}
//                     onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
//                     className="pl-10 input-field"
//                   />
//                 </div>
//               </div>
              
//               <select
//                 value={filters.category}
//                 onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
//                 className="input-field"
//               >
//                 <option value="">All Categories</option>
//                 {categories.map(cat => (
//                   <option key={cat} value={cat}>
//                     {cat.charAt(0).toUpperCase() + cat.slice(1)}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 value={filters.status}
//                 onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
//                 className="input-field"
//               >
//                 <option value="">All Statuses</option>
//                 {statuses.map(status => (
//                   <option key={status} value={status}>
//                     {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 value={filters.priority}
//                 onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
//                 className="input-field"
//               >
//                 <option value="">All Priorities</option>
//                 {priorities.map(priority => (
//                   <option key={priority} value={priority}>
//                     {priority.charAt(0).toUpperCase() + priority.slice(1)}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Issues Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {issues.map((issue, index) => (
//               <motion.div
//                 key={issue._id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4, delay: index * 0.1 }}
//                 className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
//               >
//                 {issue.images && issue.images.length > 0 && (
//                   <img
//                     src={issue.images[0].url}
//                     alt={issue.title}
//                     className="w-full h-48 object-cover"
//                   />
//                 )}
                
//                 <div className="p-6">
//                   <div className="flex items-start justify-between mb-3">
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
//                       {issue.status.replace('_', ' ')}
//                     </span>
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
//                       {issue.priority}
//                     </span>
//                   </div>

//                   <h3 className="text-xl font-semibold text-gray-900 mb-2">{issue.title}</h3>
//                   <p className="text-gray-600 mb-4 line-clamp-3">{issue.description}</p>

//                   <div className="flex items-center text-sm text-gray-500 mb-4">
//                     <MapPin className="h-4 w-4 mr-1" />
//                     <span className="truncate">{issue.location?.address || 'Location not specified'}</span>
//                   </div>

//                   <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
//                     <div className="flex items-center">
//                       <Clock className="h-4 w-4 mr-1" />
//                       <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
//                     </div>
//                     <div className="flex items-center">
//                       <User className="h-4 w-4 mr-1" />
//                       <span>{issue.reportedBy?.name || 'Anonymous'}</span>
//                     </div>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <button
//                       onClick={() => handleUpvote(issue._id)}
//                       className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
//                     >
//                       <ThumbsUp className="h-5 w-5 mr-1" />
//                       <span>{issue.upvoteCount}</span>
//                     </button>
                    
//                     <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
//                       <MessageCircle className="h-5 w-5 mr-1" />
//                       <span>{issue.comments?.length || 0}</span>
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>

//           {issues.length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-gray-400 text-6xl mb-4">🔍</div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
//               <p className="text-gray-600">Try adjusting your filters or search terms</p>
//             </div>
//           )}
//         </motion.div>
//       </div>
//     </div>
//   )
// }

// export default IssuesFeed

// client/src/pages/IssuesFeed.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import { formatDistanceToNow } from "date-fns";

export default function IssuesFeed() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Issues — CivicConnect";
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const res = await api.get("/issues?limit=50");
      setIssues(res.data.issues || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const upvote = async (id) => {
    try {
      await api.post(`/issues/${id}/upvote`);
      setIssues((prev) => prev.map((p) => (p._id === id ? { ...p, upvotes: (p.upvotes || 0) + 1 } : p)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Reported Issues</h1>

        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : issues.length === 0 ? (
          <p className="text-gray-500">No issues reported yet.</p>
        ) : (
          <div className="grid gap-4">
            {issues.map((issue) => (
              <motion.article
                key={issue._id}
                className="p-4 bg-white rounded-lg shadow flex gap-4 items-start"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {issue.imageUrl ? <img src={issue.imageUrl} alt={issue.title} className="w-full h-full object-cover" /> : <div className="p-3 text-gray-400">No image</div>}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold">{issue.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{issue.description}</p>

                  <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-3">
                      <span>{issue.type}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button onClick={() => upvote(issue._id)} className="inline-flex items-center gap-2 px-3 py-1 rounded bg-indigo-50">
                        ▲ Upvote <span className="text-sm text-indigo-700">{issue.upvotes || 0}</span>
                      </button>
                      <a href={`/issues/${issue._id}`} className="text-indigo-600">Track</a>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
