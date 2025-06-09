import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const FilterSidebar = ({ filters, onFilterChange, propertyCount }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const propertyTypes = ['House', 'Condo', 'Townhouse', 'Apartment'];
  
  const priceRanges = [
    { label: 'Under $300K', min: 0, max: 299999 },
    { label: '$300K - $500K', min: 300000, max: 499999 },
    { label: '$500K - $750K', min: 500000, max: 749999 },
    { label: '$750K - $1M', min: 750000, max: 999999 },
    { label: 'Over $1M', min: 1000000, max: 10000000 }
  ];

  const updateFilter = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePropertyTypeToggle = (type) => {
    const currentTypes = localFilters.propertyTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    updateFilter('propertyTypes', newTypes);
  };

  const handlePriceRangeChange = (range) => {
    updateFilter('priceMin', range.min);
    updateFilter('priceMax', range.max);
  };

  const clearFilters = () => {
    const clearedFilters = {
      priceMin: 0,
      priceMax: 2000000,
      propertyTypes: [],
      bedroomsMin: 0,
      bathroomsMin: 0,
      squareFeetMin: 0,
      keywords: ''
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = () => {
    return (
      localFilters.priceMin > 0 ||
      localFilters.priceMax < 2000000 ||
      (localFilters.propertyTypes && localFilters.propertyTypes.length > 0) ||
      localFilters.bedroomsMin > 0 ||
      localFilters.bathroomsMin > 0 ||
      localFilters.squareFeetMin > 0 ||
      (localFilters.keywords && localFilters.keywords.trim())
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters() && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            Clear All
          </motion.button>
        )}
      </div>

      {/* Keywords Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Keywords
        </label>
        <div className="relative">
          <ApperIcon 
            name="Search" 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            size={16} 
          />
          <input
            type="text"
            value={localFilters.keywords || ''}
            onChange={(e) => updateFilter('keywords', e.target.value)}
            placeholder="Search by location, features..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Price Range
        </label>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label key={range.label} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="priceRange"
                checked={localFilters.priceMin === range.min && localFilters.priceMax === range.max}
                onChange={() => handlePriceRangeChange(range)}
                className="sr-only"
              />
              <div className={`w-4 h-4 border-2 rounded-full mr-3 flex items-center justify-center ${
                localFilters.priceMin === range.min && localFilters.priceMax === range.max
                  ? 'border-primary bg-primary'
                  : 'border-gray-300'
              }`}>
                {localFilters.priceMin === range.min && localFilters.priceMax === range.max && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span className="text-sm text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Property Type
        </label>
        <div className="space-y-2">
          {propertyTypes.map((type) => (
            <label key={type} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={(localFilters.propertyTypes || []).includes(type)}
                onChange={() => handlePropertyTypeToggle(type)}
                className="sr-only"
              />
              <div className={`w-4 h-4 border-2 rounded mr-3 flex items-center justify-center ${
                (localFilters.propertyTypes || []).includes(type)
                  ? 'border-primary bg-primary'
                  : 'border-gray-300'
              }`}>
                {(localFilters.propertyTypes || []).includes(type) && (
                  <ApperIcon name="Check" className="text-white" size={12} />
                )}
              </div>
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Bedrooms */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Bedrooms
        </label>
        <select
          value={localFilters.bedroomsMin || 0}
          onChange={(e) => updateFilter('bedroomsMin', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
        >
          <option value={0}>Any</option>
          <option value={1}>1+</option>
          <option value={2}>2+</option>
          <option value={3}>3+</option>
          <option value={4}>4+</option>
          <option value={5}>5+</option>
        </select>
      </div>

      {/* Bathrooms */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Bathrooms
        </label>
        <select
          value={localFilters.bathroomsMin || 0}
          onChange={(e) => updateFilter('bathroomsMin', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
        >
          <option value={0}>Any</option>
          <option value={1}>1+</option>
          <option value={2}>2+</option>
          <option value={3}>3+</option>
          <option value={4}>4+</option>
        </select>
      </div>

      {/* Square Feet */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Square Feet
        </label>
        <input
          type="number"
          value={localFilters.squareFeetMin || ''}
          onChange={(e) => updateFilter('squareFeetMin', parseInt(e.target.value) || 0)}
          placeholder="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
        />
      </div>

      {/* Results Count */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          <span className="font-semibold text-primary">{propertyCount}</span> properties found
        </p>
      </div>
    </div>
  );
};

export default FilterSidebar;