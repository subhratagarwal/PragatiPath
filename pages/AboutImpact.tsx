
import React from 'react';
import { motion } from 'framer-motion';
import StatsCard from '../components/StatsCard';
import { ShieldCheckIcon, FireIcon, StarIcon, MapPinIcon } from '../components/icons';

const AboutImpact = () => {
  // FIX: Assign motion components to capitalized variables to resolve TypeScript type inference issues.
  const MotionDiv = motion.div;
  const MotionH1 = motion.h1;
  const MotionP = motion.p;
  
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto space-y-16"
    >
      <header className="text-center">
        <MotionH1 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, type: 'spring' }}
          className="text-5xl font-extrabold text-cyan-400 mb-4"
        >
          Our Mission & Impact
        </MotionH1>
        <MotionP 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, type: 'spring', delay: 0.2 }}
          className="text-lg text-gray-300 max-w-3xl mx-auto"
        >
          We believe in empowering citizens to be the catalysts for change. PragatiPath connects residents with local authorities, using technology to create safer, cleaner, and more efficient communities for everyone.
        </MotionP>
      </header>
      
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatsCard icon={ShieldCheckIcon} title="Issues Resolved" value="1,284" />
          <StatsCard icon={FireIcon} title="Active Reporters" value="312" />
          <StatsCard icon={StarIcon} title="Avg. Resolution Time" value="2.5 Days" />
          <StatsCard icon={MapPinIcon} title="Cities Active" value="3" />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <MotionDiv
            initial={{x: -100, opacity: 0}}
            whileInView={{x: 0, opacity: 1}}
            viewport={{once: true}}
            transition={{duration: 0.8}}
        >
          <img src="https://picsum.photos/seed/community/800/600" alt="Community members collaborating" className="rounded-lg shadow-lg"/>
        </MotionDiv>
        <MotionDiv
             initial={{x: 100, opacity: 0}}
            whileInView={{x: 0, opacity: 1}}
            viewport={{once: true}}
            transition={{duration: 0.8}}
        >
          <h2 className="text-3xl font-bold text-white mb-4">Technology for Transparency</h2>
          <p className="text-gray-300 leading-relaxed">
            Our platform provides an unprecedented level of transparency. Every report is publicly tracked, and our AI-driven analytics help city officials identify recurring problems and allocate resources more effectively. By making data accessible, we hold institutions accountable and foster trust within the community.
          </p>
        </MotionDiv>
      </section>
      
    </MotionDiv>
  );
};

export default AboutImpact;