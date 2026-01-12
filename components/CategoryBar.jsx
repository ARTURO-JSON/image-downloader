'use client';

/**
 * CategoryBar Component
 * 
 * Displays a horizontal scrollable list of image categories (nature, tech, people, etc.)
 * Allows users to filter images by selecting a category
 * Responsive: scrollable on mobile, centered on desktop
 * 
 * Props:
 * - selectedCategory: Currently selected category
 * - onCategorySelect: Callback function when user selects a category
 */

// Available image search categories
const IMAGE_CATEGORIES = [
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
    <div className="category-bar-wrapper w-full overflow-x-auto py-3 md:py-4 scrollbar-hide">
      {/* Scrollable category buttons container */}
      <div className="category-buttons-list flex gap-2 px-2 md:px-0 md:justify-center">
        {IMAGE_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            className={`category-button px-3 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-200 transform hover:scale-105 ${
              selectedCategory === category
                ? 'category-button--active bg-primary-500 text-white shadow-md font-semibold'
                : 'category-button--inactive bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent hover:border-gray-300'
            }`}
            aria-pressed={selectedCategory === category}
            aria-label={`Filter images by ${category} category`}
          >
            {/* Capitalize first letter of category name */}
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

