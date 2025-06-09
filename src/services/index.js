import propertyService from './api/propertyService';
import favoriteService from './api/favoriteService';
import contactService from './api/contactService';

// Utility function for simulating network delays
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Export all services
export {
  propertyService,
  favoriteService,
  contactService
};