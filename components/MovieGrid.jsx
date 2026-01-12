'use client';

import MovieCard from './MovieCard';

export default function MovieGrid({ movies, onMovieClick, isLoading }) {
  if (isLoading && movies.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {Array.from({ length: 18 }).map((_, idx) => (
          <div
            key={idx}
            className="aspect-[2/3] bg-slate-700/50 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">🎬</div>
        <p className="text-slate-400 text-lg">No movies found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {movies.map((movie) => (
        <div key={movie.id} className="animate-fadeIn">
          <MovieCard movie={movie} onClick={onMovieClick} />
        </div>
      ))}
    </div>
  );
}
