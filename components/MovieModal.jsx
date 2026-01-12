'use client';

import { useEffect } from 'react';
import Image from 'next/image';

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

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen || !movie) return null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/movie-placeholder.svg';

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Backdrop Image */}
          {backdropUrl && (
            <div className="absolute inset-0 opacity-10">
              <Image
                src={backdropUrl}
                alt=""
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/60" />
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
          >
            <svg
              className="w-6 h-6 text-gray-700"
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

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-6 p-6 md:p-8 overflow-y-auto max-h-[90vh]">
            {/* Left side - Poster */}
            <div className="md:col-span-2 flex flex-col items-center">
              <div className="relative w-full max-w-xs aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shadow-black/20 ring-1 ring-gray-200">
                <Image
                  src={posterUrl}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Right side - Details */}
            <div className="md:col-span-3 flex flex-col">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{movie.title}</h2>

              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-100 rounded-full">
                  <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                  <span className="text-yellow-700 font-bold">{rating}</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{releaseYear}</span>
                {movie.runtime && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{movie.runtime} min</span>
                  </>
                )}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-4 md:line-clamp-none">
                {movie.overview || 'No description available for this movie.'}
              </p>

              {/* Download Section - Coming Soon */}
              <div className="mt-auto">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Download Coming Soon
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Downloading movies is not available now. This feature will be added soon!
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-primary-500">
                    <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Stay tuned for updates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
