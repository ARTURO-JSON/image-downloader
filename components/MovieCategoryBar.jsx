'use client';

const categories = [
  { label: '🔥 Trending', value: 'trending' },
  { label: '⭐ Popular', value: 'popular' },
  { label: '🏆 Top Rated', value: 'top' },
  { label: '💥 Action', value: 'action' },
  { label: '😂 Comedy', value: 'comedy' },
  { label: '👻 Horror', value: 'horror' },
  { label: '🚀 Sci-Fi', value: 'sci-fi' },
  { label: '🎨 Animation', value: 'animation' },
  { label: '🎭 Drama', value: 'drama' },
  { label: '💕 Romance', value: 'romance' },
];

export default function MovieCategoryBar({ selectedCategory, onCategorySelect }) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-1">
      <div className="flex gap-3 min-w-max">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategorySelect(category.value)}
            className={`px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300 ${
              selectedCategory === category.value
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
