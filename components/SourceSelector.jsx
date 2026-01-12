'use client';

export default function SourceSelector({ selectedSource, onSourceChange }) {
  const sources = [
    { id: 'unsplash', name: 'Unsplash', icon: '📷' },
    { id: 'pexels', name: 'Pexels', icon: '🖼️' },
  ];

  return (
    <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap px-2">
      <span className="text-xs md:text-sm text-gray-500 font-medium">Source:</span>
      <div className="flex gap-1 bg-white border border-gray-200 rounded-full p-1 shadow-sm">
        {sources.map((source) => (
          <button
            key={source.id}
            onClick={() => onSourceChange(source.id)}
            className={`
              px-3 md:px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200
              flex items-center gap-1 md:gap-2 whitespace-nowrap
              ${
                selectedSource === source.id
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            <span className="text-base">{source.icon}</span>
            <span>{source.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

