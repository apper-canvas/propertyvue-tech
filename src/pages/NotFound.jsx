import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md w-full"
      >
        <motion.div
          animate={{ 
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="mb-8"
        >
          <ApperIcon name="Home" className="w-24 h-24 text-primary mx-auto" />
        </motion.div>
        
        <h1 className="text-4xl font-heading font-semibold text-gray-900 mb-4">
          Property Not Found
        </h1>
        
        <p className="text-gray-600 mb-8">
          The property you're looking for seems to have moved or doesn't exist. 
          Let's get you back to browsing amazing homes.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/browse')}
          className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Browse Properties
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;