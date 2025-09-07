
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  // FIX: Assign motion components to capitalized variables to resolve TypeScript type inference issues.
  const MotionDiv = motion.div;
  const MotionH1 = motion.h1;
  const MotionH2 = motion.h2;
  const MotionP = motion.p;

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-20 flex flex-col items-center"
    >
      <MotionH1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        className="text-9xl font-extrabold text-cyan-400/30"
      >
        404
      </MotionH1>
      <MotionH2
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
        className="text-4xl font-bold text-white mt-4"
      >
        Page Not Found
      </MotionH2>
      <MotionP
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-lg text-gray-400 mt-2 max-w-md"
      >
        Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </MotionP>
      <MotionDiv
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        className="mt-8"
      >
        <Link
          to="/"
          className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-cyan-500/30"
        >
          Go Back Home
        </Link>
      </MotionDiv>
    </MotionDiv>
  );
};

export default NotFound;