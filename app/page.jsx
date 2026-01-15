'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Navigation from '@/components/Navigation';
import SearchBar from '@/components/SearchBar';
import SourceSelector from '@/components/SourceSelector';
import CategoryBar from '@/components/CategoryBar';

export default function Home() {
  const [input, setInput] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [downloading, setDownloading] = useState(false);
  const [selectedSource, setSelectedSource] = useState('unsplash');
  const [searchQuery, setSearchQuery] = useState('nature');
  const [selectedCategory, setSelectedCategory] = useState('nature');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch images from the API
  const fetchImagesFromAPI = async (query, source = 'unsplash') => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`/api/search?query=${encodeURIComponent(query)}&source=${source}&perPage=30`);
      // Store the full image objects (with id, full, url, source, photographer, etc.)
      // NOT just the URLs
      const fullImages = response.data.images || [];
      setImages(fullImages);
      if (fullImages.length === 0) {
        setError('No images found');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching images');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setInput(query);
    fetchImagesFromAPI(query, selectedSource);
  };

  const handleSourceChange = (source) => {
    setSelectedSource(source);
    // Re-fetch with new source if we have a query
    if (searchQuery) {
      fetchImagesFromAPI(searchQuery, source);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchQuery(category);
    setInput(category);
    fetchImagesFromAPI(category, selectedSource);
  };

  const handleDownload = async (imageObj) => {
    // Use the new downloadImage utility that handles the server proxy
    const { downloadImage } = await import('@/lib/downloadImage');
    
    try {
      downloadImage(
        imageObj.full || imageObj.url,
        imageObj.id,
        imageObj.source || 'unsplash'
      );
    } catch (err) {
      console.error('Download error:', err);
      setError('Error downloading image');
    }
  };

  const handleSelectImage = (index) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedImages(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(images.map((_, i) => i)));
    }
  };

  const handleDownloadAll = async () => {
    if (selectedImages.size === 0) {
      setError('Please select at least one image');
      return;
    }

    setDownloading(true);
    try {
      const zip = new JSZip();
      const selectedImageObjects = Array.from(selectedImages).map(
        (index) => images[index]
      );

      for (let i = 0; i < selectedImageObjects.length; i++) {
        const imageObj = selectedImageObjects[i];
        try {
          // Download the full resolution image
          const response = await axios.get(imageObj.full || imageObj.url, {
            responseType: 'blob',
          });
          // Use the image ID or a fallback name
          const filename = `${imageObj.source || 'image'}-${imageObj.id || i + 1}.jpg`;
          zip.file(filename, response.data);
        } catch (err) {
          console.error(`Error downloading image ${i + 1}:`, err);
        }
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, 'images.zip');
    } catch (err) {
      setError('Error creating zip file');
    } finally {
      setDownloading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchImagesFromAPI(searchQuery, selectedSource);
  }, []);

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
              className="text-primary-600 font-medium"
            >
              Images
            </Link>
            <Link
              href="/movies"
              className="text-gray-700 font-medium hover:text-primary-600 transition-colors"
            >
              Movies
            </Link>
            <Link
              href="/downloader"
              className="text-gray-700 font-medium hover:text-primary-600 transition-colors"
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
              className="block px-4 py-2 rounded-lg text-primary-600 bg-primary-50 font-medium"
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
              href="/downloader"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
            >
              YouTube Video Downloader
            </Link>
          </div>
        )}
      </nav>

      {/* Header with Gradient Background */}
      <header className="bg-gradient-to-b from-[#f8fbff] to-white">
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            Image Downloader
          </h1>
          <div className="max-w-2xl mx-auto mb-6">
            <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
          </div>
          <div className="flex justify-center">
            <SourceSelector
              selectedSource={selectedSource}
              onSourceChange={handleSourceChange}
            />
          </div>
        </div>
      </header>

      {/* Category Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <CategoryBar
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
              <p className="text-gray-600">Loading images...</p>
            </div>
          </div>
        ) : images.length > 0 ? (
          <>
            {/* Selection Controls */}
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-gray-800">
                  <span className="text-gray-500 text-sm">Selected:</span>{' '}
                  <span className="font-bold text-xl text-primary-500">{selectedImages.size}</span>
                  <span className="text-gray-400 mx-1">/</span>
                  <span className="font-medium text-gray-600">{images.length}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSelectAll}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium border border-gray-200"
                >
                  {selectedImages.size === images.length ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Deselect All
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Select All
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownloadAll}
                  disabled={selectedImages.size === 0 || downloading}
                  className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 flex items-center gap-2 font-medium shadow-lg shadow-green-500/25 disabled:shadow-none"
                >
                  {downloading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Selected
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Images Gallery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">
              {images.map((imageObj, index) => (
                <div
                  key={index}
                  className={`group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
                    selectedImages.has(index) ? 'ring-4 ring-primary-500 ring-offset-2' : ''
                  }`}
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={imageObj.thumb || imageObj.url}
                      alt={imageObj.description || `Image ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = '/placeholder.png';
                      }}
                    />
                    
                    {/* Selection Checkbox - Always visible in corner */}
                    <div className="absolute top-3 left-3 z-10">
                      <label className="cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedImages.has(index)}
                          onChange={() => handleSelectImage(index)}
                          className="sr-only peer"
                        />
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          selectedImages.has(index) 
                            ? 'bg-primary-500 border-primary-500' 
                            : 'bg-white/80 border-gray-300 hover:border-primary-400'
                        }`}>
                          {selectedImages.has(index) && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </label>
                    </div>

                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Quick Download Button - Shows on hover */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(imageObj);
                        }}
                        className="p-2.5 bg-white rounded-full shadow-lg hover:bg-primary-500 hover:text-white transition-colors duration-200"
                        title="Download"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>

                    {/* Image Number Badge */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                        #{index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-3 bg-gradient-to-b from-gray-50 to-white">
                    <button
                      onClick={() => handleDownload(imageObj)}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download HD
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600">No images found</p>
          </div>
        )}
      </main>
    </div>
  );
}
