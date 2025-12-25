'use client';

import MovieCard from './MovieCard';

export default function MovieGrid({ movies, onMovieClick, isLoading }) {
  if (isLoading && movies.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        {Array.from({ length: 12 }).map((_, idx) => (
          <div
            key={idx}
            className="aspect-[2/3] bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <svg
          className="w-16 h-16 text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 4v16m0-16a2 2 0 012-2h10a2 2 0 012 2v16m-12 0H5a2 2 0 01-2-2v-5m0 0h18m-18 0v5a2 2 0 002 2h18a2 2 0 002-2v-5"
          />
        </svg>
        <p className="text-gray-500 text-lg">No movies found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
      {movies.map((movie) => (
        <div key={movie.id} className="animate-fadeIn">
          <MovieCard movie={movie} onClick={onMovieClick} />
        </div>
      ))}
    </div>
  );
}
