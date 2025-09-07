// client/src/pages/Home.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import MapView from "../components/MapView";
import LeaderboardCard from "../components/LeaderboardCard";
import StatsCard from "../components/StatsCard";

export default function Home() {
  useEffect(() => {
    document.title = "CivicConnect — Home";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-900">
      <header className="px-4 py-5 max-w-5xl mx-auto">
        {/* Hero */}
        <section className="grid gap-6 grid-cols-1 md:grid-cols-2 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight"
            >
              Report civic issues in seconds — track progress in real time.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-gray-700 max-w-xl"
            >
              Mobile-first platform for citizens & local admins. Upload a photo,
              share location, earn points and stay informed — all transparently.
            </motion.p>

            <motion.div
              className="mt-6 flex gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                to="/report"
                className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-lg hover:scale-105 transform transition"
                aria-label="Report Issue Now"
              >
                Report Issue Now
              </Link>

              <Link
                to="/issues"
                className="inline-flex items-center px-4 py-3 border border-indigo-200 rounded-lg text-indigo-700 hover:bg-indigo-50"
              >
                Browse Issues
              </Link>
            </motion.div>

            <motion.div
              className="mt-6 flex gap-4 flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <StatsCard title="Open Issues" value="1,248" />
              <StatsCard title="Avg. Response" value="18 hrs" />
              <StatsCard title="Resolved" value="9.2k" />
            </motion.div>
          </div>

          <div className="w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-lg">
            <motion.div
              initial={{ scale: 1.02 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full h-full"
            >
              <MapView compact />
            </motion.div>
          </div>
        </section>
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-12">
        <section className="mt-8 grid gap-6 md:grid-cols-3">
          <LeaderboardCard compact />
          <LeaderboardCard />
          <LeaderboardCard />
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">How it works</h2>

          <div className="grid gap-6 md:grid-cols-3">
            <motion.article
              className="p-5 bg-white rounded-xl shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-semibold">Report</h3>
              <p className="text-sm text-gray-600 mt-2">
                Snap photo, add voice/text and drop a pin — submit in under 30s.
              </p>
            </motion.article>

            <motion.article
              className="p-5 bg-white rounded-xl shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-semibold">Track</h3>
              <p className="text-sm text-gray-600 mt-2">
                Follow issue timeline with live updates from assigned teams.
              </p>
            </motion.article>

            <motion.article
              className="p-5 bg-white rounded-xl shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-semibold">Impact</h3>
              <p className="text-sm text-gray-600 mt-2">
                Earn points, badges and help keep your neighbourhood clean.
              </p>
            </motion.article>
          </div>
        </section>
      </main>
    </div>
  );
}
