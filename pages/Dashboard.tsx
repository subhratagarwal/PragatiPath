import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import StatsCard from '../components/StatsCard';
import { ShieldCheckIcon, FireIcon, StarIcon, ExclamationTriangleIcon } from '../components/icons';
import { mockIssues } from '../constants';
import { IssueStatus, Department, IssueCategory } from '../types';

const Dashboard = () => {
  // Data for "Reporting Trends" Line Chart
  const reportingTrends = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const counts: { [key: number]: number } = {};
    
    mockIssues.forEach(issue => {
        const reportDate = new Date(issue.reportedAt);
        reportDate.setHours(0, 0, 0, 0);
        const daysAgo = Math.floor((today.getTime() - reportDate.getTime()) / (1000 * 3600 * 24));
        if (daysAgo < 15) {
            counts[daysAgo] = (counts[daysAgo] || 0) + 1;
        }
    });

    return Array.from({ length: 15 }, (_, i) => {
        const daysAgo = 14 - i;
        const date = new Date(today);
        date.setDate(today.getDate() - daysAgo);
        return {
            name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            issues: counts[daysAgo] || 0
        };
    });
  }, []);
  
  // Data for "Average Resolution Time" Bar Chart
  const avgResolutionTime = useMemo(() => {
    const resolutionTimes: { [key: string]: { totalDays: number, count: number } } = {};
    mockIssues.forEach(issue => {
      if (issue.status === IssueStatus.Resolved && issue.assignedDepartment) {
        const reportedEntry = issue.timeline.find(t => t.status === IssueStatus.Reported);
        const resolvedEntry = issue.timeline.find(t => t.status === IssueStatus.Resolved);
        if (reportedEntry && resolvedEntry) {
          const timeDiff = resolvedEntry.date.getTime() - reportedEntry.date.getTime();
          const daysDiff = timeDiff / (1000 * 3600 * 24);
          if (!resolutionTimes[issue.assignedDepartment]) {
            resolutionTimes[issue.assignedDepartment] = { totalDays: 0, count: 0 };
          }
          resolutionTimes[issue.assignedDepartment].totalDays += daysDiff;
          resolutionTimes[issue.assignedDepartment].count++;
        }
      }
    });
    return Object.entries(resolutionTimes).map(([name, data]) => ({
      name,
      'Avg Days': parseFloat((data.totalDays / data.count).toFixed(1)),
    }));
  }, []);

  // Data for "Issues by Department" Stacked Bar Chart
  const categoryChartColors: Record<IssueCategory, string> = {
      [IssueCategory.Pothole]: '#ef4444',
      [IssueCategory.Streetlight]: '#f59e0b',
      [IssueCategory.Waste]: '#10b981',
      [IssueCategory.Graffiti]: '#8b5cf6',
      [IssueCategory.PublicTransport]: '#3b82f6',
      [IssueCategory.Other]: '#6b7280',
  };
    
  const issuesByDept = useMemo(() => {
    const data: { [key: string]: { name: string; [key: string]: any } } = {};
    const departments = Object.values(Department);
    const categories = Object.values(IssueCategory);

    departments.forEach(dept => {
        data[dept] = { name: dept };
        categories.forEach(cat => data[dept][cat] = 0);
    });

    mockIssues.forEach(issue => {
      if (issue.assignedDepartment) {
        const dept = issue.assignedDepartment;
        if(data[dept]){
            data[dept][issue.category]++;
        }
      }
    });
    return Object.values(data);
  }, []);


  const MotionDiv = motion.div;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-gray-900 border border-gray-700 rounded-md shadow-lg">
          <p className="font-bold text-cyan-400">{label}</p>
          {payload.map((pld: any, index: number) => (
              <p key={index} style={{ color: pld.color }}>
                  {`${pld.name}: ${pld.value}`}
              </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h1 className="text-4xl font-bold text-center">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/issues">
            <StatsCard icon={ShieldCheckIcon} title="Total Issues" value={mockIssues.length.toString()} />
        </Link>
        <Link to="/issues?filter=open">
            <StatsCard icon={FireIcon} title="Open Issues" value={mockIssues.filter(i => i.status !== IssueStatus.Resolved && i.status !== IssueStatus.Rejected).length.toString()} />
        </Link>
        <Link to="/issues?filter=resolved_today">
            <StatsCard icon={StarIcon} title="Resolved Issues" value={mockIssues.filter(i => i.status === IssueStatus.Resolved).length.toString()} color="green" />
        </Link>
        <Link to="/issues?filter=high_priority">
            <StatsCard 
              icon={ExclamationTriangleIcon} 
              title="High Priority" 
              value={mockIssues.filter(i => i.priority === 'High' || i.priority === 'Critical').length.toString()} 
              color="red"
            />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reporting Trends Chart */}
          <div className="p-6 bg-gray-800/50 rounded-lg shadow-lg border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4 text-white">Issue Reporting Trends (Last 15 Days)</h2>
              <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportingTrends} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{fontSize: "14px"}}/>
                      <Line type="monotone" dataKey="issues" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                  </LineChart>
              </ResponsiveContainer>
          </div>
          
          <div className="p-6 bg-gray-800/50 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-white">Average Resolution Time</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={avgResolutionTime} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" horizontal={false} />
                    <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                    <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={12} width={100} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{fontSize: "14px"}} />
                    <Bar dataKey="Avg Days" fill="#f59e0b" barSize={20} />
                </BarChart>
            </ResponsiveContainer>
            </div>
      </div>
      
      {/* Lower Charts */}
      <div className="grid grid-cols-1">
         <div className="p-6 bg-gray-800/50 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-white">Issue Categories by Department</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={issuesByDept} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} angle={-25} textAnchor="end" height={50} />
              <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{fontSize: "14px"}}/>
              {Object.entries(categoryChartColors).map(([category, color]) => (
                <Bar key={category} dataKey={category} stackId="a" fill={color} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </MotionDiv>
  );
};

export default Dashboard;
