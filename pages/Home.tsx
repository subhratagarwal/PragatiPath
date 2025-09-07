
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import StatsCard from '../components/StatsCard';
import { ShieldCheckIcon, FireIcon, StarIcon } from '../components/icons';

const Home = () => {
  // FIX: Assign motion components to capitalized variables to resolve TypeScript type inference issues.
  const MotionSection = motion.section;
  const MotionH1 = motion.h1;
  const MotionP = motion.p;
  const MotionDiv = motion.div;

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <MotionSection
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center py-20 rounded-lg bg-gradient-to-br from-gray-900 via-gray-800 to-cyan-900/50"
      >
        <MotionH1 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
          className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tight"
        >
          Improve Your Community.
          <br />
          <span className="text-cyan-400">One Report at a Time.</span>
        </MotionH1>
        <MotionP 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, type: 'spring' }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 mb-8"
        >
          See a problem? Snap a photo, describe it, and let our AI-powered system alert the right people. Track progress and earn rewards for making your city better.
        </MotionP>
        <MotionDiv
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link
            to="/report"
            className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xl py-4 px-10 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-110 shadow-lg shadow-cyan-500/30"
          >
            Report an Issue Now
          </Link>
        </MotionDiv>
      </MotionSection>

      {/* Stats Section */}
      <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StatsCard icon={ShieldCheckIcon} title="Issues Resolved" value="1,284" change="+15%" changeType='increase' />
              <StatsCard icon={FireIcon} title="Active Reporters" value="312" change="+5%" changeType='increase'/>
              <StatsCard icon={StarIcon} title="Avg. Resolution Time" value="2.5 Days" change="-8%" changeType='decrease'/>
          </div>
      </section>

      {/* How It Works Section */}
      <section className="text-center">
        <h2 className="text-4xl font-bold mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <MotionDiv whileHover={{y: -10}} className="p-6 bg-gray-800/50 rounded-lg">
                <div className="text-5xl mb-4 text-cyan-400 font-bold">1.</div>
                <h3 className="text-2xl font-semibold mb-2">Report</h3>
                <p className="text-gray-400">Submit an issue with a photo, description, and location. Our AI helps categorize it instantly.</p>
            </MotionDiv>
            <MotionDiv whileHover={{y: -10}} className="p-6 bg-gray-800/50 rounded-lg">
                <div className="text-5xl mb-4 text-cyan-400 font-bold">2.</div>
                <h3 className="text-2xl font-semibold mb-2">Track</h3>
                <p className="text-gray-400">Follow your report's progress in real-time, from acknowledgment to resolution.</p>
            </MotionDiv>
            <MotionDiv whileHover={{y: -10}} className="p-6 bg-gray-800/50 rounded-lg">
                <div className="text-5xl mb-4 text-cyan-400 font-bold">3.</div>
                <h3 className="text-2xl font-semibold mb-2">Resolve</h3>
                <p className="text-gray-400">Get notified when the issue is fixed. Earn points and badges for your contribution!</p>
            </MotionDiv>
        </div>
      </section>
    </div>
  );
};

export default Home;