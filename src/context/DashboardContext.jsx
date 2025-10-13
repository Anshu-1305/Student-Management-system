import React, { createContext, useContext, useState } from 'react';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigateToSection = (section) => {
    if (section === activeSection) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSection(section);
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <DashboardContext.Provider value={{
      activeSection,
      setActiveSection,
      navigateToSection,
      isTransitioning
    }}>
      {children}
    </DashboardContext.Provider>
  );
};