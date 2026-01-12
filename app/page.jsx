'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import axios from 'axios';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Navigation from '@/components/Navigation';

export default function Home() {
  const [input, setInput] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [downloading, setDownloading] = useState(false);
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
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black">
      <Navigation />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Image Downloader
          </h1>
          <p className="text-gray-400 text-lg">
            Extract and download images from any website
          </p>
        </div>

        <div className="space-y-8">
          {/* Input Section */}
          <div className="bg-zinc-800 rounded-lg p-8 border border-zinc-700">
            <label className="block text-white text-lg font-semibold mb-4">
              Enter Website URL
            </label>
            <input
              type="url"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  fetchImages(input);
                }
              }}
              placeholder="https://example.com"
              className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
            />
            <button
              onClick={() => fetchImages(input)}
              disabled={loading}
              className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold rounded transition w-full"
            >
              {loading ? 'Fetching Images...' : 'Fetch Images'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-6 py-4 rounded">
              {error}
            </div>
          )}

          {/* Images Grid */}
          {images.length > 0 && (
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
          )}
        </div>
      </div>
    </main>
  );
}
