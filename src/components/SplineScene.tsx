'use client';

import React, { useState, useEffect } from 'react';

interface SplineSceneProps {
  scene?: string;
  className?: string;
  onFormOpen?: () => void;
}

export default function SplineScene({
  scene = "https://my.spline.design/reactiveorb-HuQp0OnanWqeCmQ4YAF747up/",
  className = "",
  onFormOpen
}: SplineSceneProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setHasError(true);
        setIsLoading(false);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timer);
  }, [isLoading]);

  // Listen for messages from the Spline iframe to handle link clicks
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Check if the message is from the Spline iframe and has the expected data
      if (event.data && event.data.type === 'SPLINE_LINK_CLICK') {
        if (onFormOpen) {
          onFormOpen();
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onFormOpen]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-10">
          <div className="text-white text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm">Loading 3D experience...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm z-10">
          <div className="text-white text-center p-6">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">3D Experience Unavailable</h3>
            <p className="text-sm text-gray-300 mb-4">
              We're having trouble loading the interactive 3D experience. Please check your connection and try again.
            </p>
            <button
              onClick={() => {
                setIsLoading(true);
                setHasError(false);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Spline 3D Scene using iframe */}
      <div className="w-full h-full scale-[1.1] md:scale-[3.2] origin-center transition-transform duration-300">
        <iframe
          src={scene}
          className="w-full h-full border-none"
          onLoad={handleLoad}
          onError={handleError}
          title="Robofy 3D Experience"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share; webgl; xr-spatial-tracking"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          sandbox="allow-scripts allow-same-origin allow-presentation"
          loading="eager"
          style={{
            background: 'transparent',
            display: 'block',
            width: '100%',
            height: '100%',
            minHeight: '100vh'
          }}
        />
      </div>
    </div>
  );
}