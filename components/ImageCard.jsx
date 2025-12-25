'use client';

import Image from 'next/image';

export default function ImageCard({ image, onClick }) {
  return (
    <div
      className="group relative overflow-hidden rounded-lg bg-gray-100 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      onClick={() => onClick(image)}
    >
      <div className="aspect-square relative">
        <Image
          src={image.thumb || image.url}
          alt={image.description}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      
      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
        <div className="w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white text-sm font-medium truncate">
            {image.description}
          </p>
          <p className="text-white text-xs opacity-90 mt-1">
            by {image.photographer}
          </p>
        </div>
      </div>
    </div>
  );
}

