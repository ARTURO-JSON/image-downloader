'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import CategoryBar from '@/components/CategoryBar';
import SourceSelector from '@/components/SourceSelector';
import ImageGrid from '@/components/ImageGrid';
import ImageModal from '@/components/ImageModal';
import { fetchImages } from '@/lib/fetchImages';

export default function Home() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('nature');
  const [selectedCategory, setSelectedCategory] = useState('nature');
  const [selectedSource, setSelectedSource] = useState('unsplash');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Initial load and when search/category/source changes
  useEffect(() => {
    loadImages(searchQuery, 1, true);
  }, [searchQuery, selectedSource]);

  const loadImages = async (query, page, reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setIsLoadingMore(true);
      }

      const data = await fetchImages(query, page, 20, selectedSource);

      if (reset) {
        setImages(data.images);
      } else {
        setImages((prev) => [...prev, ...data.images]);
      }

      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message || 'Failed to load images');
      console.error('Error loading images:', err);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedCategory('');
    setCurrentPage(1);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchQuery(category);
    setCurrentPage(1);
  };

  const handleSourceChange = (source) => {
    setSelectedSource(source);
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && currentPage < totalPages) {
      loadImages(searchQuery, currentPage + 1, false);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <Link href="/" className="text-lg md:text-2xl font-bold text-primary-600">
            ARTURO.JSX 
          </Link>
          <div className="flex gap-3 md:gap-6 text-xs md:text-base">
            <Link
              href="/"
              className="text-primary-600 font-medium"
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
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors hidden sm:inline"
            >
              Design Assets
            </Link>
          </div>
        </div>
      </nav>

      {/* Header with Gradient Background */}
      <header className="bg-gradient-to-b from-[#f8fbff] to-white sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6 md:pt-12 pb-6 md:pb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-4 md:mb-8 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            Image Downloader
          </h1>
          <div className="max-w-2xl mx-auto mb-4 md:mb-6">
            <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
          </div>
          <div className="flex justify-center overflow-x-auto">
            <SourceSelector
              selectedSource={selectedSource}
              onSourceChange={handleSourceChange}
            />
          </div>
        </div>
      </header>

      {/* Category Bar - Sticky */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <CategoryBar
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
              <p className="text-gray-600">Loading images...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={() => loadImages(searchQuery, 1, true)}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <ImageGrid images={images} onImageClick={handleImageClick} />

            {/* Load More Button */}
            {currentPage < totalPages && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="px-8 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                >
                  {isLoadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal image={selectedImage} onClose={handleCloseModal} />
      )}
    </div>
  );
}

