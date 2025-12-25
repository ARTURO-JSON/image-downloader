'use client';

import ImageCard from './ImageCard';

export default function ImageGrid({ images, onImageClick }) {
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No images found. Try a different search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {images.map((image) => (
        <ImageCard key={image.id} image={image} onClick={onImageClick} />
      ))}
    </div>
  );
}

