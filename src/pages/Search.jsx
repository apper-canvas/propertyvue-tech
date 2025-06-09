import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import PropertyCard from '../components/PropertyCard';
import PropertyDetailModal from '../components/PropertyDetailModal';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import ApperIcon from '../components/ApperIcon';
import { propertyService } from '../services';

const Search = () => {
  const [properties, setProperties] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searching, setSearching] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [quickFilters, setQuickFilters] = useState({
    priceRange: '',
    bedrooms: '',
    propertyType: ''
  });
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    loadProperties();
    loadRecentSearches();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const debounceTimer = setTimeout(() => {
        performSearch();
      }, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setSearchResults([]);
      setSearching(false);
    }
  }, [searchQuery, quickFilters, properties]);

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

  const loadRecentSearches = () => {
    const saved = localStorage.getItem('propertyvue_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  };

  const saveRecentSearch = (query) => {
    if (!query.trim()) return;
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('propertyvue_recent_searches', JSON.stringify(updated));
  };

  const performSearch = () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      let results = [...properties];
      const query = searchQuery.toLowerCase();
      
      // Text search
      results = results.filter(property => 
        property.title.toLowerCase().includes(query) ||
        property.address.toLowerCase().includes(query) ||
        property.city.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query) ||
        property.features.some(feature => feature.toLowerCase().includes(query))
      );
      
      // Apply quick filters
      if (quickFilters.priceRange) {
        const [min, max] = quickFilters.priceRange.split('-').map(Number);
        results = results.filter(p => p.price >= min && (!max || p.price <= max));
      }
      
      if (quickFilters.bedrooms) {
        const minBeds = parseInt(quickFilters.bedrooms);
        results = results.filter(p => p.bedrooms >= minBeds);
      }
      
      if (quickFilters.propertyType) {
        results = results.filter(p => p.type === quickFilters.propertyType);
      }
      
      setSearchResults(results);
      setSearching(false);
      saveRecentSearch(searchQuery);
    }, 300);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch();
    }
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
  };

  const handleCloseModal = () => {
    setSelectedProperty(null);
  };

  const handleRecentSearchClick = (query) => {
    setSearchQuery(query);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('propertyvue_recent_searches');
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse mb-6"></div>
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

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container mx-auto px-4 py-6 max-w-full">
        {/* Search Header */}
        <div className="max-w-2xl mx-auto mb-8">
          <h1 className="text-2xl font-heading font-semibold text-gray-900 text-center mb-6">
            Search Properties
          </h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative mb-6">
            <div className="relative">
              <ApperIcon 
                name="Search" 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
                size={20} 
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by location, property type, or features..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 placeholder-gray-500"
              />
              {searching && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <ApperIcon name="Loader2" className="text-primary" size={20} />
                  </motion.div>
                </div>
              )}
            </div>
          </form>

          {/* Quick Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <select
              value={quickFilters.priceRange}
              onChange={(e) => setQuickFilters(prev => ({ ...prev, priceRange: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="">Any Price</option>
              <option value="0-300000">Under $300K</option>
              <option value="300000-500000">$300K - $500K</option>
              <option value="500000-750000">$500K - $750K</option>
              <option value="750000-1000000">$750K - $1M</option>
              <option value="1000000-">Over $1M</option>
            </select>

            <select
              value={quickFilters.bedrooms}
              onChange={(e) => setQuickFilters(prev => ({ ...prev, bedrooms: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="">Any Bedrooms</option>
              <option value="1">1+ Bedroom</option>
              <option value="2">2+ Bedrooms</option>
              <option value="3">3+ Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
              <option value="5">5+ Bedrooms</option>
            </select>

            <select
              value={quickFilters.propertyType}
              onChange={(e) => setQuickFilters(prev => ({ ...prev, propertyType: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="">Any Type</option>
              <option value="House">House</option>
              <option value="Condo">Condo</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Apartment">Apartment</option>
            </select>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && !searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900">Recent Searches</h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRecentSearchClick(search)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {search}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Search Results */}
        <div className="max-w-6xl mx-auto">
          {searchQuery && !searching && (
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                Search Results for "{searchQuery}"
              </h2>
              <p className="text-gray-600">
                {searchResults.length} {searchResults.length === 1 ? 'property' : 'properties'} found
              </p>
            </div>
          )}

          {searching ? (
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
          ) : searchQuery && searchResults.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <ApperIcon name="SearchX" className="w-16 h-16 text-gray-300 mx-auto" />
              </motion.div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No properties found</h3>
              <p className="mt-2 text-gray-500 max-w-md mx-auto">
                Try adjusting your search terms or filters to find more properties
              </p>
            </motion.div>
          ) : searchQuery && searchResults.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {searchResults.map((property, index) => (
                  <motion.div
                    key={property.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <PropertyCard
                      property={property}
                      viewMode="grid"
                      onClick={() => handlePropertyClick(property)}
                      searchQuery={searchQuery}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : !searchQuery ? (
            <EmptyState
              title="Start searching for your dream home"
              description="Enter a location, property type, or feature to begin your search"
              icon="Search"
            />
          ) : null}
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

export default Search;