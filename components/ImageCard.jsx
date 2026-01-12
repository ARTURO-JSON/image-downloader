'use client';

import Image from 'next/image';

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
  return (
    <div
      className="image-card group relative overflow-hidden rounded-lg bg-gray-100 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      onClick={() => onClick(image)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(image);
        }
      }}
      aria-label={`View image: ${image.description}`}
    >
      {/* Image container with fixed aspect ratio */}
      <div className="image-container aspect-square relative">
        <Image
          src={image.thumb || image.url}
          alt={image.description}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="image-thumbnail object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      
      {/* Overlay that appears on hover */}
      <div className="image-overlay absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
        {/* Photographer info - slides in from bottom on hover */}
        <div className="image-info w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          {/* Image title/description */}
          <p className="image-title text-white text-sm font-medium truncate">
            {image.description}
          </p>
          
          {/* Photographer name */}
          <p className="photographer-name text-white text-xs opacity-90 mt-1">
            by {image.photographer}
          </p>
        </div>
      </div>
    </div>
  );
}

