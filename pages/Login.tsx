import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon } from '../components/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser) {
        if (loggedInUser.role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/profile');
        }
      } else {
        setError('Invalid email or password.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  // FIX: Assign motion component to a capitalized variable to resolve TypeScript type inference issue.
  const MotionDiv = motion.div;

  return (
    <MotionDiv
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="flex items-center justify-center py-12"
    >
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800/50 rounded-xl shadow-lg border border-gray-700">
        <div className="text-center">
            <div className="flex justify-center items-center mb-4">
                <MapPinIcon className="h-10 w-10 text-cyan-400" />
                <span className="text-3xl font-bold text-white ml-2">PragatiPath</span>
            </div>
          <h2 className="text-2xl font-bold text-cyan-400">Login to Your Account</h2>
          <p className="mt-2 text-gray-400">Please sign in to continue.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-400 text-center bg-red-500/10 p-2 rounded-md">{error}</p>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full appearance-none rounded-t-md border-0 bg-white/5 py-3 px-3 text-white ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full appearance-none rounded-b-md border-0 bg-white/5 py-3 px-3 text-white ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6 p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-sm text-gray-400">
            <p className="font-semibold text-gray-300 mb-2">For Demo Purposes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Admin Login:</strong> admin@test.com / password</li>
              <li><strong>Citizen Login:</strong> bob@test.com / password</li>
            </ul>
          </div>

          <div className="text-center text-sm pt-4">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-cyan-400 hover:text-cyan-500">
                Register here
              </Link>
            </p>
          </div>
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-cyan-500 py-3 px-4 text-sm font-semibold text-white hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </MotionDiv>
  );
};

export default Login;