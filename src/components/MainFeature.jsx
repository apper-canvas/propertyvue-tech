import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import PropertyCard from './PropertyCard';
import PropertyDetailModal from './PropertyDetailModal';
import FilterSidebar from './FilterSidebar';
import SkeletonLoader from './SkeletonLoader';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';
import ApperIcon from './ApperIcon';
import { propertyService } from '../services';

const MainFeature = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
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

    // Apply all filters
    filtered = filtered.filter(p => {
      const priceMatch = p.price >= filters.priceMin && p.price <= filters.priceMax;
      const typeMatch = filters.propertyTypes.length === 0 || filters.propertyTypes.includes(p.type);
      const bedroomsMatch = filters.bedroomsMin === 0 || p.bedrooms >= filters.bedroomsMin;
      const bathroomsMatch = filters.bathroomsMin === 0 || p.bathrooms >= filters.bathroomsMin;
      const sqftMatch = filters.squareFeetMin === 0 || p.squareFeet >= filters.squareFeetMin;
      
      let keywordsMatch = true;
      if (filters.keywords) {
        const keywords = filters.keywords.toLowerCase();
        keywordsMatch = (
          p.title.toLowerCase().includes(keywords) ||
          p.address.toLowerCase().includes(keywords) ||
          p.city.toLowerCase().includes(keywords) ||
          p.description.toLowerCase().includes(keywords)
        );
      }

      return priceMatch && typeMatch && bedroomsMatch && bathroomsMatch && sqftMatch && keywordsMatch;
    });

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
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <SkeletonLoader count={8} />
            </div>
          </div>
          <div className="lg:col-span-3">
            <SkeletonLoader count={6} type="card" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <ErrorState
          message={error}
          onRetry={loadProperties}
        />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <EmptyState
          title="No properties available"
          description="Check back later for new listings"
          actionLabel="Refresh"
          onAction={loadProperties}
          icon="Home"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-full">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-heading font-semibold text-gray-900">
            Featured Properties
          </h2>
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
            <EmptyState
              title="No properties match your filters"
              description="Try adjusting your search criteria"
              actionLabel="Clear Filters"
              onAction={() => setFilters({
                priceMin: 0,
                priceMax: 2000000,
                propertyTypes: [],
                bedroomsMin: 0,
                bathroomsMin: 0,
                squareFeetMin: 0,
                keywords: ''
              })}
              icon="Search"
            />
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

export default MainFeature;