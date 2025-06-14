import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import ContactAgentForm from './ContactAgentForm';
import ScheduleViewingForm from './ScheduleViewingForm';
import ImageGallery from './ImageGallery';
import NeighborhoodStats from './NeighborhoodStats';
import MortgageCalculator from './MortgageCalculator';
import { favoriteService } from '../services';

const PropertyDetailModal = ({ property, onClose }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
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

          {/* Enhanced Image Gallery */}
          <ImageGallery
            images={property.images}
            propertyTitle={property.title}
            initialIndex={0}
          />

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

{/* Neighborhood Stats */}
            <NeighborhoodStats property={property} />

            {/* Mortgage Calculator */}
            <MortgageCalculator property={property} />

            {/* Contact Actions */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <ApperIcon name={showContactForm ? "ChevronUp" : "MessageCircle"} size={18} />
                  {showContactForm ? "Hide Contact Form" : "Contact Agent"}
                </motion.button>
                
<motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowScheduleForm(!showScheduleForm)}
                  className="flex-1 bg-secondary text-white px-6 py-3 rounded-lg font-medium hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <ApperIcon name={showScheduleForm ? "ChevronUp" : "Calendar"} size={18} />
                  {showScheduleForm ? "Hide Schedule Form" : "Schedule Viewing"}
                </motion.button>
              </div>
            </div>

{/* Contact Agent Form */}
            <AnimatePresence>
              {showContactForm && (
                <ContactAgentForm 
                  property={property} 
                  onSuccess={() => setShowContactForm(false)}
                />
              )}
            </AnimatePresence>

            {/* Schedule Viewing Form */}
            <AnimatePresence>
              {showScheduleForm && (
                <ScheduleViewingForm 
                  property={property} 
                  onSuccess={() => setShowScheduleForm(false)}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PropertyDetailModal;