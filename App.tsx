import React from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ReportIssue from './pages/ReportIssue';
import IssuesFeed from './pages/IssuesFeed';
import Leaderboard from './pages/Leaderboard';
import Dashboard from './pages/Dashboard';
import IssueDetail from './pages/IssueDetail';
import AboutImpact from './pages/AboutImpact';
import HelpFAQ from './pages/HelpFAQ';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import { Issue } from './types';
import { mockIssues } from './constants';
import { AuthProvider, useAuth } from './context/AuthContext';
import ChatAssistant from './components/ChatAssistant';

// Renamed internal App component to avoid conflict with default export
const AppContent = () => {
  const [issues, setIssues] = React.useState<Issue[]>(mockIssues);
  const { user } = useAuth(); // Use auth context

  const addIssue = (newIssue: Issue) => {
    setIssues(prevIssues => [newIssue, ...prevIssues]);
  };
  
  const updateIssue = (updatedIssue: Issue) => {
    setIssues(prevIssues => 
      prevIssues.map(issue => 
        issue.id === updatedIssue.id ? updatedIssue : issue
      )
    );
  };

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    if (!user || user.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<ReportIssue onIssueSubmit={addIssue} />} />
          <Route path="/issues" element={<IssuesFeed issues={issues} />} />
          <Route path="/issues/:issueId" element={<IssueDetail issues={issues} isAdmin={user?.role === 'admin'} updateIssue={updateIssue} />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/dashboard" element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="/about" element={<AboutImpact />} />
          <Route path="/faq" element={<HelpFAQ />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <ChatAssistant />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  );
}

export default App;