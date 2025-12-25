'use client';

import Image from 'next/image';

export default function MovieCard({ movie, onClick }) {
  const posterUrl = movie.poster_path
    ? `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}${movie.poster_path}`
    : '/movie-placeholder.svg';

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <div
      className="group relative overflow-hidden rounded-lg bg-gray-100 cursor-pointer transform transition-all duration-300 md:hover:scale-[1.03] md:hover:shadow-xl"
      onClick={() => onClick(movie)}
    >
      <div className="aspect-[2/3] relative">
        <Image
          src={posterUrl}
          alt={movie.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16.67vw"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/movie-placeholder.svg';
          }}
        />
      </div>

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-4">
        <div className="flex items-center gap-1 text-yellow-400 text-sm font-semibold">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
          {rating}
        </div>

        <div className="text-white">
          <h3 className="font-semibold text-sm leading-tight mb-1 line-clamp-2">
            {movie.title}
          </h3>
          <p className="text-xs opacity-90">{releaseYear}</p>
        </div>
      </div>
    </div>
  );
}
