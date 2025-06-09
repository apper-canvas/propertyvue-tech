import propertyService from './api/propertyService';
import favoriteService from './api/favoriteService';
import contactService from './api/contactService';
import neighborhoodService from './api/neighborhoodService';

// Utility function for simulating network delays
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Export all services
export {
  propertyService,
  favoriteService,
  contactService,
  neighborhoodService
};