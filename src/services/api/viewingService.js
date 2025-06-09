// Local delay function to avoid circular dependency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock viewing data
let viewings = [
  {
    id: '1',
    propertyId: '1',
    propertyTitle: 'Modern Downtown Condo',
    propertyAddress: '123 Main Street, Downtown, NY',
    date: '2024-01-15',
    time: '2:00 PM',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    message: 'Interested in seeing the balcony view',
    status: 'Scheduled',
    scheduledAt: '2024-01-10T10:30:00.000Z'
  },
  {
    id: '2',
    propertyId: '2',
    propertyTitle: 'Family Suburban Home',
    propertyAddress: '456 Oak Avenue, Suburbia, NY',
    date: '2024-01-16',
    time: '10:00 AM',
    name: 'Michael Davis',
    email: 'michael.davis@email.com',
    phone: '(555) 987-6543',
    message: 'Looking at the backyard space for kids',
    status: 'Confirmed',
    scheduledAt: '2024-01-11T14:15:00.000Z'
  }
];

const viewingService = {
  async getAll() {
    await delay(300);
    return [...viewings];
  },

  async getById(id) {
    await delay(200);
    const viewing = viewings.find(v => v.id === id);
    if (!viewing) {
      throw new Error('Viewing not found');
    }
    return { ...viewing };
  },

  async getByPropertyId(propertyId) {
    await delay(250);
    const propertyViewings = viewings.filter(v => v.propertyId === propertyId);
    return [...propertyViewings];
  },

  async create(viewingData) {
    await delay(400);
    const newViewing = {
      ...viewingData,
      id: Date.now().toString(),
      scheduledAt: new Date().toISOString(),
      status: 'Scheduled'
    };
    viewings.push(newViewing);
    return { ...newViewing };
  },

  async update(id, updates) {
    await delay(350);
    const index = viewings.findIndex(v => v.id === id);
    if (index === -1) {
      throw new Error('Viewing not found');
    }
    viewings[index] = { ...viewings[index], ...updates };
    return { ...viewings[index] };
  },

  async delete(id) {
    await delay(250);
    const index = viewings.findIndex(v => v.id === id);
    if (index === -1) {
      throw new Error('Viewing not found');
    }
    const deleted = viewings.splice(index, 1)[0];
    return { ...deleted };
  },

  async updateStatus(id, status) {
    await delay(300);
    const index = viewings.findIndex(v => v.id === id);
    if (index === -1) {
      throw new Error('Viewing not found');
    }
    viewings[index] = { 
      ...viewings[index], 
      status,
      updatedAt: new Date().toISOString()
    };
    return { ...viewings[index] };
  }
};

// Export both named and default exports
export { viewingService };
export default viewingService;