// Local delay utility to avoid circular dependency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock neighborhood data that would typically come from external APIs
const mockSchools = [
  {
    id: 'school-1',
    name: 'Washington Elementary School',
    type: 'Elementary',
    rating: 4.2,
    distance: '0.3 miles',
    website: 'https://example.com/schools'
  },
  {
    id: 'school-2',
    name: 'Lincoln Middle School',
    type: 'Middle School',
    rating: 3.8,
    distance: '0.5 miles',
    website: 'https://example.com/schools'
  },
  {
    id: 'school-3',
    name: 'Roosevelt High School',
    type: 'High School',
    rating: 4.0,
    distance: '0.7 miles',
    website: 'https://example.com/schools'
  },
  {
    id: 'school-4',
    name: 'Jefferson Academy',
    type: 'Private School',
    rating: 4.6,
    distance: '1.2 miles',
    website: 'https://example.com/schools'
  }
];

const mockTransit = [
  {
    id: 'transit-1',
    name: 'Main St & 5th Ave',
    type: 'Bus Stop',
    lines: ['Route 42', 'Route 15'],
    walkTime: '3 min',
    mapUrl: 'https://example.com/transit-map'
  },
  {
    id: 'transit-2',
    name: 'Central Station',
    type: 'Train Station',
    lines: ['Blue Line', 'Red Line'],
    walkTime: '8 min',
    mapUrl: 'https://example.com/transit-map'
  },
  {
    id: 'transit-3',
    name: 'Oak Street Bus Hub',
    type: 'Bus Hub',
    lines: ['Route 7', 'Route 23', 'Route 56'],
    walkTime: '5 min',
    mapUrl: 'https://example.com/transit-map'
  }
];

const mockPointsOfInterest = [
  {
    id: 'poi-1',
    name: "Tony's Italian Bistro",
    category: 'Restaurant',
    distance: '0.2 miles',
    rating: 4.5
  },
  {
    id: 'poi-2',
    name: 'FreshMart Grocery',
    category: 'Grocery',
    distance: '0.4 miles',
    rating: 4.1
  },
  {
    id: 'poi-3',
    name: 'Riverside Park',
    category: 'Park',
    distance: '0.6 miles',
    rating: 4.3
  },
  {
    id: 'poi-4',
    name: 'St. Mary\'s Hospital',
    category: 'Hospital',
    distance: '0.8 miles',
    rating: 3.9
  },
  {
    id: 'poi-5',
    name: 'Westfield Shopping Center',
    category: 'Shopping',
    distance: '1.1 miles',
    rating: 4.2
  },
  {
    id: 'poi-6',
    name: 'FitLife Gym',
    category: 'Gym',
    distance: '0.3 miles',
    rating: 4.0
  }
];

const neighborhoodService = {
  async getSchools(latitude, longitude) {
    await delay(400);
    
    // Simulate API failure occasionally for testing
    if (Math.random() < 0.1) {
      throw new Error('Schools data temporarily unavailable');
    }
    
    // Return a subset based on location (mock behavior)
    const nearbySchools = mockSchools.slice(0, Math.floor(Math.random() * 4) + 1);
    return nearbySchools.map(school => ({ ...school }));
  },

  async getTransit(latitude, longitude) {
    await delay(350);
    
    // Simulate API failure occasionally for testing
    if (Math.random() < 0.1) {
      throw new Error('Transit data temporarily unavailable');
    }
    
    // Return a subset based on location (mock behavior)
    const nearbyTransit = mockTransit.slice(0, Math.floor(Math.random() * 3) + 1);
    return nearbyTransit.map(stop => ({ ...stop }));
  },

  async getPointsOfInterest(latitude, longitude) {
    await delay(300);
    
    // Simulate API failure occasionally for testing
    if (Math.random() < 0.1) {
      throw new Error('Points of interest data temporarily unavailable');
    }
    
    // Return a subset based on location (mock behavior)
    const nearbyPOI = mockPointsOfInterest.slice(0, Math.floor(Math.random() * 5) + 2);
    return nearbyPOI.map(poi => ({ ...poi }));
  },

  async getAll(latitude, longitude) {
    await delay(500);
    
    try {
      const [schools, transit, pointsOfInterest] = await Promise.all([
        this.getSchools(latitude, longitude),
        this.getTransit(latitude, longitude),
        this.getPointsOfInterest(latitude, longitude)
      ]);
      
      return {
        schools,
        transit,
        pointsOfInterest
      };
    } catch (error) {
      throw new Error('Failed to load neighborhood data');
    }
  }
};

export default neighborhoodService;
export { neighborhoodService };