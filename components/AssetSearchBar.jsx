/**
 * Asset Search Bar Component
 * Search and filter design assets
 */
export default function AssetSearchBar({ onSearch, initialValue = '' }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const query = e.target.elements.search.value;
    if (query.trim()) {
      onSearch(query);
    }
  };

  const suggestions = [
    'background',
    'icon',
    'template',
    'infographic',
    'flyer',
    'business card',
    'logo',
    'social media',
    'illustration',
    'vector',
  ];

  const handleSuggestion = (suggestion) => {
    onSearch(suggestion);
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          name="search"
          defaultValue={initialValue}
          placeholder="Search design assets..."
          className="flex-1 px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors font-medium shadow-md hover:shadow-lg"
        >
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </form>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => handleSuggestion(suggestion)}
            className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-600 transition-colors text-sm font-medium cursor-pointer"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
