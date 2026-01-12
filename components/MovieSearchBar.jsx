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
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full opacity-30 group-hover:opacity-50 blur transition duration-300" />
        <div className="relative flex items-center bg-white rounded-full border border-gray-200 overflow-hidden shadow-sm">
          <div className="pl-5 text-gray-400">
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
            className="w-full px-4 py-4 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-lg"
          />
          <button
            type="submit"
            className="m-2 px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-full hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-primary-500/25"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
