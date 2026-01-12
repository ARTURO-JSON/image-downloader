'use client';

/**
 * SourceSelector Component
 * 
 * Allows users to toggle between different image sources (Unsplash, Pexels)
 * Displays as a pill-shaped button group with icons
 * 
 * Props:
 * - selectedSource: Currently selected source (unsplash or pexels)
 * - onSourceChange: Callback function when user selects a different source
 */
export default function SourceSelector({ selectedSource, onSourceChange }) {
  // Define available image sources with their display names and icons
  const imageSources = [
    { id: 'unsplash', name: 'Unsplash', icon: '📷' },
    { id: 'pexels', name: 'Pexels', icon: '🖼️' },
  ];

  return (
    <div className="source-selector-wrapper flex items-center justify-center gap-2 md:gap-3 flex-wrap px-2">
      {/* Source label */}
      <span className="source-label text-xs md:text-sm text-gray-500 font-medium">Source:</span>
      
      {/* Source buttons container */}
      <div className="source-buttons-group flex gap-1 bg-white border border-gray-200 rounded-full p-1 shadow-sm">
        {imageSources.map((source) => (
          <button
            key={source.id}
            onClick={() => onSourceChange(source.id)}
            className={`source-button px-3 md:px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 flex items-center gap-1 md:gap-2 whitespace-nowrap ${
              selectedSource === source.id
                ? 'source-button--active bg-primary-500 text-white shadow-md'
                : 'source-button--inactive text-gray-600 hover:bg-gray-100'
            }`}
            aria-pressed={selectedSource === source.id}
            aria-label={`Select ${source.name} as image source`}
          >
            <span className="source-icon text-base">{source.icon}</span>
            <span className="source-name">{source.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

