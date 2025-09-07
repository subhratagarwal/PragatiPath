// client/src/pages/Dashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import MapView from "../components/MapView";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ type: "all", urgency: "all" });

  useEffect(() => {
    document.title = "Admin Dashboard — CivicConnect";
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/dashboard/summary");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md p-6 bg-white rounded shadow text-center">
          <h2 className="text-xl font-semibold">Admin access required</h2>
          <p className="mt-2 text-gray-600">Log in with an admin account to view the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-semibold mb-4">
          Live Dashboard
        </motion.h1>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="col-span-2 bg-white p-4 rounded-lg shadow">
            <div className="h-96">
              <MapView admin filters={filters} />
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">Filters</h3>
              <div className="mt-3 space-y-2">
                <select className="block w-full" value={filters.type} onChange={(e) => setFilters((s) => ({ ...s, type: e.target.value }))}>
                  <option value="all">All types</option>
                  <option value="pothole">Pothole</option>
                  <option value="water">Water</option>
                </select>
                <select className="block w-full" value={filters.urgency} onChange={(e) => setFilters((s) => ({ ...s, urgency: e.target.value }))}>
                  <option value="all">All urgency</option>
                  <option value="critical">Critical</option>
                  <option value="normal">Normal</option>
                </select>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">Key Metrics</h3>
              <div className="mt-3 space-y-2 text-sm text-gray-600">
                <div>Open Issues: {stats?.open || "—"}</div>
                <div>Resolved (30d): {stats?.resolved30d || "—"}</div>
                <div>Avg Response: {stats?.avgResponse || "—"}</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">Predictive Insights</h3>
              <p className="text-sm text-gray-600 mt-2">Hotspots: {stats?.hotspots?.slice?.(0, 3).join(", ") || "—"}</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
