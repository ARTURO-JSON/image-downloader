'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import MovieSearchBar from '@/components/MovieSearchBar';
import MovieCategoryBar from '@/components/MovieCategoryBar';
import MovieGrid from '@/components/MovieGrid';
import MovieModal from '@/components/MovieModal';
import {
  fetchTrendingMovies,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchMoviesByCategory,
  fetchMoviesBySearch,
} from '@/lib/fetchMovies';

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch movies based on category or search
  const fetchMovies = useCallback(async (category, query, pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      let data;
      if (query) {
        data = await fetchMoviesBySearch(query, pageNum);
      } else {
        switch (category) {
          case 'trending':
            data = await fetchTrendingMovies(pageNum);
            break;
          case 'popular':
            data = await fetchPopularMovies(pageNum);
            break;
          case 'top':
            data = await fetchTopRatedMovies(pageNum);
            break;
          default:
            data = await fetchMoviesByCategory(category, pageNum);
        }
      }

      if (append) {
        setMovies((prev) => [...prev, ...(data.results || [])]);
      } else {
        setMovies(data.results || []);
      }
      setHasMore(data.page < data.total_pages);
      setPage(data.page);
    } catch (err) {
      setError('Failed to load movies. Please try again.');
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchMovies(selectedCategory, searchQuery);
  }, [selectedCategory, fetchMovies]);

  // Handle category change
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
    setPage(1);
    fetchMovies(category, '', 1);
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
    fetchMovies(selectedCategory, query, 1);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchMovies(selectedCategory, searchQuery, page + 1, true);
    }
  };

  // Handle movie click
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            ARTURO.JSX
          </Link>
          <div className="flex gap-6">
            <Link
              href="/"
              className="text-slate-400 hover:text-white font-medium transition-colors"
            >
              Images
            </Link>
            <Link
              href="/movies"
              className="text-white font-medium"
            >
              Movies
            </Link>
            <Link
              href="/design-assets"
              className="text-slate-400 hover:text-white font-medium transition-colors"
            >
              Design Assets
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative py-12 md:py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Discover Movies
          </h1>
          <p className="text-slate-400 text-center mb-8 text-lg">
            Explore trending, popular, and top-rated movies from around the world
          </p>
          <div className="max-w-2xl mx-auto">
            <MovieSearchBar onSearch={handleSearch} initialValue={searchQuery} />
          </div>
        </div>
      </header>

      {/* Category Bar */}
      <div className="sticky top-[73px] z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <MovieCategoryBar
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Results Header */}
        {searchQuery && (
          <div className="mb-6">
            <h2 className="text-xl text-slate-300">
              Search results for: <span className="text-white font-semibold">"{searchQuery}"</span>
            </h2>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Movie Grid */}
        <MovieGrid
          movies={movies}
          onMovieClick={handleMovieClick}
          isLoading={loading}
        />

        {/* Load More Button */}
        {!loading && movies.length > 0 && hasMore && (
          <div className="flex justify-center mt-10">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Loading...
                </span>
              ) : (
                'Load More Movies'
              )}
            </button>
          </div>
        )}

        {/* No Results */}
        {!loading && movies.length === 0 && !error && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-white mb-2">No movies found</h3>
            <p className="text-slate-400">Try a different search term or category</p>
          </div>
        )}
      </main>

      {/* Movie Modal */}
      <MovieModal
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={handleCloseModal}
      />
    </div>
  );
}
