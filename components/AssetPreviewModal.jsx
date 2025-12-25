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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Asset Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
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
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
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
                <p className="text-gray-900 font-medium">{asset.source}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Downloads</p>
                <p className="text-gray-900 font-medium">{(asset.downloads / 1000).toFixed(1)}k</p>
              </div>
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
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="font-medium">License:</span> {asset.license || 'Various'}
              </p>
              <a
                href={asset.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
              >
                View on {asset.source}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
