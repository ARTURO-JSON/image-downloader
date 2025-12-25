/**
 * Asset Filters Component
 * Filter assets by type and category
 */
export default function AssetFilters({ selectedType, selectedCategory, onTypeChange, onCategoryChange, onSort }) {
  const types = [
    { id: 'all', label: 'All', icon: '📦' },
    { id: 'vector', label: 'Vectors', icon: '🎨' },
    { id: 'illustration', label: 'Illustrations', icon: '🖼️' },
    { id: 'photo', label: 'Photos', icon: '📷' },
    { id: 'template', label: 'Templates', icon: '📋' },
  ];

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'business', label: 'Business' },
    { id: 'background', label: 'Backgrounds' },
    { id: 'infographic', label: 'Infographics' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'abstract', label: 'Abstract' },
    { id: 'technology', label: 'Technology' },
    { id: 'nature', label: 'Nature' },
  ];

  const sorts = [
    { id: 'popular', label: 'Popular' },
    { id: 'latest', label: 'Latest' },
    { id: 'downloads', label: 'Most Downloaded' },
  ];

  return (
    <div className="space-y-6">
      {/* Type Filters */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Asset Type</h3>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <button
              key={type.id}
              onClick={() => onTypeChange(type.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedType === type.id
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{type.icon}</span>
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={selectedCategory === category.id}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-4 h-4 accent-primary-500"
              />
              <span className="text-gray-700 hover:text-primary-600">{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Sort By</h3>
        <select
          onChange={(e) => onSort(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {sorts.map((sort) => (
            <option key={sort.id} value={sort.id}>
              {sort.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
