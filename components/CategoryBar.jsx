'use client';

const categories = [
  'nature',
  'tech',
  'people',
  'animals',
  'architecture',
  'business',
  'travel',
  'sports',
  'food',
  'fashion',
];

export default function CategoryBar({ selectedCategory, onCategorySelect }) {
  return (
    <div className="w-full overflow-x-auto py-3 md:py-4 scrollbar-hide">
      <div className="flex gap-2 px-2 md:px-0 md:justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            className={`
              px-3 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium whitespace-nowrap
              transition-all duration-200 transform hover:scale-105
              ${
                selectedCategory === category
                  ? 'bg-primary-500 text-white shadow-md font-semibold'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent hover:border-gray-300'
              }
            `}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

