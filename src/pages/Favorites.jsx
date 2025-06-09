import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import PropertyCard from '../components/PropertyCard';
import PropertyDetailModal from '../components/PropertyDetailModal';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import ApperIcon from '../components/ApperIcon';
import { propertyService, favoriteService } from '../services';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [properties, setProperties] = useState([]);
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const [favoritesResult, propertiesResult] = await Promise.all([
        favoriteService.getAll(),
        propertyService.getAll()
      ]);
      
      setFavorites(favoritesResult);
      setProperties(propertiesResult);
      
      // Match favorites with property details
      const favoritePropertyIds = favoritesResult.map(f => f.propertyId);
      const matchedProperties = propertiesResult.filter(p => 
        favoritePropertyIds.includes(p.id)
      );
      setFavoriteProperties(matchedProperties);
    } catch (err) {
      setError(err.message || 'Failed to load favorites');
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (propertyId) => {
    try {
      await favoriteService.delete(propertyId);
      setFavorites(prev => prev.filter(f => f.propertyId !== propertyId));
      setFavoriteProperties(prev => prev.filter(p => p.id !== propertyId));
      toast.success('Property removed from favorites');
    } catch (err) {
      toast.error('Failed to remove from favorites');
    }
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
  };

  const handleCloseModal = () => {
    setSelectedProperty(null);
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to remove all favorites?')) {
      try {
        // Remove all favorites
        await Promise.all(favorites.map(f => favoriteService.delete(f.propertyId)));
        setFavorites([]);
        setFavoriteProperties([]);
        toast.success('All favorites cleared');
      } catch (err) {
        toast.error('Failed to clear favorites');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-4 space-y-3">
                    <SkeletonLoader count={3} />
                  </div>
                </div>
              </motion.div>
            ))}
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
            onRetry={loadFavorites}
          />
        </div>
      </div>
    );
  }

  if (favoriteProperties.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <EmptyState
            title="No favorite properties yet"
            description="Start browsing and save properties you're interested in"
            actionLabel="Browse Properties"
            onAction={() => window.location.href = '/browse'}
            icon="Heart"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container mx-auto px-4 py-6 max-w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-heading font-semibold text-gray-900">
              Favorite Properties
            </h1>
            <p className="text-gray-600 mt-1">
              {favoriteProperties.length} saved {favoriteProperties.length === 1 ? 'property' : 'properties'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {favoriteProperties.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                <ApperIcon name="Trash2" size={16} />
                Clear All
              </motion.button>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <ApperIcon name="Grid3x3" size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <ApperIcon name="List" size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <motion.div
          layout
          className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          }`}
        >
          <AnimatePresence>
            {favoriteProperties.map((property, index) => (
              <motion.div
                key={property.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <PropertyCard
                  property={property}
                  viewMode={viewMode}
                  onClick={() => handlePropertyClick(property)}
                  onRemoveFavorite={() => handleRemoveFavorite(property.id)}
                  showRemoveButton={true}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Property Detail Modal */}
      <AnimatePresence>
        {selectedProperty && (
          <PropertyDetailModal
            property={selectedProperty}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Favorites;