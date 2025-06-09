import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: 'Search',
      title: 'Smart Search',
      description: 'Find properties that match your exact criteria with our advanced search filters'
    },
    {
      icon: 'Map',
      title: 'Map View',
      description: 'Explore neighborhoods and see property locations on an interactive map'
    },
    {
      icon: 'Heart',
      title: 'Save Favorites',
      description: 'Keep track of properties you love and compare them side by side'
    }
  ];

  const quickActions = [
    {
      title: 'Browse All Properties',
      description: 'Explore our complete listing database',
      icon: 'Home',
      action: () => navigate('/browse'),
      color: 'primary'
    },
    {
      title: 'Search Properties',
      description: 'Find specific properties by location or features',
      icon: 'Search',
      action: () => navigate('/search'),
      color: 'secondary'
    },
    {
      title: 'View Map',
      description: 'See properties on an interactive map',
      icon: 'Map',
      action: () => navigate('/map'),
      color: 'accent'
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="min-h-full bg-gradient-to-br from-green-50 via-white to-blue-50">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="mb-8"
            >
              <ApperIcon name="Home" className="w-20 h-20 text-primary mx-auto" />
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-heading font-semibold text-gray-900 mb-6">
              Find Your Perfect{' '}
              <span className="text-primary">Home</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Discover amazing properties with our comprehensive real estate platform. 
              Browse, search, and save your favorite homes all in one place.
            </p>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-lg p-6 cursor-pointer"
                  onClick={action.action}
                >
                  <div className={`w-12 h-12 rounded-lg mb-4 mx-auto flex items-center justify-center ${
                    action.color === 'primary' ? 'bg-primary' :
                    action.color === 'secondary' ? 'bg-secondary' :
                    'bg-accent'
                  }`}>
                    <ApperIcon 
                      name={action.icon} 
                      className="text-white" 
                      size={24} 
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {action.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4 max-w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-heading font-semibold text-gray-900 mb-4">
                Why Choose PropertyVue?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our platform offers everything you need to find and evaluate your next home
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <ApperIcon 
                      name={feature.icon} 
                      className="text-primary" 
                      size={32} 
                    />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary py-16">
          <div className="container mx-auto px-4 text-center max-w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-heading font-semibold text-white mb-4">
                Ready to Find Your Dream Home?
              </h2>
              <p className="text-green-100 mb-8 max-w-2xl mx-auto">
                Start browsing our extensive collection of properties and find the perfect match for your lifestyle
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/browse')}
                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
              >
                <ApperIcon name="ArrowRight" size={20} />
                Start Browsing
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;