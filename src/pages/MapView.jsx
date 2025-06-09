import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PropertyCard from '../components/PropertyCard';
import PropertyDetailModal from '../components/PropertyDetailModal';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import ApperIcon from '../components/ApperIcon';
import { propertyService } from '../services';

const MapView = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [hoveredProperty, setHoveredProperty] = useState(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await propertyService.getAll();
      setProperties(result);
    } catch (err) {
      setError(err.message || 'Failed to load properties');
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
  };

  const handleCloseModal = () => {
    setSelectedProperty(null);
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="h-full flex">
          <div className="w-full lg:w-2/3 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-pulse">
                <ApperIcon name="Map" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Loading map...</p>
              </div>
            </div>
          </div>
          <div className="hidden lg:block w-1/3 bg-white border-l border-gray-200 p-4 overflow-y-auto">
            <SkeletonLoader count={5} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <ErrorState
            message={error}
            onRetry={loadProperties}
          />
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <EmptyState
            title="No properties to display"
            description="Check back later for new listings"
            actionLabel="Refresh"
            onAction={loadProperties}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full flex flex-col lg:flex-row">
        {/* Map Area */}
        <div className="flex-1 bg-gray-100 relative">
          {/* Simulated Map with Property Markers */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <ApperIcon name="Map" className="w-20 h-20 text-primary mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
                Interactive Map View
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Map integration would display property locations with clickable markers. 
                Select properties from the sidebar to see details.
              </p>
            </div>
          </div>

          {/* Property Markers Simulation */}
          <div className="absolute inset-0 p-8">
            {properties.slice(0, 6).map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.2 }}
                className={`absolute w-8 h-8 bg-primary rounded-full border-2 border-white shadow-lg cursor-pointer flex items-center justify-center text-white text-sm font-semibold hover:scale-110 transition-transform ${
                  hoveredProperty?.id === property.id ? 'scale-125 bg-accent' : ''
                }`}
                style={{
                  left: `${20 + (index % 3) * 30}%`,
                  top: `${30 + Math.floor(index / 3) * 25}%`
                }}
                onClick={() => handlePropertyClick(property)}
                onMouseEnter={() => setHoveredProperty(property)}
                onMouseLeave={() => setHoveredProperty(null)}
              >
                ${Math.round(property.price / 1000)}K
              </motion.div>
            ))}
          </div>

          {/* Hovered Property Info */}
          {hoveredProperty && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm"
            >
              <h4 className="font-semibold text-gray-900">{hoveredProperty.title}</h4>
              <p className="text-gray-600 text-sm">{hoveredProperty.address}</p>
              <p className="text-primary font-semibold mt-1">
                ${hoveredProperty.price.toLocaleString()}
              </p>
            </motion.div>
          )}
        </div>

        {/* Properties Sidebar */}
        <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-heading font-semibold text-gray-900">
              Properties on Map
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {properties.length} properties found
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredProperty(property)}
                onMouseLeave={() => setHoveredProperty(null)}
              >
                <PropertyCard
                  property={property}
                  viewMode="list"
                  compact={true}
                  onClick={() => handlePropertyClick(property)}
                  isHighlighted={hoveredProperty?.id === property.id}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default MapView;