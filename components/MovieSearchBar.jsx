'use client';

export default function MovieSearchBar({ onSearch, initialValue = '' }) {
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
      <div className="relative shadow-md rounded-full transition-all duration-200 hover:shadow-lg focus-within:shadow-lg focus-within:ring-2 focus-within:ring-primary-400">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
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
        </div>
        <input
          type="text"
          name="search"
          defaultValue={initialValue}
          placeholder="Search for movies..."
          className="w-full px-6 py-4 pl-14 pr-6 text-lg rounded-full border-2 border-gray-200 bg-white focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all duration-200 shadow-sm"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-all duration-200 shadow-sm hover:shadow-md"
          aria-label="Search"
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
      </div>
    </form>
  );
}
