import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './ApperIcon';

const ImageGallery = ({ images, initialIndex = 0, propertyTitle, className = "" }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const touchStartRef = useRef(null);

  useEffect(() => {
    setCurrentImageIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      setZoomLevel(1);
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isFullscreen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isFullscreen) return;
      
      switch (e.key) {
        case 'Escape':
          setIsFullscreen(false);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevImage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextImage();
          break;
        case '+':
        case '=':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case '0':
          e.preventDefault();
          resetZoom();
          break;
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [isFullscreen]);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
    setZoomLevel(1);
    setIsLoading(true);
    setHasError(false);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
    setZoomLevel(1);
    setIsLoading(true);
    setHasError(false);
  }, [images.length]);

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 0.5));
  };

  const resetZoom = () => {
    setZoomLevel(1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Mouse wheel zoom
  const handleWheel = useCallback((e) => {
    if (!isFullscreen) return;
    
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setZoomLevel(prev => Math.max(0.5, Math.min(3, prev + delta)));
  }, [isFullscreen]);

  // Touch gestures
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now()
      };
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchStartRef.current || e.changedTouches.length !== 1) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;
    
    // Swipe detection
    if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 100 && deltaTime < 300) {
      if (deltaX > 0) {
        prevImage();
      } else {
        nextImage();
      }
    }
    
    touchStartRef.current = null;
  };

  // Drag for zoomed images
  const handleMouseDown = (e) => {
    if (zoomLevel <= 1) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      scrollLeft: containerRef.current?.scrollLeft || 0,
      scrollTop: containerRef.current?.scrollTop || 0
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !dragStart) return;
    
    e.preventDefault();
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    if (containerRef.current) {
      containerRef.current.scrollLeft = dragStart.scrollLeft - deltaX;
      containerRef.current.scrollTop = dragStart.scrollTop - deltaY;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  const currentImage = images[currentImageIndex];

  const galleryContent = (
    <div 
      className={`relative ${isFullscreen ? 'h-screen' : 'h-96'} bg-gray-100 overflow-hidden ${className}`}
      ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
          />
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-500">
          <ApperIcon name="ImageOff" size={48} className="mb-2" />
          <p>Failed to load image</p>
        </div>
      )}

      {/* Main Image */}
      <motion.img
        ref={imageRef}
        src={currentImage}
        alt={`${propertyTitle} - Image ${currentImageIndex + 1}`}
        className={`w-full h-full object-cover transition-transform duration-200 ${
          zoomLevel > 1 ? 'cursor-grab' : 'cursor-default'
        } ${isDragging ? 'cursor-grabbing' : ''}`}
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'center center'
        }}
        onLoad={handleImageLoad}
        onError={handleImageError}
        draggable={false}
        initial={{ opacity: 0 }}
        animate={{ opacity: hasError ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Navigation Arrows */}
      {images.length > 1 && !isDragging && (
        <>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
          >
            <ApperIcon name="ChevronLeft" size={24} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
          >
            <ApperIcon name="ChevronRight" size={24} />
          </motion.button>
        </>
      )}

      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        {/* Zoom Controls */}
        {isFullscreen && (
          <div className="flex items-center gap-1 bg-black/50 rounded-lg p-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={zoomOut}
              disabled={zoomLevel <= 0.5}
              className="p-1 text-white hover:bg-white/20 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ApperIcon name="Minus" size={16} />
            </motion.button>
            
            <span className="text-white text-sm px-2 min-w-[3rem] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={zoomIn}
              disabled={zoomLevel >= 3}
              className="p-1 text-white hover:bg-white/20 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ApperIcon name="Plus" size={16} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={resetZoom}
              className="p-1 text-white hover:bg-white/20 rounded ml-1"
              title="Reset zoom"
            >
              <ApperIcon name="RotateCcw" size={16} />
            </motion.button>
          </div>
        )}

        {/* Fullscreen Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleFullscreen}
          className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          <ApperIcon name={isFullscreen ? "Minimize2" : "Maximize2"} size={18} />
        </motion.button>

        {/* Close button (fullscreen only) */}
        {isFullscreen && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsFullscreen(false)}
            className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
          >
            <ApperIcon name="X" size={18} />
          </motion.button>
        )}
      </div>

      {/* Image Counter */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
        {currentImageIndex + 1} of {images.length}
      </div>

      {/* Zoom Instructions (fullscreen only) */}
      {isFullscreen && zoomLevel === 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-3 py-2 rounded-lg max-w-xs"
        >
          Use mouse wheel or +/- keys to zoom • Arrow keys to navigate • ESC to exit
        </motion.div>
      )}
    </div>
  );

  // Thumbnail Navigation
  const thumbnailNavigation = images.length > 1 && (
    <div className="p-4 border-b border-gray-200">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {images.map((image, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setCurrentImageIndex(index);
              setZoomLevel(1);
              setIsLoading(true);
              setHasError(false);
            }}
            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
              index === currentImageIndex
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-[9999] flex flex-col"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsFullscreen(false);
            }
          }}
        >
          {galleryContent}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div>
      {galleryContent}
      {thumbnailNavigation}
    </div>
  );
};

export default ImageGallery;