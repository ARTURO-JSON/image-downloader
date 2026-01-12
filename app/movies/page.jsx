'use client';

import { useState, useEffect } from 'react';
import MovieSearchBar from '@/components/MovieSearchBar';
import MovieCategoryBar from '@/components/MovieCategoryBar';
import MovieGrid from '@/components/MovieGrid';
import MovieModal from '@/components/MovieModal';
import {
  fetchMoviesBySearch,
  fetchTrendingMovies,
  fetchTopRatedMovies,
  fetchMoviesByCategory,
} from '@/lib/fetchMovies';
import Link from 'next/link';

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('trending');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Initial load and when category changes
  useEffect(() => {
    loadMovies('trending', '', 1, true);
  }, []);

  const loadMovies = async (type, query = '', page = 1, reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setIsLoadingMore(true);
      }

      let data;

      if (type === 'search' && query) {
        data = await fetchMoviesBySearch(query, page);
      } else if (type === 'category') {
        data = await fetchMoviesByCategory(query, page);
      } else if (type === 'top') {
        data = await fetchTopRatedMovies(page);
      } else {
        data = await fetchTrendingMovies(page);
      }

      if (reset) {
        setMovies(data.movies || []);
      } else {
        setMovies((prev) => [...prev, ...(data.movies || [])]);
      }

      setCurrentPage(data.currentPage || page);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Failed to load movies');
      console.error('Error loading movies:', err);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedCategory('search');
    setCurrentPage(1);
    loadMovies('search', query, 1, true);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
    setCurrentPage(1);

    if (
      category === 'trending' ||
      category === 'popular' ||
      category === 'top'
    ) {
      loadMovies(category, '', 1, true);
    } else {
      loadMovies('category', category, 1, true);
    }
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && currentPage < totalPages) {
      const nextPage = currentPage + 1;

      if (selectedCategory === 'search' && searchQuery) {
        loadMovies('search', searchQuery, nextPage, false);
      } else if (
        selectedCategory === 'trending' ||
        selectedCategory === 'popular' ||
        selectedCategory === 'top'
      ) {
        loadMovies(selectedCategory, '', nextPage, false);
      } else {
        loadMovies('category', selectedCategory, nextPage, false);
      }
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            ARTURO.JSX
          </Link>
          <div className="flex gap-6">
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
              href="/design-assets"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Design Assets
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="bg-gradient-to-b from-[#f8fbff] to-white sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            Movie Downloader
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Discover and download your favorite movies
          </p>

          <div className="max-w-2xl mx-auto mb-6">
            <MovieSearchBar onSearch={handleSearch} initialValue={searchQuery} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Bar */}
        <div className="mb-8">
          <MovieCategoryBar
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Movie Grid */}
        <MovieGrid
          movies={movies}
          onMovieClick={handleMovieClick}
          isLoading={loading}
        />

        {/* Load More Button */}
        {!loading && currentPage < totalPages && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoadingMore ? 'Loading...' : 'Load More'}
            </button>
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
