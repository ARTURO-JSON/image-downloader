import Link from 'next/link';

/**
 * Asset Card Component
 * Display individual design asset
 */
export default function AssetCard({ asset, onPreview }) {
  const typeIcons = {
    vector: '🎨',
    illustration: '🖼️',
    photo: '📷',
    template: '📋',
  };

  const handleDownload = (e) => {
    e.preventDefault();
    window.open(
      `/api/assets/download?id=${asset.sourceId}&source=${asset.source}&format=jpg`,
      '_blank'
    );
  };

  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
        {asset.thumbnail ? (
          <img
            src={asset.thumbnail}
            alt={asset.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            {typeIcons[asset.type] || '📦'}
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-2 left-2">
          <span className="inline-block px-3 py-1 bg-primary-500 text-white text-xs font-bold rounded-full">
            {asset.type.toUpperCase()}
          </span>
        </div>

        {/* Download Count */}
        {asset.downloads > 0 && (
          <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.5 13a6 6 0 0 0 11.9-1.6l-2.1-2.1A3.5 3.5 0 0 1 7.6 9.5l2.5-2.5a1 1 0 1 0-1.4-1.4l-4 4a1 1 0 0 0 0 1.4l4 4a1 1 0 0 0 1.4-1.4L4.5 10" />
            </svg>
            {(asset.downloads / 1000).toFixed(1)}k
          </div>
        )}

        {/* Action Buttons (on hover) */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          <button
            onClick={onPreview}
            className="px-4 py-2 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Preview
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            Download
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">
          {asset.title}
        </h3>

        {/* Author */}
        <p className="text-xs text-gray-600 mb-3">
          by <span className="font-medium">{asset.author || 'Unknown'}</span>
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {asset.tags?.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Formats */}
        <div className="flex gap-2 pt-3 border-t border-gray-200">
          {asset.formats?.map((format) => (
            <span
              key={format}
              className="flex-1 text-center px-2 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded hover:bg-primary-100 cursor-pointer transition-colors"
            >
              {format.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
