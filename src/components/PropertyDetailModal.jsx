import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { favoriteService } from '../services';

const PropertyDetailModal = ({ property, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [property.id]);

  const checkFavoriteStatus = async () => {
    try {
      const favorites = await favoriteService.getAll();
      setIsFavorite(favorites.some(f => f.propertyId === property.id));
    } catch (err) {
      console.error('Failed to check favorite status:', err);
    }
  };

  const handleFavoriteClick = async () => {
    setIsLoading(true);
    
    try {
      if (isFavorite) {
        await favoriteService.delete(property.id);
        setIsFavorite(false);
        toast.success('Removed from favorites');
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

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-heading font-semibold text-gray-900 truncate">
              {property.title}
            </h2>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleFavoriteClick}
                disabled={isLoading}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite
                    ? 'bg-accent text-white'
                    : 'bg-gray-100 text-gray-600 hover:text-accent'
                }`}
              >
                <motion.div
                  animate={isFavorite ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <ApperIcon name="Heart" size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                </motion.div>
              </motion.button>
              
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="relative h-96 bg-gray-100">
            <img
              src={property.images[currentImageIndex]}
              alt={`${property.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation Arrows */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <ApperIcon name="ChevronLeft" size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                >
                  <ApperIcon name="ChevronRight" size={20} />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} of {property.images.length}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {property.images.length > 1 && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Property Details */}
          <div className="p-6">
            {/* Price and Basic Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <div className="text-2xl font-bold text-primary mb-1">
                  {formatPrice(property.price)}
                </div>
                <div className="text-gray-600">
                  {property.address}, {property.city}, {property.state} {property.zipCode}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-gray-700">
                <div className="flex items-center gap-1">
                  <ApperIcon name="Bed" size={16} />
                  <span className="font-medium">{property.bedrooms}</span>
                  <span className="text-sm">bed{property.bedrooms !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ApperIcon name="Bath" size={16} />
                  <span className="font-medium">{property.bathrooms}</span>
                  <span className="text-sm">bath{property.bathrooms !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ApperIcon name="Square" size={16} />
                  <span className="font-medium">{property.squareFeet.toLocaleString()}</span>
                  <span className="text-sm">sqft</span>
                </div>
              </div>
            </div>

            {/* Property Type and Status */}
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {property.type}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                property.status === 'Available' 
                  ? 'bg-green-100 text-green-800'
                  : property.status === 'Pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {property.status}
              </span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Property Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year Built:</span>
                    <span className="font-medium">{property.yearBuilt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lot Size:</span>
                    <span className="font-medium">{property.lotSize.toLocaleString()} sqft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Listed Date:</span>
                    <span className="font-medium">{formatDate(property.listedDate)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                <div className="space-y-2">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <ApperIcon name="Check" className="text-primary" size={16} />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <ApperIcon name="Phone" size={18} />
                  Contact Agent
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-secondary text-white px-6 py-3 rounded-lg font-medium hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <ApperIcon name="Calendar" size={18} />
                  Schedule Viewing
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PropertyDetailModal;