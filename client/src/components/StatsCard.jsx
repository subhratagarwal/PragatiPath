// src/components/StatsCard.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const StatsCard = ({ title, value, icon: Icon, change, changeType }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="w-full md:w-64"
    >
      <Card className="rounded-2xl shadow-md bg-white border border-gray-200 hover:shadow-lg transition">
        <CardContent className="flex flex-col items-start gap-3 p-5">
          {/* Icon + Title */}
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-6 w-6 text-blue-500" />}
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          </div>

          {/* Value */}
          <h2 className="text-2xl font-bold text-gray-900">{value}</h2>

          {/* Change Indicator */}
          {change && (
            <span
              className={`text-sm font-medium px-2 py-1 rounded-lg ${
                changeType === "increase"
                  ? "text-green-600 bg-green-100"
                  : "text-red-600 bg-red-100"
              }`}
            >
              {changeType === "increase" ? "↑" : "↓"} {change}
            </span>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;
