import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Issue } from '../types';

interface HeatmapProps {
    issues: Issue[];
}

const GRID_COLS = 20;
const GRID_ROWS = 10;

// Simple hash function to get a pseudo-random but deterministic grid cell
const getCellForIssue = (issueId: string): { x: number; y: number } => {
    let hashX = 0;
    for (let i = 0; i < issueId.length; i++) {
        hashX = (hashX << 5) - hashX + issueId.charCodeAt(i);
        hashX |= 0;
    }
    const x = Math.abs(hashX) % GRID_COLS;

    let hashY = 0;
    for (let i = issueId.length - 1; i >= 0; i--) {
        hashY = ((hashY << 5) - hashY) + issueId.charCodeAt(i);
        hashY |= 0;
    }
    const y = Math.abs(hashY) % GRID_ROWS;
    
    return { x, y };
};

const Heatmap: React.FC<HeatmapProps> = ({ issues }) => {
    const { grid, maxCount } = useMemo(() => {
        const newGrid: number[][] = Array(GRID_ROWS).fill(0).map(() => Array(GRID_COLS).fill(0));
        let newMaxCount = 0;

        issues.forEach(issue => {
            const { x, y } = getCellForIssue(issue.id);
            if (newGrid[y] && newGrid[y][x] !== undefined) {
                newGrid[y][x]++;
                if (newGrid[y][x] > newMaxCount) {
                    newMaxCount = newGrid[y][x];
                }
            }
        });
        return { grid: newGrid, maxCount: newMaxCount };
    }, [issues]);

    const getColorForCount = (count: number): string => {
        if (count === 0) return 'bg-gray-700/30';
        const intensity = Math.min(count / (maxCount * 0.8), 1); // Cap intensity to make hotspots stand out
        if (intensity < 0.2) return 'bg-cyan-500/30';
        if (intensity < 0.4) return 'bg-cyan-500/60';
        if (intensity < 0.6) return 'bg-yellow-500/60';
        if (intensity < 0.8) return 'bg-orange-500/80';
        return 'bg-red-500';
    };

    // FIX: Assign motion component to a capitalized variable to resolve TypeScript type inference issue.
    const MotionDiv = motion.div;

    return (
        <div className="w-full">
            <div 
                className="grid gap-1" 
                style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}
            >
                {grid.flat().map((count, index) => (
                    <MotionDiv
                        key={index}
                        className={`w-full aspect-square rounded-sm ${getColorForCount(count)}`}
                        title={`${count} issues`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: (index * 0.005) }}
                        whileHover={{ scale: 1.2, zIndex: 10, outline: '2px solid white' }}
                    />
                ))}
            </div>
            <div className="flex justify-end items-center space-x-4 mt-3 text-xs text-gray-400">
                <span>Less</span>
                <div className="flex space-x-1">
                    <div className="w-4 h-4 rounded-sm bg-cyan-500/30"></div>
                    <div className="w-4 h-4 rounded-sm bg-cyan-500/60"></div>
                    <div className="w-4 h-4 rounded-sm bg-yellow-500/60"></div>
                    <div className="w-4 h-4 rounded-sm bg-orange-500/80"></div>
                    <div className="w-4 h-4 rounded-sm bg-red-500"></div>
                </div>
                <span>More</span>
            </div>
        </div>
    );
};

export default Heatmap;