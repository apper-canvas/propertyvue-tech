// Central export for all services
export { propertyService } from './api/propertyService.js';
export { contactService } from './api/contactService.js';
export { favoriteService } from './api/favoriteService.js';
export { neighborhoodService } from './api/neighborhoodService.js';
export { mortgageService } from './api/mortgageService.js';
export { viewingService } from './api/viewingService.js';

// Utility function for simulating API delays
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));