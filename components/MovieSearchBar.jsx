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
        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full opacity-30 group-hover:opacity-50 blur transition duration-300" />
        <div className="relative flex items-center bg-slate-800 rounded-full border border-slate-700 overflow-hidden">
          <div className="pl-5 text-slate-400">
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
            className="w-full px-4 py-4 bg-transparent text-white placeholder-slate-500 focus:outline-none text-lg"
          />
          <button
            type="submit"
            className="m-2 px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
