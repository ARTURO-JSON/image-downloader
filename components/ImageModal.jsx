'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { downloadImage } from '@/lib/downloadImage';

export default function ImageModal({ image, onClose }) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!image) return null;

  const handleDownload = () => {
    downloadImage(
      image.full || image.url, 
      image.id, 
      image.source || 'unsplash',
      image.downloadLocation // Pass Unsplash download location for production API requirement
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg p-4 animate-fadeIn"
      onClick={onClose}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div
        className="relative w-full max-w-6xl h-full max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all duration-200 hover:scale-110 backdrop-blur-md border border-white/20"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Main Image Container - HD Display */}
        <div className="flex-1 relative overflow-hidden rounded-2xl mb-6 shadow-2xl group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/20 z-10 pointer-events-none"></div>
          <Image
            src={image.full || image.url}
            alt={image.description}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            sizes="100vw"
            priority
            quality={95}
          />
          
          {/* HD Badge */}
          <div className="absolute bottom-4 right-4 z-20 bg-blue-600/90 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold border border-blue-400/50">
            📸 HD Quality
          </div>
        </div>

        {/* Info and Download Section */}
        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Info Section */}
            <div className="flex-1">
              <h3 className="text-white text-2xl font-bold mb-3 leading-tight">
                {image.description}
              </h3>
              
              {/* Photographer and Unsplash Attribution */}
              <div className="space-y-2 mb-4">
                <p className="text-white/90 text-base flex items-center gap-2">
                  <span className="text-lg">📷</span>
                  Photo by{' '}
                  <a
                    href={image.photographerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline hover:text-blue-300 transition-colors font-semibold"
                  >
                    {image.photographer}
                  </a>
                </p>
                <p className="text-white/90 text-base flex items-center gap-2">
                  <span className="text-lg">🌐</span>
                  on{' '}
                  <a
                    href="https://unsplash.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline hover:text-blue-300 transition-colors font-semibold"
                  >
                    Unsplash
                  </a>
                </p>
              </div>
              
              {/* Image Dimensions */}
              <p className="text-white/70 text-sm flex items-center gap-2">
                <span>📐</span>
                {image.width} × {image.height} pixels
              </p>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-110 hover:shadow-2xl shadow-lg flex items-center justify-center gap-3 whitespace-nowrap border border-blue-400/50 backdrop-blur-sm"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download HD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

