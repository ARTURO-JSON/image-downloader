'use client';

import Image from 'next/image';

/**
 * MovieCard Component
 * 
 * Displays a single movie card in the grid with poster, rating, and hover effects
 * Shows title and release year on hover (desktop) or always visible (mobile)
 * Clickable to open detailed movie modal
 * 
 * Props:
 * - movie: Movie object from TMDB API containing poster_path, title, release_date, vote_average
 * - onClick: Callback function when user clicks the card
 */
export default function MovieCard({ movie, onClick }) {
  // Build poster URL from TMDB image service, fallback to placeholder
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/movie-placeholder.svg';

  // Extract release year from date string
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  
  // Format rating to one decimal place
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <div
      className="movie-card group relative overflow-hidden rounded-xl bg-white shadow-md cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary-500/20"
      onClick={() => onClick(movie)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(movie);
        }
      }}
      aria-label={`View details for movie: ${movie.title}`}
    >
      {/* Movie poster image */}
      <div className="movie-poster-container aspect-[2/3] relative overflow-hidden">
        <Image
          src={posterUrl}
          alt={movie.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16.67vw"
          className="movie-poster object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Dark gradient overlay on hover for better text readability */}
        <div className="movie-overlay absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Star rating badge - top right corner */}
        <div className="rating-badge absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full">
          {/* Star icon */}
          <svg className="star-icon w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
          {/* Rating score */}
          <span className="rating-score text-white text-xs font-bold">{rating}</span>
        </div>

        {/* Hover content - slides in from bottom on desktop */}
        <div className="movie-info-hover absolute inset-x-0 bottom-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          {/* Movie title */}
          <h3 className="movie-title font-bold text-white text-sm leading-tight mb-1 line-clamp-2 drop-shadow-lg">
            {movie.title}
          </h3>
          {/* Release year */}
          <p className="release-year text-slate-300 text-xs">{releaseYear}</p>
        </div>
      </div>

      {/* Mobile bottom info - always visible on small screens */}
      <div className="movie-info-mobile p-3 md:hidden bg-white">
        {/* Title */}
        <h3 className="movie-title font-semibold text-gray-900 text-sm leading-tight line-clamp-1">
          {movie.title}
        </h3>
        {/* Release year and rating on mobile */}
        <div className="flex items-center justify-between mt-1">
          <span className="release-year text-gray-500 text-xs">{releaseYear}</span>
          <div className="rating-container flex items-center gap-1">
            <svg className="star-icon w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            <span className="rating-score text-gray-600 text-xs font-medium">{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
