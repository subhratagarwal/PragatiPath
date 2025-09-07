import { createContext, useContext, useState } from "react";

const GamificationContext = createContext();

export const GamificationProvider = ({ children }) => {
  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState([]);

  const addPoints = (value) => setPoints((prev) => prev + value);
  const awardBadge = (badge) => setBadges((prev) => [...prev, badge]);

  return (
    <GamificationContext.Provider value={{ points, badges, addPoints, awardBadge }}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => useContext(GamificationContext);
