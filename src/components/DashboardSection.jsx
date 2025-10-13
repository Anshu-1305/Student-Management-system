import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardSection = ({ children, isActive, className = "" }) => {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key="section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`w-full ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DashboardSection;