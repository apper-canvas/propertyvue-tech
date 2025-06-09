import propertiesData from '../mockData/properties.json';

// Local delay function to avoid circular dependency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let properties = [...propertiesData];

const propertyService = {
  async getAll() {
    await delay(300);
    return [...properties];
  },

  async getById(id) {
    await delay(200);
    const property = properties.find(p => p.id === id);
    if (!property) {
      throw new Error('Property not found');
    }
    return { ...property };
  },

  async create(propertyData) {
    await delay(400);
    const newProperty = {
      ...propertyData,
      id: Date.now().toString(),
      listedDate: new Date().toISOString(),
      status: 'Available',
      latitude: propertyData.latitude || 40.7128 + (Math.random() - 0.5) * 0.1,
      longitude: propertyData.longitude || -74.0060 + (Math.random() - 0.5) * 0.1,
      agent: {
        name: 'John Smith',
        email: 'john.smith@propertyvue.com',
        phone: '(555) 123-4567',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      }
    };
    properties.push(newProperty);
    return { ...newProperty };
  },

  async update(id, updates) {
    await delay(350);
    const index = properties.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }
    properties[index] = { ...properties[index], ...updates };
    return { ...properties[index] };
  },

  async delete(id) {
    await delay(250);
    const index = properties.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }
    const deleted = properties.splice(index, 1)[0];
    return { ...deleted };
  }
};

// Export both named and default exports
export { propertyService };
export default propertyService;