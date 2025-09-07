import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { GamificationProvider } from './context/GamificationContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ReportIssue from './pages/ReportIssue'
import IssuesFeed from './pages/IssuesFeed'
import IssueDetails from './pages/IssueDetails'
import AboutImpact from './pages/AboutImpact'
import Leaderboard from './pages/Leaderboard'
import HelpFAQ from './pages/HelpFAQ'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <GamificationProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/issues" element={<IssuesFeed />} />
              <Route path="/issues/:id" element={<IssueDetails />} />
              <Route path="/impact" element={<AboutImpact />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/help" element={<HelpFAQ />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/report" element={
                <ProtectedRoute>
                  <ReportIssue />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              {/* Admin Only Routes */}
              <Route path="/admin/*" element={
                <ProtectedRoute adminOnly={true}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </GamificationProvider>
    </AuthProvider>
  )
}

export default App