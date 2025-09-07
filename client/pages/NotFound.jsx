// client/src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center p-6">
      <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="mt-2 text-gray-600">Page not found</p>
        <Link to="/" className="inline-block mt-6 px-5 py-2 bg-indigo-600 text-white rounded">Go Home</Link>
      </motion.div>
    </div>
  );
}
