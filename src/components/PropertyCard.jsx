import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { favoriteService } from '../services';

const PropertyCard = ({ 
  property, 
  viewMode = 'grid', 
  onClick, 
  onRemoveFavorite,
  showRemoveButton = false,
  compact = false,
  isHighlighted = false,
  searchQuery = ''
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, [property.id]);

  const checkFavoriteStatus = async () => {
    try {
      const favorites = await favoriteService.getAll();
      setIsFavorite(favorites.some(f => f.propertyId === property.id));
    } catch (err) {
      console.error('Failed to check favorite status:', err);
    }
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    
    try {
      if (isFavorite) {
        await favoriteService.delete(property.id);
        setIsFavorite(false);
        toast.success('Removed from favorites');
        if (onRemoveFavorite) {
          onRemoveFavorite();
        }
      } else {
        await favoriteService.create({
          propertyId: property.id,
          savedDate: new Date().toISOString()
        });
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (err) {
      toast.error('Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ scale: compact ? 1.01 : 1.02 }}
        className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden border-2 ${
          isHighlighted ? 'border-primary shadow-md' : 'border-transparent'
        }`}
        onClick={onClick}
      >
        <div className={`flex ${compact ? 'h-32' : 'h-40'}`}>
          <div className={`relative ${compact ? 'w-40' : 'w-48'} flex-shrink-0`}>
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              {showRemoveButton ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleFavoriteClick}
                  disabled={isLoading}
                  className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                >
                  <ApperIcon name="Trash2" size={14} />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleFavoriteClick}
                  disabled={isLoading}
                  className={`p-2 rounded-full shadow-lg transition-colors ${
                    isFavorite
                      ? 'bg-accent text-white'
                      : 'bg-white/90 text-gray-600 hover:text-accent'
                  }`}
                >
                  <motion.div
                    animate={isFavorite ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <ApperIcon name="Heart" size={14} fill={isFavorite ? 'currentColor' : 'none'} />
                  </motion.div>
                </motion.button>
              )}
            </div>
          </div>
          
          <div className="flex-1 p-4 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-heading font-semibold text-lg text-gray-900 truncate">
                {searchQuery ? highlightText(property.title, searchQuery) : property.title}
              </h3>
              <span className="text-primary font-bold text-lg ml-2 flex-shrink-0">
                {formatPrice(property.price)}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-3 truncate">
              {searchQuery ? highlightText(property.address, searchQuery) : property.address}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-1">
                <ApperIcon name="Bed" size={14} />
                <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-1">
                <ApperIcon name="Bath" size={14} />
                <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-1">
                <ApperIcon name="Square" size={14} />
                <span>{property.squareFeet.toLocaleString()} sqft</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        <div className="absolute top-3 right-3">
          {showRemoveButton ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleFavoriteClick}
              disabled={isLoading}
              className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
            >
              <ApperIcon name="Trash2" size={16} />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleFavoriteClick}
              disabled={isLoading}
              className={`p-2 rounded-full shadow-lg transition-colors ${
                isFavorite
                  ? 'bg-accent text-white'
                  : 'bg-white/90 text-gray-600 hover:text-accent'
              }`}
            >
              <motion.div
                animate={isFavorite ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <ApperIcon name="Heart" size={16} fill={isFavorite ? 'currentColor' : 'none'} />
              </motion.div>
            </motion.button>
          )}
        </div>
        
        <div className="absolute bottom-3 left-3">
          <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
            {formatPrice(property.price)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-heading font-semibold text-lg text-gray-900 mb-1 truncate">
          {searchQuery ? highlightText(property.title, searchQuery) : property.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 truncate">
          {searchQuery ? highlightText(property.address, searchQuery) : property.address}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-700">
          <div className="flex items-center gap-1">
            <ApperIcon name="Bed" size={14} />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="Bath" size={14} />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="Square" size={14} />
            <span>{property.squareFeet.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {property.type}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;