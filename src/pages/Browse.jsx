import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import PropertyCard from '../components/PropertyCard';
import FilterSidebar from '../components/FilterSidebar';
import PropertyDetailModal from '../components/PropertyDetailModal';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import ApperIcon from '../components/ApperIcon';
import { propertyService } from '../services';

const Browse = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 2000000,
    propertyTypes: [],
    bedroomsMin: 0,
    bathroomsMin: 0,
    squareFeetMin: 0,
    keywords: ''
  });

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [properties, filters]);

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

  const applyFilters = () => {
    let filtered = [...properties];

    // Price filter
    filtered = filtered.filter(p => 
      p.price >= filters.priceMin && p.price <= filters.priceMax
    );

    // Property type filter
    if (filters.propertyTypes.length > 0) {
      filtered = filtered.filter(p => 
        filters.propertyTypes.includes(p.type)
      );
    }

    // Bedrooms filter
    if (filters.bedroomsMin > 0) {
      filtered = filtered.filter(p => p.bedrooms >= filters.bedroomsMin);
    }

    // Bathrooms filter
    if (filters.bathroomsMin > 0) {
      filtered = filtered.filter(p => p.bathrooms >= filters.bathroomsMin);
    }

    // Square feet filter
    if (filters.squareFeetMin > 0) {
      filtered = filtered.filter(p => p.squareFeet >= filters.squareFeetMin);
    }

    // Keywords filter
    if (filters.keywords) {
      const keywords = filters.keywords.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(keywords) ||
        p.address.toLowerCase().includes(keywords) ||
        p.city.toLowerCase().includes(keywords) ||
        p.description.toLowerCase().includes(keywords)
      );
    }

    setFilteredProperties(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
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
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <SkeletonLoader count={8} />
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div className="h-48 bg-gray-200 animate-pulse"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
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
            title="No properties available"
            description="Check back later for new listings"
            actionLabel="Refresh"
            onAction={loadProperties}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container mx-auto px-4 py-6 max-w-full">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-heading font-semibold text-gray-900">
              Browse Properties
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredProperties.length} of {properties.length} properties
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ApperIcon name="Filter" size={16} />
              Filters
            </button>

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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              propertyCount={filteredProperties.length}
            />
          </div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            {filteredProperties.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <ApperIcon name="Search" className="w-16 h-16 text-gray-300 mx-auto" />
                </motion.div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No properties match your filters</h3>
                <p className="mt-2 text-gray-500">Try adjusting your search criteria</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilters({
                    priceMin: 0,
                    priceMax: 2000000,
                    propertyTypes: [],
                    bedroomsMin: 0,
                    bathroomsMin: 0,
                    squareFeetMin: 0,
                    keywords: ''
                  })}
                  className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Clear Filters
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                layout
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                <AnimatePresence mode="wait">
                  {filteredProperties.map((property, index) => (
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
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
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

export default Browse;