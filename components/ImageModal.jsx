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
    downloadImage(image.full || image.url, image.id, image.source || 'unsplash');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-7xl max-h-[90vh] w-full h-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 transition-all duration-200 hover:scale-110"
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

        {/* Image Container */}
        <div className="flex-1 relative overflow-hidden rounded-lg mb-4">
          <Image
            src={image.url || image.full}
            alt={image.description}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {/* Info and Download Section */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-white text-xl font-semibold mb-2">
              {image.description}
            </h3>
            {/* Photographer and Unsplash Attribution */}
            <p className="text-white text-sm opacity-90">
              Photo by{' '}
              <a
                href={image.photographerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-75 transition-opacity font-medium"
              >
                {image.photographer}
              </a>
              {' '}on{' '}
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-75 transition-opacity font-medium"
              >
                Unsplash
              </a>
            </p>
            <p className="text-white text-xs opacity-75 mt-1">
              {image.width} × {image.height}
            </p>
          </div>

          <button
            onClick={handleDownload}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
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
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

