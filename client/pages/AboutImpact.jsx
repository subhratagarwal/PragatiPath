// client/src/pages/AboutImpact.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";

export default function AboutImpact() {
  useEffect(() => (document.title = "About Impact — CivicConnect"), []);

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-bold mb-4">
          Transparency & Impact
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="text-gray-700">
          CivicConnect is built to reduce friction between citizens and local government teams. We surface data, ensure accountability, and reward
          constructive reporting. The public dashboard provides heatmaps, response times, and resolved case counts.
        </motion.p>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <motion.div className="p-6 bg-slate-50 rounded-lg shadow-sm" initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h3 className="font-semibold">Open Data</h3>
            <p className="text-sm text-gray-600 mt-2">Anyone can view anonymized reports, response statistics and department performance.</p>
          </motion.div>

          <motion.div className="p-6 bg-slate-50 rounded-lg shadow-sm" initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.08 }}>
            <h3 className="font-semibold">Community Rewards</h3>
            <p className="text-sm text-gray-600 mt-2">Points & badges encourage prompt and accurate reporting; leaderboards highlight top contributors.</p>
          </motion.div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Sample KPIs</h2>
          <ul className="mt-4 list-disc list-inside text-gray-700 space-y-2">
            <li>Average response time reduced from 48 hrs to 18 hrs</li>
            <li>10% increase in verified reports via image validation</li>
            <li>Top neighborhoods show 30% faster resolution rates</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
