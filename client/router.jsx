import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import ReportIssue from './pages/ReportIssue'
import IssuesFeed from './pages/IssuesFeed'
import IssueDetails from './pages/IssueDetails'
import AboutImpact from './pages/AboutImpact'
import Leaderboard from './pages/Leaderboard'
import HelpFAQ from './pages/HelpFAQ'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import LoadingSpinner from './components/LoadingSpinner'
import { authAPI } from './services/api'

// Loader function to check authentication
const protectedLoader = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      return { user: null }
    }
    
    const response = await authAPI.getCurrentUser()
    return { user: response.data }
  } catch (error) {
    localStorage.removeItem('token')
    return { user: null }
  }
}

// Admin route loader
const adminLoader = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      return { user: null, isAdmin: false }
    }
    
    const response = await authAPI.getCurrentUser()
    const isAdmin = response.data.role === 'admin'
    return { user: response.data, isAdmin }
  } catch (error) {
    localStorage.removeItem('token')
    return { user: null, isAdmin: false }
  }
}

// Public routes that don't require authentication
const publicRoutes = [
  {
    path: '/',
    element: <Home />,
    id: 'home',
    loader: async () => {
      // Preload some initial data for home page
      try {
        const [issuesResponse, leaderboardResponse] = await Promise.allSettled([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/issues?limit=6`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/leaderboard?limit=5`)
        ])
        
        return {
          featuredIssues: issuesResponse.status === 'fulfilled' ? await issuesResponse.value.json() : null,
          topContributors: leaderboardResponse.status === 'fulfilled' ? await leaderboardResponse.value.json() : null
        }
      } catch (error) {
        return { featuredIssues: null, topContributors: null }
      }
    }
  },
  {
    path: '/issues',
    element: <IssuesFeed />,
    id: 'issues',
    loader: async ({ request }) => {
      const url = new URL(request.url)
      const searchParams = Object.fromEntries(url.searchParams.entries())
      
      try {
        const queryString = new URLSearchParams(searchParams).toString()
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/issues?${queryString}`)
        return await response.json()
      } catch (error) {
        return { data: [], pagination: { total: 0, pages: 0 } }
      }
    }
  },
  {
    path: '/issues/:id',
    element: <IssueDetails />,
    id: 'issue-details',
    loader: async ({ params }) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/issues/${params.id}`)
        if (!response.ok) {
          throw new Error('Issue not found')
        }
        return await response.json()
      } catch (error) {
        throw new Response('Issue not found', { status: 404 })
      }
    }
  },
  {
    path: '/impact',
    element: <AboutImpact />,
    id: 'impact',
    loader: async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/dashboard/stats`)
        return await response.json()
      } catch (error) {
        return { totalReports: 0, resolvedIssues: 0, activeUsers: 0 }
      }
    }
  },
  {
    path: '/leaderboard',
    element: <Leaderboard />,
    id: 'leaderboard',
    loader: async ({ request }) => {
      const url = new URL(request.url)
      const timeframe = url.searchParams.get('timeframe') || 'monthly'
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/leaderboard?timeframe=${timeframe}`)
        return await response.json()
      } catch (error) {
        return { data: [] }
      }
    }
  },
  {
    path: '/help',
    element: <HelpFAQ />,
    id: 'help'
  },
  {
    path: '/login',
    element: <Login />,
    id: 'login'
  },
  {
    path: '/register',
    element: <Register />,
    id: 'register'
  }
]

// Protected routes that require authentication
const protectedRoutes = [
  {
    path: '/report',
    element: <ReportIssue />,
    id: 'report',
    loader: protectedLoader
  },
  {
    path: '/profile',
    element: <Profile />,
    id: 'profile',
    loader: protectedLoader
  },
  {
    path: '/settings',
    element: <Settings />,
    id: 'settings',
    loader: protectedLoader
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    id: 'dashboard',
    loader: protectedLoader
  }
]

// Admin-only routes
const adminRoutes = [
  {
    path: '/admin',
    element: <AdminDashboard />,
    id: 'admin-dashboard',
    loader: adminLoader
  },
  {
    path: '/admin/issues',
    element: <AdminDashboard tab="issues" />,
    id: 'admin-issues',
    loader: adminLoader
  },
  {
    path: '/admin/users',
    element: <AdminDashboard tab="users" />,
    id: 'admin-users',
    loader: adminLoader
  },
  {
    path: '/admin/analytics',
    element: <AdminDashboard tab="analytics" />,
    id: 'admin-analytics',
    loader: adminLoader
  }
]

// Error element for route loading errors
const RouteError = ({ error }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
        <p className="text-gray-600 mb-4">{error?.message || 'An unexpected error occurred'}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

// Loading component for route transitions
const RouteLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="large" />
    </div>
  )
}

// Create the router with all routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      // Public routes
      ...publicRoutes,
      
      // Protected routes with authentication check
      ...protectedRoutes.map(route => ({
        ...route,
        element: (
          <ProtectedRoute>
            {route.element}
          </ProtectedRoute>
        ),
        errorElement: <RouteError />
      })),
      
      // Admin routes with admin check
      ...adminRoutes.map(route => ({
        ...route,
        element: (
          <ProtectedRoute adminOnly={true}>
            {route.element}
          </ProtectedRoute>
        ),
        errorElement: <RouteError />
      })),
      
      // Redirects
      {
        path: '/home',
        element: <Navigate to="/" replace />
      },
      {
        path: '/signin',
        element: <Navigate to="/login" replace />
      },
      {
        path: '/signup',
        element: <Navigate to="/register" replace />
      },
      {
        path: '/faq',
        element: <Navigate to="/help" replace />
      },
      
      // 404 catch-all
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
])

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [auth, setAuth] = useState({ user: null, loading: true })
  const location = useLocation()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setAuth({ user: null, loading: false })
          return
        }

        const response = await authAPI.getCurrentUser()
        setAuth({ user: response.data, loading: false })
      } catch (error) {
        localStorage.removeItem('token')
        setAuth({ user: null, loading: false })
      }
    }

    checkAuth()
  }, [])

  if (auth.loading) {
    return <RouteLoader />
  }

  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (adminOnly && auth.user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

export default router