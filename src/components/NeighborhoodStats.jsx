import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';
import SkeletonLoader from './SkeletonLoader';
import ErrorState from './ErrorState';
import { neighborhoodService } from '../services';

const NeighborhoodStats = ({ property }) => {
  const [schools, setSchools] = useState([]);
  const [transit, setTransit] = useState([]);
  const [pointsOfInterest, setPOI] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNeighborhoodData();
  }, [property.id]);

  const fetchNeighborhoodData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [schoolsData, transitData, poiData] = await Promise.all([
        neighborhoodService.getSchools(property.latitude, property.longitude),
        neighborhoodService.getTransit(property.latitude, property.longitude),
        neighborhoodService.getPointsOfInterest(property.latitude, property.longitude)
      ]);
      
      setSchools(schoolsData);
      setTransit(transitData);
      setPOI(poiData);
    } catch (err) {
      setError('Failed to load neighborhood information');
    } finally {
      setLoading(false);
    }
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <ApperIcon key={i} name="Star" size={12} className="text-yellow-400" fill="currentColor" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <ApperIcon key="half" name="Star" size={12} className="text-yellow-400" />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <ApperIcon key={`empty-${i}`} name="Star" size={12} className="text-gray-300" />
      );
    }
    
    return stars;
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Restaurant': 'Utensils',
      'Grocery': 'ShoppingCart',
      'Hospital': 'Heart',
      'Park': 'Trees',
      'Shopping': 'Store',
      'Gym': 'Dumbbell',
      'Bank': 'CreditCard',
      'Gas Station': 'Fuel'
    };
    return iconMap[category] || 'MapPin';
  };

  if (loading) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Neighborhood</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-surface-50 rounded-lg p-4">
              <SkeletonLoader count={1} />
              <div className="mt-3 space-y-2">
                <SkeletonLoader count={3} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Neighborhood</h3>
        <ErrorState 
          title="Neighborhood Data Unavailable"
          message={error}
          onRetry={fetchNeighborhoodData}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Neighborhood</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Schools Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-50 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ApperIcon name="GraduationCap" size={18} className="text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Schools</h4>
          </div>
          
          <div className="space-y-3">
            {schools.length === 0 ? (
              <p className="text-gray-500 text-sm">No schools found nearby</p>
            ) : (
              schools.map((school, index) => (
                <motion.div
                  key={school.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="border-l-2 border-blue-200 pl-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-medium text-sm text-gray-900 mb-1">
                        {school.name}
                      </h5>
                      <div className="flex items-center gap-1 mb-1">
                        {renderRatingStars(school.rating)}
                        <span className="text-xs text-gray-600 ml-1">
                          ({school.rating})
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        {school.type} • {school.distance}
                      </p>
                    </div>
                    {school.website && (
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        href={school.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-blue-600 hover:text-blue-700"
                      >
                        <ApperIcon name="ExternalLink" size={12} />
                      </motion.a>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Transit Section */}
        <motion.div
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-50 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ApperIcon name="Bus" size={18} className="text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Transit</h4>
          </div>
          
          <div className="space-y-3">
            {transit.length === 0 ? (
              <p className="text-gray-500 text-sm">No transit options nearby</p>
            ) : (
              transit.map((stop, index) => (
                <motion.div
                  key={stop.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="border-l-2 border-green-200 pl-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-medium text-sm text-gray-900 mb-1">
                        {stop.name}
                      </h5>
                      <div className="flex flex-wrap gap-1 mb-1">
                        {stop.lines.map((line, lineIndex) => (
                          <span
                            key={lineIndex}
                            className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded"
                          >
                            {line}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-600">
                        {stop.type} • {stop.walkTime} walk
                      </p>
                    </div>
                    {stop.mapUrl && (
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        href={stop.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-green-600 hover:text-green-700"
                      >
                        <ApperIcon name="Map" size={12} />
                      </motion.a>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Points of Interest Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface-50 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ApperIcon name="MapPin" size={18} className="text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Points of Interest</h4>
          </div>
          
          <div className="space-y-3">
            {pointsOfInterest.length === 0 ? (
              <p className="text-gray-500 text-sm">No points of interest nearby</p>
            ) : (
              pointsOfInterest.map((poi, index) => (
                <motion.div
                  key={poi.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="border-l-2 border-purple-200 pl-3"
                >
                  <div className="flex items-start gap-2">
                    <ApperIcon 
                      name={getCategoryIcon(poi.category)} 
                      size={14} 
                      className="text-purple-600 mt-0.5 flex-shrink-0" 
                    />
                    <div className="flex-1">
                      <h5 className="font-medium text-sm text-gray-900 mb-1">
                        {poi.name}
                      </h5>
                      <p className="text-xs text-gray-600">
                        {poi.category} • {poi.distance}
                      </p>
                      {poi.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          {renderRatingStars(poi.rating)}
                          <span className="text-xs text-gray-600 ml-1">
                            ({poi.rating})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NeighborhoodStats;