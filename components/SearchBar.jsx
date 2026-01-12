'use client';

/**
 * SearchBar Component
 * 
 * Renders a responsive search input with icon
 * Handles form submission and passes search query to parent via callback
 * 
 * Props:
 * - onSearch: Callback function called when user submits search query
 * - initialValue: Initial value for the search input (default: empty string)
 */
export default function SearchBar({ onSearch, initialValue = '' }) {
  /**
   * Handle search form submission
   * Extracts and trims the search query, then calls the onSearch callback
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get('search');
    if (query && query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Search container with hover and focus effects */}
      <div className="search-container relative shadow-md rounded-full transition-all duration-200 hover:shadow-lg focus-within:shadow-lg focus-within:ring-2 focus-within:ring-blue-400">
        
        {/* Search icon - positioned on the left */}
        <div className="search-icon-wrapper absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Search input field */}
        <input
          type="text"
          name="search"
          defaultValue={initialValue}
          placeholder="Search for images..."
          className="search-input w-full px-4 md:px-6 py-3 md:py-4 pl-10 md:pl-14 pr-12 md:pr-6 text-sm md:text-lg rounded-full border-2 border-gray-200 bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 shadow-sm"
          aria-label="Search for images"
        />

        {/* Submit button - positioned on the right */}
        <button
          type="submit"
          className="search-submit-btn absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-all duration-200 shadow-sm hover:shadow-md"
          aria-label="Submit search"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}

