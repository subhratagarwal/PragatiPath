import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon, MapPinIcon } from './icons';
import { useAuth } from '../context/AuthContext';

const NavLinks = ({ isMobile, closeMenu }: { isMobile: boolean; closeMenu?: () => void; }) => {
  const { user } = useAuth();
  const navClass = isMobile ? "flex flex-col items-center space-y-4 pt-8" : "hidden md:flex items-center space-x-8";
  const linkClass = "text-lg text-gray-300 hover:text-cyan-400 transition-colors duration-300";

  return (
    <nav className={navClass}>
      <NavLink to="/" className={({ isActive }) => `${linkClass} ${isActive ? 'text-cyan-400 font-semibold' : ''}`} onClick={closeMenu}>Home</NavLink>
      <NavLink to="/issues" className={({ isActive }) => `${linkClass} ${isActive ? 'text-cyan-400 font-semibold' : ''}`} onClick={closeMenu}>Issues Feed</NavLink>
      <NavLink to="/leaderboard" className={({ isActive }) => `${linkClass} ${isActive ? 'text-cyan-400 font-semibold' : ''}`} onClick={closeMenu}>Leaderboard</NavLink>
      {user && user.role === 'admin' && (
        <NavLink to="/dashboard" className={({ isActive }) => `${linkClass} ${isActive ? 'text-cyan-400 font-semibold' : ''}`} onClick={closeMenu}>Dashboard</NavLink>
      )}
      <NavLink to="/about" className={({ isActive }) => `${linkClass} ${isActive ? 'text-cyan-400 font-semibold' : ''}`} onClick={closeMenu}>About</NavLink>
      <NavLink to="/faq" className={({ isActive }) => `${linkClass} ${isActive ? 'text-cyan-400 font-semibold' : ''}`} onClick={closeMenu}>FAQ</NavLink>
    </nav>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  
  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  // FIX: Assign motion component to a capitalized variable to resolve TypeScript type inference issue.
  const MotionDiv = motion.div;

  return (
    <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg shadow-lg shadow-cyan-500/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-white">
           <img src="/logo.png" alt="PragatiPath Logo" className="h-12 w-12" />
            <span>PragatiPath</span>
          </Link>

          <NavLinks isMobile={false} />

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
                {user ? (
                    <>
                        <Link to="/profile" className="flex items-center space-x-2 group">
                           <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full border-2 border-transparent group-hover:border-cyan-400 transition-colors" />
                           <span className="text-gray-300 group-hover:text-cyan-400">Welcome, {user.name.split(' ')[0]}</span>
                        </Link>
                        <button onClick={handleLogout} className="text-gray-300 hover:text-cyan-400 font-semibold">Logout</button>
                    </>
                ) : (
                    <Link to="/login" className="text-gray-300 hover:text-cyan-400 font-semibold">
                        Login / Register
                    </Link>
                )}
            </div>
             <Link to="/report" className="hidden sm:inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-105">
              Report Issue
            </Link>
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-gray-300 hover:text-white">
                {isOpen ? <XMarkIcon className="h-8 w-8" /> : <Bars3Icon className="h-8 w-8" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-gray-900 absolute w-full pb-8"
          >
            <NavLinks isMobile={true} closeMenu={closeMenu} />
            <div className="mt-6 flex flex-col items-center space-y-4">
                <Link to="/report" onClick={closeMenu} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-105">
                    Report Issue
                </Link>
                <div className="flex items-center space-x-2 mt-4">
                   {user ? (
                        <>
                            <Link to="/profile" onClick={closeMenu} className="flex items-center space-x-2 group">
                                <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full border-2 border-transparent" />
                                <span className="text-gray-300">Welcome, {user.name.split(' ')[0]}</span>
                            </Link>
                            <button onClick={handleLogout} className="text-gray-300 hover:text-cyan-400 font-semibold">Logout</button>
                        </>
                    ) : (
                        <Link to="/login" onClick={closeMenu} className="text-gray-300 hover:text-cyan-400 font-semibold">
                            Login / Register
                        </Link>
                    )}
                </div>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;