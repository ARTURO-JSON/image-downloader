'use client';

import Image from 'next/image';

export default function MovieCard({ movie, onClick }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/movie-placeholder.svg';

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <div
      className="group relative overflow-hidden rounded-xl bg-slate-800 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20"
      onClick={() => onClick(movie)}
    >
      {/* Poster */}
      <div className="aspect-[2/3] relative overflow-hidden">
        <Image
          src={posterUrl}
          alt={movie.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16.67vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Rating Badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full">
          <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
          <span className="text-white text-xs font-bold">{rating}</span>
        </div>

        {/* Hover Content */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="font-bold text-white text-sm leading-tight mb-1 line-clamp-2 drop-shadow-lg">
            {movie.title}
          </h3>
          <p className="text-slate-300 text-xs">{releaseYear}</p>
        </div>
      </div>

      {/* Bottom Info (always visible on mobile) */}
      <div className="p-3 md:hidden">
        <h3 className="font-semibold text-white text-sm leading-tight line-clamp-1">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-slate-400 text-xs">{releaseYear}</span>
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            <span className="text-slate-300 text-xs font-medium">{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
