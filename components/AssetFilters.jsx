import { useState } from 'react';

/**
 * Asset Filters Component
 * Filter assets by type, category, and source
 * Collapsible on mobile for better space usage
 */
export default function AssetFilters({ selectedType, selectedCategory, onTypeChange, onCategoryChange, onSort }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const types = [
    { id: 'all', label: 'All', icon: '📦' },
    { id: 'vector', label: 'Vectors', icon: '🎨' },
    { id: 'illustration', label: 'Illustrations', icon: '🖼️' },
    { id: 'photo', label: 'Photos', icon: '📷' },
    { id: 'template', label: 'Templates', icon: '📋' },
  ];

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'business', label: 'Business' },
    { id: 'background', label: 'Backgrounds' },
    { id: 'infographic', label: 'Infographics' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'abstract', label: 'Abstract' },
    { id: 'technology', label: 'Technology' },
    { id: 'nature', label: 'Nature' },
    { id: 'people', label: 'People' },
    { id: 'food', label: 'Food' },
    { id: 'travel', label: 'Travel' },
    { id: 'education', label: 'Education' },
  ];

  const sorts = [
    { id: 'popular', label: 'Most Popular' },
    { id: 'latest', label: 'Latest' },
    { id: 'downloads', label: 'Most Downloaded' },
  ];

  return (
    <div className="space-y-4">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="lg:hidden w-full flex items-center justify-between p-3 bg-gray-100 rounded-lg font-medium text-gray-700"
      >
        <span className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </span>
        <svg 
          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Filters Content - Always visible on desktop, collapsible on mobile */}
      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        {/* Type Filters */}
        <div>
          <h3 className="font-bold text-gray-900 mb-2 text-sm">Asset Type</h3>
          <div className="flex flex-wrap gap-1.5">
            {types.map((type) => (
              <button
                key={type.id}
                onClick={() => onTypeChange(type.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedType === type.id
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1">{type.icon}</span>
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filters - Dropdown on mobile, radio list on desktop */}
        <div>
          <h3 className="font-bold text-gray-900 mb-2 text-sm">Category</h3>
          {/* Mobile: Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="lg:hidden w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
          {/* Desktop: Radio list */}
          <div className="hidden lg:block space-y-1.5">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="category"
                  value={category.id}
                  checked={selectedCategory === category.id}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="w-4 h-4 accent-primary-500"
                />
                <span className="text-sm text-gray-700 hover:text-primary-600">{category.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div>
          <h3 className="font-bold text-gray-900 mb-2 text-sm">Sort By</h3>
          <select
            onChange={(e) => onSort(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            {sorts.map((sort) => (
              <option key={sort.id} value={sort.id}>
                {sort.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
