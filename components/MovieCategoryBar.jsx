'use client';

const categories = [
  { label: 'Trending', value: 'trending' },
  { label: 'Popular', value: 'popular' },
  { label: 'Top Rated', value: 'top' },
  { label: 'Action', value: 'action' },
  { label: 'Comedy', value: 'comedy' },
  { label: 'Horror', value: 'horror' },
  { label: 'Sci-Fi', value: 'sci-fi' },
  { label: 'Animation', value: 'animation' },
];

export default function MovieCategoryBar({ selectedCategory, onCategorySelect }) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 pb-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategorySelect(category.value)}
            className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 ${
              selectedCategory === category.value
                ? 'bg-primary-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
