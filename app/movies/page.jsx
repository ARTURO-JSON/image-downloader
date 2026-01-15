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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

      // API returns movies, currentPage, totalPages
      const movieResults = data.movies || data.results || [];
      const currentPage = data.currentPage || data.page || pageNum;
      const totalPages = data.totalPages || data.total_pages || 1;

      if (append) {
        setMovies((prev) => [...prev, ...movieResults]);
      } else {
        setMovies(movieResults);
      }
      setHasMore(currentPage < totalPages);
      setPage(currentPage);
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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            ARTURO.JSX
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Images
            </Link>
            <Link
              href="/movies"
              className="text-primary-600 font-medium"
            >
              Movies
            </Link>
            <Link
              href="/downloader"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              YouTube Video Downloader
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
            >
              Images
            </Link>
            <Link
              href="/movies"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 rounded-lg text-primary-600 bg-primary-50 font-medium"
            >
              Movies
            </Link>
            <Link
              href="/downloader"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
            >
              YouTube Video Downloader
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-b from-[#f8fbff] to-white">
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            Discover Movies
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Explore trending, popular, and top-rated movies from around the world
          </p>
          <div className="max-w-2xl mx-auto">
            <MovieSearchBar onSearch={handleSearch} initialValue={searchQuery} />
          </div>
        </div>
      </header>

      {/* Category Bar */}
      <div className="bg-white border-b border-gray-100 py-4">
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
            <h2 className="text-xl text-gray-700">
              Search results for: <span className="text-gray-900 font-semibold">"{searchQuery}"</span>
            </h2>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
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
              className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-full hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No movies found</h3>
            <p className="text-gray-600">Try a different search term or category</p>
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
