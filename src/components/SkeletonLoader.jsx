import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 3, type = 'default' }) => {
  const skeletonVariants = {
    initial: { opacity: 0.4 },
    animate: { opacity: 1 },
    transition: {
      repeat: Infinity,
      repeatType: 'reverse',
      duration: 1.5,
      ease: 'easeInOut'
    }
  };

  if (type === 'card') {
    return (
      <div className="space-y-6">
        {[...Array(count)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <motion.div
              variants={skeletonVariants}
              initial="initial"
              animate="animate"
              className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
            />
            <div className="p-4 space-y-3">
              <motion.div
                variants={skeletonVariants}
                initial="initial"
                animate="animate"
                className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4"
              />
              <motion.div
                variants={skeletonVariants}
                initial="initial"
                animate="animate"
                className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2"
              />
              <motion.div
                variants={skeletonVariants}
                initial="initial"
                animate="animate"
                className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-2/3"
              />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="space-y-3"
        >
          <motion.div
            variants={skeletonVariants}
            initial="initial"
            animate="animate"
            className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4"
          />
          <motion.div
            variants={skeletonVariants}
            initial="initial"
            animate="animate"
            className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2"
          />
          <motion.div
            variants={skeletonVariants}
            initial="initial"
            animate="animate"
            className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-5/6"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;