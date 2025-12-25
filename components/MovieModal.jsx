'use client';

import { useEffect } from 'react';
import Image from 'next/image';

const downloadQualities = [
  { quality: '360p', bitrate: '500MB' },
  { quality: '480p', bitrate: '750MB' },
  { quality: '720p', bitrate: '1.2GB' },
  { quality: '1080p', bitrate: '2.5GB' },
];

export default function MovieModal({ movie, isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !movie) return null;

  const posterUrl = movie.poster_path
    ? `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : '/movie-placeholder.svg';

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  const handleDownload = (quality) => {
    // Simulated download - placeholder link
    const link = document.createElement('a');
    link.href = `#download-${movie.id}-${quality}`;
    link.download = `${movie.title}-${quality}.mp4`;
    // In a real app, this would link to actual content
    alert(`Download simulated for ${movie.title} - ${quality}\n\nNote: This is a placeholder. Real content download would happen here.`);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
          >
            <svg
              className="w-6 h-6 text-gray-600"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8">
            {/* Left side - Poster */}
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-sm aspect-[2/3] rounded-lg overflow-hidden shadow-lg mb-6">
                <Image
                  src={posterUrl}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => {
                    e.target.src = '/movie-placeholder.svg';
                  }}
                />
              </div>
            </div>

            {/* Right side - Details */}
            <div className="flex flex-col">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{movie.title}</h2>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5 fill-yellow-400" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                  <span className="text-lg font-semibold text-gray-900">{rating}</span>
                </div>
                <span className="text-gray-600">|</span>
                <span className="text-gray-600">{releaseYear}</span>
              </div>

              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                {movie.overview || 'No description available'}
              </p>

              {movie.genres && movie.genres.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Genres</p>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Download Quality Selection */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  Select Download Quality
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {downloadQualities.map((item) => (
                    <button
                      key={item.quality}
                      onClick={() => handleDownload(item.quality)}
                      className="px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 text-center"
                    >
                      <div className="font-semibold text-gray-900">
                        {item.quality}
                      </div>
                      <div className="text-xs text-gray-500">{item.bitrate}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Download Now Button */}
              <button
                onClick={() => handleDownload('720p')}
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Download Now (720p)
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                This is a simulated download. Educational purposes only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
