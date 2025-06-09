import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const ErrorState = ({ 
  message = "Something went wrong", 
  onRetry, 
  title = "Oops!",
  description 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <motion.div
        animate={{ 
          rotate: [0, -10, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        className="mb-6"
      >
        <ApperIcon name="AlertTriangle" className="w-16 h-16 text-red-400 mx-auto" />
      </motion.div>
      
      <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-2">
        {message}
      </p>
      
      {description && (
        <p className="text-gray-500 text-sm mb-6">
          {description}
        </p>
      )}
      
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
        >
          <ApperIcon name="RefreshCw" size={16} />
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
};

export default ErrorState;