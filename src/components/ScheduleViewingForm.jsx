import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { viewingService } from '../services';

const ScheduleViewingForm = ({ property, onSuccess }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Generate available time slots
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get maximum date (3 months from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = 'Please select a viewing date';
    }

    if (!formData.time) {
      newErrors.time = 'Please select a viewing time';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\(\d{3}\)\s\d{3}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (e.g., (555) 123-4567)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format phone number
    if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '');
      const formatted = cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      await viewingService.create({
        propertyId: property.id,
        propertyTitle: property.title,
        propertyAddress: `${property.address}, ${property.city}, ${property.state}`,
        ...formData,
        status: 'Scheduled',
        scheduledAt: new Date().toISOString()
      });

      toast.success('Viewing scheduled successfully! You will receive a confirmation email shortly.');
      onSuccess();
    } catch (error) {
      toast.error('Failed to schedule viewing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-6 border-t border-gray-200 pt-6"
    >
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-secondary/10 rounded-lg">
            <ApperIcon name="Calendar" className="text-secondary" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Schedule a Viewing</h3>
            <p className="text-gray-600 text-sm">Choose your preferred date and time</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date and Time Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={getMinDate()}
                max={getMaxDate()}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Time *
              </label>
              <select
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                  errors.time ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              {errors.time && (
                <p className="mt-1 text-sm text-red-600">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="(555) 123-4567"
              maxLength="14"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Message (Optional)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={3}
              placeholder="Any specific questions or requirements for the viewing..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                isSubmitting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-secondary text-white hover:bg-secondary/90'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Scheduling...
                </>
              ) : (
                <>
                  <ApperIcon name="Calendar" size={18} />
                  Schedule Viewing
                </>
              )}
            </motion.button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <ApperIcon name="Info" className="text-blue-600 mt-0.5" size={16} />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">What to expect:</p>
              <ul className="space-y-1 text-xs">
                <li>• You'll receive a confirmation email with viewing details</li>
                <li>• Our agent will contact you 24 hours before the viewing</li>
                <li>• Please bring a valid ID and be on time</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ScheduleViewingForm;