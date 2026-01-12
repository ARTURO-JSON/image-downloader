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
  const fileInputRef = useRef(null);

  const fetchImages = async (url) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/download', { url });
      setImages(response.data.images || []);
      if (!response.data.images || response.data.images.length === 0) {
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
    fetchImages(query);
  };

  const handleSourceChange = (source) => {
    setSelectedSource(source);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchQuery(category);
    setInput(category);
    fetchImages(category);
  };

  const handleDownload = async (imageUrl) => {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', imageUrl.split('/').pop() || 'image');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
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
      const selectedImageUrls = Array.from(selectedImages).map(
        (index) => images[index]
      );

      for (let i = 0; i < selectedImageUrls.length; i++) {
        const imageUrl = selectedImageUrls[i];
        try {
          const response = await axios.get(imageUrl, {
            responseType: 'blob',
          });
          zip.file(`image_${i + 1}.jpg`, response.data);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            ARTURO.JSX 
          </Link>
          <div className="flex gap-6">
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
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Design Assets
            </Link>
          </div>
        </div>
      </nav>

      {/* Header with Gradient Background */}
      <header className="bg-gradient-to-b from-[#f8fbff] to-white sticky top-16 z-40 shadow-sm">
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

      {/* Category Bar - Sticky */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
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
            <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700 flex justify-between items-center">
              <div className="text-white">
                Selected: <span className="font-bold">{selectedImages.size}</span> /{' '}
                <span className="font-bold">{images.length}</span>
              </div>
              <div className="space-x-4">
                <button
                  onClick={handleSelectAll}
                  className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded transition"
                >
                  {selectedImages.size === images.length
                    ? 'Deselect All'
                    : 'Select All'}
                </button>
                <button
                  onClick={handleDownloadAll}
                  disabled={selectedImages.size === 0 || downloading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded transition"
                >
                  {downloading ? 'Downloading...' : 'Download Selected'}
                </button>
              </div>
            </div>

            {/* Images Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((imageUrl, index) => (
                <div
                  key={index}
                  className="bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700 hover:border-blue-500 transition"
                >
                  <div className="relative w-full h-48">
                    <Image
                      src={imageUrl}
                      alt={`Image ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder.png';
                      }}
                    />
                  </div>
                  <div className="p-4 space-y-3">
                    <button
                      onClick={() => handleDownload(imageUrl)}
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition text-sm"
                    >
                      Download
                    </button>
                    <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedImages.has(index)}
                        onChange={() => handleSelectImage(index)}
                        className="w-4 h-4 rounded"
                      />
                      <span>Select for bulk download</span>
                    </label>
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
