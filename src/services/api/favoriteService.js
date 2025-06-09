import { delay } from '../index';

const STORAGE_KEY = 'propertyvue_favorites';

const loadFavorites = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error('Failed to load favorites:', err);
    return [];
  }
};

const saveFavorites = (favorites) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (err) {
    console.error('Failed to save favorites:', err);
  }
};

let favorites = loadFavorites();

const favoriteService = {
  async getAll() {
    await delay(200);
    return [...favorites];
  },

  async getById(propertyId) {
    await delay(150);
    const favorite = favorites.find(f => f.propertyId === propertyId);
    if (!favorite) {
      throw new Error('Favorite not found');
    }
    return { ...favorite };
  },

  async create(favoriteData) {
    await delay(300);
    
    // Check if already exists
    const existingIndex = favorites.findIndex(f => f.propertyId === favoriteData.propertyId);
    if (existingIndex !== -1) {
      throw new Error('Property is already in favorites');
    }

    const newFavorite = {
      ...favoriteData,
      id: Date.now().toString(),
      savedDate: new Date().toISOString()
    };
    
    favorites.push(newFavorite);
    saveFavorites(favorites);
    return { ...newFavorite };
  },

  async update(propertyId, updates) {
    await delay(250);
    const index = favorites.findIndex(f => f.propertyId === propertyId);
    if (index === -1) {
      throw new Error('Favorite not found');
    }
    favorites[index] = { ...favorites[index], ...updates };
    saveFavorites(favorites);
    return { ...favorites[index] };
  },

  async delete(propertyId) {
    await delay(200);
    const index = favorites.findIndex(f => f.propertyId === propertyId);
    if (index === -1) {
      throw new Error('Favorite not found');
    }
    const deleted = favorites.splice(index, 1)[0];
    saveFavorites(favorites);
    return { ...deleted };
  }
};

export default favoriteService;