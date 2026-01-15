'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Helper function to format numbers (1000 -> 1K, 1000000 -> 1M)
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * YouTube Video Downloader
 * Download videos and content from YouTube, Instagram, TikTok, and more
 */
export default function ContentDownloaderPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [detectedService, setDetectedService] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [videoInfo, setVideoInfo] = useState(null);

  const formatOptions = [
    { quality: '4K', label: '4K (2160p)', itag: '313' },
    { quality: '1440p', label: '1440p (2K)', itag: '271' },
    { quality: '1080p', label: '1080p (Full HD)', itag: '18' },
    { quality: '720p', label: '720p (HD)', itag: '22' },
    { quality: '480p', label: '480p (SD)', itag: '135' },
  ];

  const services = [
    {
      id: 'youtube',
      name: 'YouTube',
      logo: '/assets/YT.png',
      description: 'Download videos, playlists, and music',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      logo: '/assets/insta.png',
      description: 'Save photos, videos, and reels',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      logo: '/assets/TT.png',
      description: 'Download TikTok videos without watermark',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      logo: '/assets/FB.png',
      description: 'Download videos from Facebook',
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      logo: '/assets/x.png',
      description: 'Save tweets, videos, and media',
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      logo: '/assets/pinterest.png',
      description: 'Download pins and videos',
    },
    {
      id: 'reddit',
      name: 'Reddit',
      logo: '/assets/reddit.png',
      description: 'Save posts and videos from Reddit',
    },
    {
      id: 'snapchat',
      name: 'Snapchat',
      logo: '/assets/SNAP.png',
      description: 'Download snaps and stories',
    },
    {
      id: 'twitch',
      name: 'Twitch',
      logo: '/assets/Twitch.png',
      description: 'Download streams and clips',
    },
    {
      id: 'vimeo',
      name: 'Vimeo',
      logo: '/assets/vimeo.png',
      description: 'Save videos from Vimeo',
    },
  ];

  const detectService = (inputUrl) => {
    if (!inputUrl.trim()) {
      setDetectedService(null);
      return null;
    }

    let service = null;
    
    if (/youtube|youtu\.be/.test(inputUrl)) {
      service = 'youtube';
    } else if (/instagram/.test(inputUrl)) {
      service = 'instagram';
    } else if (/tiktok/.test(inputUrl)) {
      service = 'tiktok';
    } else if (/facebook|fb\.watch/.test(inputUrl)) {
      service = 'facebook';
    } else if (/twitter|x\.com/.test(inputUrl)) {
      service = 'twitter';
    } else if (/pinterest/.test(inputUrl)) {
      service = 'pinterest';
    } else if (/reddit\.com/.test(inputUrl)) {
      service = 'reddit';
    } else if (/snapchat/.test(inputUrl)) {
      service = 'snapchat';
    } else if (/twitch\.tv/.test(inputUrl)) {
      service = 'twitch';
    } else if (/vimeo/.test(inputUrl)) {
      service = 'vimeo';
    }

    setDetectedService(service);
    return service;
  };

  const handleUrlChange = (e) => {
    const inputUrl = e.target.value;
    setUrl(inputUrl);
    detectService(inputUrl);
    setError(null);
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    if (!detectedService) {
      setError('URL from unsupported platform. Please enter a valid social media URL.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const service = detectedService;
      const endpoint = `/api/content/${service}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || `Failed to process ${service}`);
        setLoading(false);
        return;
      }

      if (service === 'youtube') {
        setVideoInfo(data);
        setSelectedFormat(null);
        setError(null);
      } else if (service === 'instagram') {
        setVideoInfo(data);
        setSelectedFormat(null);
        setError(null);
      } else if (service === 'tiktok') {
        setVideoInfo(data);
        setSelectedFormat(null);
        setError(null);
      } else {
        setError(`${service.charAt(0).toUpperCase() + service.slice(1)} download integration coming soon!`);
      }
    } catch (err) {
      setError(err.message || 'Failed to process download');
      console.error('Download error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ARTURO.JSX
          </Link>
          
          <div className="hidden md:flex gap-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Images
            </Link>
            <Link href="/movies" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Movies
            </Link>
            <Link href="/downloader" className="text-blue-600 font-medium">
              YouTube Video Downloader
            </Link>
          </div>

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

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-2">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors">
              Images
            </Link>
            <Link href="/movies" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors">
              Movies
            </Link>
            <Link href="/downloader" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg text-blue-600 bg-blue-50 font-medium">
              YouTube Video Downloader
            </Link>
          </div>
        )}
      </nav>

      <header className="bg-gradient-to-b from-blue-50 to-transparent pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Download from Anywhere
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Save videos, photos, and content from your favorite social media platforms in seconds
          </p>

          <form onSubmit={handleDownload} className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <input
                  type="url"
                  value={url}
                  onChange={handleUrlChange}
                  placeholder="Paste any video or media link here..."
                  className="w-full px-6 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none font-medium transition-colors"
                />
                {detectedService && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      {services.find(s => s.id === detectedService)?.name}
                    </span>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || !detectedService}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold whitespace-nowrap"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Downloading
                  </span>
                ) : (
                  'Download'
                )}
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {videoInfo && detectedService === 'youtube' && videoInfo.video && (
              <div className="mt-8 border-t pt-8">
                {/* Show error if no playable formats */}
                {videoInfo.success === false && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg mb-6">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold">Limited availability</span>
                    </div>
                    <p className="mt-1 text-sm">{videoInfo.error || 'Some formats may not be available for this video.'}</p>
                  </div>
                )}
                
                <div className="mb-6 flex flex-col md:flex-row gap-6">
                  {/* Video Thumbnail Card */}
                  <div className="md:w-1/3">
                    <div className="rounded-lg overflow-hidden bg-gray-100 shadow-md">
                      <img
                        src={videoInfo.video.thumbnail || `https://img.youtube.com/vi/${videoInfo.video.id}/maxresdefault.jpg`}
                        alt={videoInfo.video.title}
                        className="w-full aspect-video object-cover"
                        onError={(e) => {
                          e.target.src = `https://img.youtube.com/vi/${videoInfo.video.id}/hqdefault.jpg`;
                        }}
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{videoInfo.video.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">by {videoInfo.video.author}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                          </svg>
                          {Math.floor(videoInfo.video.length / 60)} min
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          {formatNumber(videoInfo.video.views)} views
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Format Selection */}
                  <div className="md:w-2/3">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Select Quality</label>
                        {/* Show available formats from API */}
                        {videoInfo.formats && (videoInfo.formats.video?.length > 0 || videoInfo.formats.audio?.length > 0) ? (
                          <select
                            value={selectedFormat ? `${selectedFormat.itag}-${selectedFormat.type}` : ''}
                            onChange={(e) => {
                              if (!e.target.value) {
                                setSelectedFormat(null);
                                return;
                              }
                              const [itag, type] = e.target.value.split('-');
                              if (type === 'audio') {
                                const audioFormat = videoInfo.formats.audio?.find(f => f.itag.toString() === itag);
                                setSelectedFormat({ 
                                  quality: audioFormat?.quality || 'audio', 
                                  label: `Audio ${audioFormat?.quality || ''}`, 
                                  itag: itag, 
                                  type: 'audio' 
                                });
                              } else {
                                const videoFormat = videoInfo.formats.video?.find(f => f.itag.toString() === itag);
                                setSelectedFormat({ 
                                  quality: videoFormat?.resolution || videoFormat?.quality, 
                                  label: videoFormat?.resolution || 'Video', 
                                  itag: itag, 
                                  type: 'video' 
                                });
                              }
                            }}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none font-medium"
                          >
                            <option value="">Choose a format...</option>
                            {videoInfo.formats.video?.length > 0 && (
                              <optgroup label="Video Formats (with audio)">
                                {videoInfo.formats.video.map((format, idx) => (
                                  <option key={`video-${format.itag}-${idx}`} value={`${format.itag}-video`}>
                                    {format.resolution || format.quality} - MP4 {format.hasAudio ? '(with audio)' : ''}
                                  </option>
                                ))}
                              </optgroup>
                            )}
                            {videoInfo.formats.audio?.length > 0 && (
                              <optgroup label="Audio Only">
                                {videoInfo.formats.audio.map((format, idx) => (
                                  <option key={`audio-${format.itag}-${idx}`} value={`${format.itag}-audio`}>
                                    {format.quality} - {format.mimeType?.split(';')[0] || 'Audio'}
                                  </option>
                                ))}
                              </optgroup>
                            )}
                          </select>
                        ) : (
                          <div className="p-4 bg-gray-100 rounded-lg text-gray-600 text-center">
                            No downloadable formats available for this video
                          </div>
                        )}
                      </div>

                      {selectedFormat && (
                        <button
                          onClick={async () => {
                            try {
                              // First get the download URL from our API
                              const response = await fetch(`/api/content/youtube?url=${encodeURIComponent(url)}&itag=${selectedFormat.itag}`);
                              const data = await response.json();
                              
                              if (data.success && data.downloadUrl) {
                                // Open the actual download URL in a new tab
                                window.open(data.downloadUrl, '_blank');
                              } else {
                                setError(data.error || 'Failed to get download URL');
                              }
                            } catch (err) {
                              setError('Failed to start download: ' + err.message);
                            }
                          }}
                          className="w-full px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download {selectedFormat.type === 'audio' ? 'Audio' : 'Video'}
                        </button>
                      )}
                      {selectedFormat && (
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          ⏳ Download will open in a new tab. Large files may take a moment.
                        </p>
                      )}
                      {/* Show available resolutions info */}
                      {videoInfo.availableResolutions?.length > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs text-blue-700">
                            <strong>Available qualities:</strong> {videoInfo.availableResolutions.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Instagram Content Display */}
            {videoInfo && detectedService === 'instagram' && (
              <div className="mt-8 border-t pt-8">
                <div className="mb-6 flex flex-col md:flex-row gap-6">
                  {/* Instagram Content Preview */}
                  <div className="md:w-1/3">
                    <div className="rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-1">
                      <div className="bg-white rounded-lg overflow-hidden">
                        {/* Thumbnail Image */}
                        {videoInfo.thumbnail ? (
                          <div className="aspect-square bg-gray-100">
                            <img 
                              src={videoInfo.thumbnail} 
                              alt="Instagram Content"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="aspect-square bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 flex items-center justify-center">
                            <svg className="w-16 h-16 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </div>
                        )}
                        {/* Author Info */}
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400"></div>
                            <span className="font-semibold text-gray-900">@{videoInfo.author || 'Instagram User'}</span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{videoInfo.caption || 'Instagram Content'}</p>
                          {videoInfo.mediaItems && videoInfo.mediaItems.length > 1 && (
                            <p className="text-xs text-pink-500 mt-2">📸 {videoInfo.mediaItems.length} items in this post</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Download Options */}
                  <div className="md:w-2/3">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Download Options</h4>
                        {videoInfo.mediaItems && videoInfo.mediaItems.length > 0 ? (
                          <div className="space-y-3">
                            {videoInfo.mediaItems.map((item, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  window.location.href = `/api/content/instagram?mediaUrl=${encodeURIComponent(item.url)}`;
                                }}
                                className="w-full p-4 rounded-lg border-2 border-gray-200 hover:border-pink-400 transition-all text-left flex items-center gap-3"
                              >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'video' ? 'bg-pink-100' : 'bg-purple-100'}`}>
                                  {item.type === 'video' ? (
                                    <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                    </svg>
                                  ) : (
                                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900">
                                    {item.type === 'video' ? 'Video' : 'Image'} {videoInfo.mediaItems.length > 1 ? `#${index + 1}` : ''}
                                  </div>
                                  <div className="text-sm text-gray-600">Click to download {item.type}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              window.location.href = `/api/content/instagram?url=${encodeURIComponent(url)}`;
                            }}
                            className="w-full p-4 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-semibold flex items-center justify-center gap-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Content
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TikTok Content Display */}
            {videoInfo && detectedService === 'tiktok' && (
              <div className="mt-8 border-t pt-8">
                <div className="mb-6 flex flex-col md:flex-row gap-6">
                  {/* TikTok Content Preview */}
                  <div className="md:w-1/3">
                    <div className="rounded-lg overflow-hidden bg-black p-1">
                      <div className="bg-gray-900 rounded-lg overflow-hidden">
                        {/* Thumbnail */}
                        {videoInfo.thumbnail ? (
                          <div className="aspect-[9/16] bg-gray-800 max-h-80">
                            <img 
                              src={videoInfo.thumbnail} 
                              alt="TikTok Video"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="aspect-[9/16] bg-gray-800 flex items-center justify-center max-h-80">
                            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                            </svg>
                          </div>
                        )}
                        {/* Author Info */}
                        <div className="p-4 text-white">
                          <div className="flex items-center gap-2 mb-2">
                            {videoInfo.authorAvatar ? (
                              <img src={videoInfo.authorAvatar} alt="" className="w-8 h-8 rounded-full" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-cyan-400"></div>
                            )}
                            <span className="font-semibold">@{videoInfo.author || 'TikTok User'}</span>
                          </div>
                          <p className="text-sm text-gray-300 line-clamp-2">{videoInfo.title || 'TikTok Video'}</p>
                          {videoInfo.musicInfo && (
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                              </svg>
                              <span>{videoInfo.musicInfo.title} - {videoInfo.musicInfo.author}</span>
                            </div>
                          )}
                          {/* Stats */}
                          <div className="flex gap-4 mt-3 text-xs text-gray-400">
                            {videoInfo.playCount > 0 && <span>▶ {formatNumber(videoInfo.playCount)}</span>}
                            {videoInfo.likeCount > 0 && <span>❤ {formatNumber(videoInfo.likeCount)}</span>}
                            {videoInfo.commentCount > 0 && <span>💬 {formatNumber(videoInfo.commentCount)}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Download Options */}
                  <div className="md:w-2/3">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Download Options</h4>
                        {videoInfo.mediaItems && videoInfo.mediaItems.length > 0 ? (
                          <div className="space-y-3">
                            {videoInfo.mediaItems.map((item, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  window.location.href = `/api/content/tiktok?mediaUrl=${encodeURIComponent(item.url)}&type=${item.type}`;
                                }}
                                className={`w-full p-4 rounded-lg border-2 border-gray-200 hover:border-cyan-400 transition-all text-left flex items-center gap-3 ${
                                  item.quality === 'HD No Watermark' ? 'bg-gradient-to-r from-pink-50 to-cyan-50 border-pink-200' : ''
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  item.type === 'audio' ? 'bg-purple-100' : 'bg-cyan-100'
                                }`}>
                                  {item.type === 'audio' ? (
                                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                    </svg>
                                  ) : (
                                    <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                    </svg>
                                  )}
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                                    {item.quality}
                                    {item.quality === 'HD No Watermark' && (
                                      <span className="text-xs bg-gradient-to-r from-pink-500 to-cyan-500 text-white px-2 py-0.5 rounded-full">Best</span>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {item.type === 'audio' ? 'Download audio (MP3)' : 'Download video (MP4)'}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              window.location.href = `/api/content/tiktok?url=${encodeURIComponent(url)}`;
                            }}
                            className="w-full p-4 rounded-lg bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-semibold flex items-center justify-center gap-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Video
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">Supported Platforms</h2>
        <p className="text-center text-gray-600 mb-12">Download from your favorite social media with just one click</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300 text-center cursor-pointer"
            >
              <div className="mb-3 h-16 flex items-center justify-center">
                <Image
                  src={service.logo}
                  alt={service.name}
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">
                {service.name}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Why Choose Our YouTube Video Downloader?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                <p className="text-gray-600">Download content in seconds with our optimized servers</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">100% Private</h3>
                <p className="text-gray-600">No logins required. Your privacy is our priority</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Watermarks</h3>
                <p className="text-gray-600">High quality downloads without any added watermarks</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:border-blue-300 transition-colors">
              <summary className="font-semibold text-gray-900 flex items-center justify-between">
                How do I download a video?
                <span className="ml-2">+</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Simply paste the video link into the input field above and click Download. We'll process the content and prepare it for download.
              </p>
            </details>

            <details className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:border-blue-300 transition-colors">
              <summary className="font-semibold text-gray-900 flex items-center justify-between">
                Is this service free?
                <span className="ml-2">+</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Yes! Our service is completely free to use. No subscriptions, no hidden fees.
              </p>
            </details>

            <details className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:border-blue-300 transition-colors">
              <summary className="font-semibold text-gray-900 flex items-center justify-between">
                What formats are available?
                <span className="ml-2">+</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                We support multiple formats including MP4, MP3, WebM, and more depending on the platform and content type.
              </p>
            </details>

            <details className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:border-blue-300 transition-colors">
              <summary className="font-semibold text-gray-900 flex items-center justify-between">
                Is it legal to download content?
                <span className="ml-2">+</span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Please respect copyright laws and only download content that you have permission to save. Always check the original creator's terms.
              </p>
            </details>
          </div>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust our YouTube Video Downloader for fast, safe, and easy content downloads
          </p>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Start Downloading Now
          </a>
        </div>
      </footer>
    </div>
  );
}
