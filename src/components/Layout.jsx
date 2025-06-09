import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './ApperIcon';
import { routeArray } from '../config/routes';
import { favoriteService } from '../services';

const Layout = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    loadFavoritesCount();
  }, [location]);

  const loadFavoritesCount = async () => {
    try {
      const favorites = await favoriteService.getAll();
      setFavoritesCount(favorites.length);
    } catch (err) {
      console.error('Failed to load favorites count:', err);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 z-40">
        <div className="container mx-auto px-4 max-w-full">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2"
              >
                <ApperIcon name="Home" className="text-primary" size={28} />
                <span className="text-xl font-heading font-semibold text-gray-900">
                  PropertyVue
                </span>
              </motion.div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {routeArray.map(route => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} size={16} />
                  {route.label}
                  {route.id === 'favorites' && favoritesCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-1"
                    >
                      {favoritesCount}
                    </motion.span>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={closeMobileMenu}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-64 h-full bg-white shadow-xl z-50 md:hidden"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Home" className="text-primary" size={24} />
                    <span className="font-heading font-semibold text-gray-900">
                      PropertyVue
                    </span>
                  </div>
                  <button
                    onClick={closeMobileMenu}
                    className="p-1 rounded-lg text-gray-600 hover:bg-gray-100"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
              </div>
              
              <nav className="p-4 space-y-2">
                {routeArray.map(route => (
                  <NavLink
                    key={route.id}
                    to={route.path}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors w-full ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                      }`
                    }
                  >
                    <ApperIcon name={route.icon} size={18} />
                    {route.label}
                    {route.id === 'favorites' && favoritesCount > 0 && (
                      <span className="bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-auto">
                        {favoritesCount}
                      </span>
                    )}
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Tab Navigation (Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-4 h-16">
          {routeArray.map(route => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors relative ${
                  isActive
                    ? 'text-primary'
                    : 'text-gray-600'
                }`
              }
            >
              <ApperIcon name={route.icon} size={20} />
              <span className="text-xs">{route.label}</span>
              {route.id === 'favorites' && favoritesCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                >
                  {favoritesCount > 9 ? '9+' : favoritesCount}
                </motion.span>
              )}
            </NavLink>
          ))}
        </div>
      </div>

{/* Main Content */}
      <main className="flex-1 overflow-y-auto scrollbar-theme pb-16 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;