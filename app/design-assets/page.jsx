'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AssetSearchBar from '@/components/AssetSearchBar';
import AssetFilters from '@/components/AssetFilters';
import AssetGrid from '@/components/AssetGrid';
import AssetPreviewModal from '@/components/AssetPreviewModal';

/**
 * Design Assets Page
 * Browse and download Freepik-style design assets
 */
export default function DesignAssetsPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('design template');
  const [assetType, setAssetType] = useState('all');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initial load and when filters change
  useEffect(() => {
    loadAssets(searchQuery, assetType, category, 1, true);
  }, [searchQuery, assetType, category, sortBy]);

  /**
   * Load assets from API
   */
  const loadAssets = async (query, type, cat, page, reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setIsLoadingMore(true);
      }

      const response = await fetch(
        `/api/assets/search?query=${encodeURIComponent(query)}&type=${type}&category=${cat}&page=${page}&perPage=20&sort=${sortBy}`
      );

      if (!response.ok) {
        throw new Error('Failed to load assets');
      }

      const data = await response.json();

      if (reset) {
        setAssets(data.assets || []);
      } else {
        setAssets((prev) => [...prev, ...(data.assets || [])]);
      }

      setCurrentPage(data.page || page);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Failed to load assets');
      console.error('Error loading assets:', err);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  /**
   * Handle search
   */
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  /**
   * Handle type filter
   */
  const handleTypeChange = (type) => {
    setAssetType(type);
    setCurrentPage(1);
  };

  /**
   * Handle category filter
   */
  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setCurrentPage(1);
  };

  /**
   * Handle sort
   */
  const handleSort = (sort) => {
    setSortBy(sort);
  };

  /**
   * Load more assets
   */
  const handleLoadMore = () => {
    if (!isLoadingMore && currentPage < totalPages) {
      loadAssets(searchQuery, assetType, category, currentPage + 1, false);
    }
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
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Movies
            </Link>
            <Link
              href="/design-assets"
              className="text-primary-600 font-medium"
            >
              Design Assets
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
              className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
            >
              Movies
            </Link>
            <Link
              href="/design-assets"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 rounded-lg text-primary-600 bg-primary-50 font-medium"
            >
              Design Assets
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Header */}
      <header className="bg-gradient-to-b from-[#f8fbff] to-white sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            Design Assets Library
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Vectors, illustrations, photos, and templates for your creative projects
          </p>

          <div className="max-w-3xl mx-auto">
            <AssetSearchBar onSearch={handleSearch} initialValue={searchQuery} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="sticky top-32 bg-white rounded-xl shadow-md p-6">
              <AssetFilters
                selectedType={assetType}
                selectedCategory={category}
                onTypeChange={handleTypeChange}
                onCategoryChange={handleCategoryChange}
                onSort={handleSort}
              />
            </div>
          </aside>

          {/* Assets Grid */}
          <div className="lg:col-span-3">
            {/* Error Message */}
            {error && (
              <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {/* Asset Grid */}
            <AssetGrid
              assets={assets}
              isLoading={loading}
              onAssetPreview={setSelectedAsset}
            />

            {/* Load More Button */}
            {!loading && currentPage < totalPages && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg"
                >
                  {isLoadingMore ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    `Load More (${assets.length} assets)`
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex gap-4">
            <svg
              className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">About This Library</h3>
              <p className="text-sm text-blue-800 leading-relaxed mb-3">
                Our design assets are sourced from premium APIs including <span className="font-semibold">Freepik</span>, Pixabay, OpenVerse, and IconFinder.
                Browse vectors, photos, illustrations, and templates for your creative projects.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">Freepik</span>
                <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">Pixabay</span>
                <span className="px-3 py-1 bg-purple-500 text-white text-xs font-medium rounded-full">OpenVerse</span>
                <span className="px-3 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">IconFinder</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Asset Preview Modal */}
      <AssetPreviewModal
        asset={selectedAsset}
        isOpen={!!selectedAsset}
        onClose={() => setSelectedAsset(null)}
      />
    </div>
  );
}
