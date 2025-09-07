
import React from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
    message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = "Analyzing..." }) => {
    // FIX: Assign motion component to a capitalized variable to resolve TypeScript type inference issue.
    const MotionDiv = motion.div;
    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <MotionDiv
                className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-lg text-cyan-300">{message}</p>
        </div>
    );
}

export default Loader;