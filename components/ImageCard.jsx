'use client';

import Image from 'next/image';
import { useState } from 'react';

/**
 * ImageCard Component
 * 
 * Displays a single image in a grid layout with photographer information
 * Shows details on hover with smooth animation
 * Clickable to open full modal view
 * 
 * Props:
 * - image: Image object containing url, id, photographer, description, etc.
 * - onClick: Callback function when user clicks the card
 */
export default function ImageCard({ image, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="image-card relative overflow-hidden rounded-lg bg-gray-100 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      onClick={() => onClick(image)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(image);
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`View image: ${image.description}`}
    >
      {/* Image container with fixed aspect ratio */}
      <div className="image-container aspect-square relative">
        <Image
          src={image.full || image.url}
          alt={image.description}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="image-thumbnail object-cover transition-transform duration-300 hover:scale-110"
          loading="lazy"
          quality={90}
          priority={false}
        />
      </div>
      
      {/* Overlay that appears on hover */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end z-10">
          {/* Photographer info */}
          <div className="w-full p-4 text-white">
            {/* Image title/description */}
            <p className="text-sm font-medium truncate mb-2">
              {image.description}
            </p>
            
            {/* Photographer and Unsplash attribution */}
            <div className="text-xs space-y-1 text-white">
              <p className="text-white">
                by{' '}
                <a
                  href={image.photographerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline hover:opacity-75 transition-opacity font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  {image.photographer}
                </a>
              </p>
              <p className="text-white">
                on{' '}
                <a
                  href="https://unsplash.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline hover:opacity-75 transition-opacity font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  Unsplash
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

