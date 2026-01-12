/**
 * Asset Preview Modal Component
 * Show asset preview and download options
 */
export default function AssetPreviewModal({ asset, isOpen, onClose }) {
  if (!isOpen || !asset) return null;

  const handleDownload = (format) => {
    window.open(
      `/api/assets/download?id=${asset.sourceId}&source=${asset.source}&format=${format}`,
      '_blank'
    );
  };

  const formatDownloads = (downloads) => {
    if (!downloads || downloads === 0) return '0';
    if (downloads >= 1000000) return `${(downloads / 1000000).toFixed(1)}M`;
    if (downloads >= 1000) return `${(downloads / 1000).toFixed(1)}k`;
    return downloads.toString();
  };

  const sourceColors = {
    freepik: 'bg-blue-500',
    pixabay: 'bg-green-500',
    openverse: 'bg-purple-500',
    iconfinder: 'bg-orange-500',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">Asset Preview</h2>
            <span className={`px-2 py-1 ${sourceColors[asset.source] || 'bg-gray-500'} text-white text-xs font-medium rounded-full capitalize`}>
              {asset.source}
            </span>
            {asset.isPremium && (
              <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
                ⭐ Premium
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Preview Image */}
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            {asset.preview ? (
              <img
                src={asset.preview}
                alt={asset.title}
                className="w-full h-auto max-h-96 object-contain"
              />
            ) : (
              <div className="h-64 flex items-center justify-center text-6xl">📦</div>
            )}
          </div>

          {/* Asset Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{asset.title}</h3>
              <p className="text-gray-600 mt-1">{asset.description}</p>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-600 font-medium">Author</p>
                <p className="text-gray-900 font-medium">{asset.author || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Type</p>
                <p className="text-gray-900 font-medium uppercase">{asset.type}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Source</p>
                <p className="text-gray-900 font-medium capitalize">{asset.source}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Downloads</p>
                <p className="text-gray-900 font-medium">{formatDownloads(asset.downloads)}</p>
              </div>
              {asset.likes > 0 && (
                <div>
                  <p className="text-xs text-gray-600 font-medium">Likes</p>
                  <p className="text-gray-900 font-medium">{formatDownloads(asset.likes)}</p>
                </div>
              )}
              {asset.orientation && (
                <div>
                  <p className="text-xs text-gray-600 font-medium">Orientation</p>
                  <p className="text-gray-900 font-medium capitalize">{asset.orientation}</p>
                </div>
              )}
              {asset.size && (
                <div>
                  <p className="text-xs text-gray-600 font-medium">Size</p>
                  <p className="text-gray-900 font-medium">{asset.size}</p>
                </div>
              )}
              {asset.isNew && (
                <div>
                  <p className="text-xs text-gray-600 font-medium">Status</p>
                  <p className="text-green-600 font-medium">✨ New</p>
                </div>
              )}
            </div>

            {/* Tags */}
            {asset.tags && asset.tags.length > 0 && (
              <div>
                <p className="text-sm font-bold text-gray-900 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {asset.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Download Options */}
            <div>
              <p className="text-sm font-bold text-gray-900 mb-3">Download Formats</p>
              <div className="grid grid-cols-2 gap-3">
                {asset.formats?.map((format) => (
                  <button
                    key={format}
                    onClick={() => handleDownload(format)}
                    className="px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    {format.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* License Info */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-blue-900">
                    <span className="font-medium">License:</span> {asset.license || 'Various'}
                  </p>
                  {asset.licenseUrl && (
                    <a
                      href={asset.licenseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-700 underline mt-1 inline-block"
                    >
                      View license details
                    </a>
                  )}
                </div>
                <a
                  href={asset.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View on {asset.source?.charAt(0).toUpperCase() + asset.source?.slice(1)}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
