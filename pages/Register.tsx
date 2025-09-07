import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon } from '../components/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }

    try {
      const success = await register(name, email, password);
      if (success) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError('An account with this email already exists.');
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
          <h2 className="text-2xl font-bold text-cyan-400">Create an Account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-400 text-center bg-red-500/10 p-2 rounded-md">{error}</p>}
          {success && <p className="text-green-400 text-center bg-green-500/10 p-2 rounded-md">{success}</p>}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="relative block w-full appearance-none rounded-md border-0 bg-white/5 py-3 px-3 text-white ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:text-sm"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
             <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full appearance-none rounded-md border-0 bg-white/5 py-3 px-3 text-white ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:text-sm"
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
                required
                className="relative block w-full appearance-none rounded-md border-0 bg-white/5 py-3 px-3 text-white ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="text-center text-sm">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-cyan-400 hover:text-cyan-500">
                Sign in
              </Link>
            </p>
          </div>
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-cyan-500 py-3 px-4 text-sm font-semibold text-white hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </MotionDiv>
  );
};

export default Register;