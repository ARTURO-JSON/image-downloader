export async function fetchMoviesBySearch(query, page = 1) {
  try {
    const response = await fetch(`/api/movies/search?query=${encodeURIComponent(query)}&page=${page}`);
    if (!response.ok) throw new Error('Failed to fetch search results');
    return await response.json();
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
}

export async function fetchTrendingMovies(page = 1) {
  try {
    const response = await fetch(`/api/movies/trending?page=${page}`);
    if (!response.ok) throw new Error('Failed to fetch trending movies');
    return await response.json();
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
}

export async function fetchPopularMovies(page = 1) {
  try {
    const response = await fetch(`/api/movies/popular?page=${page}`);
    if (!response.ok) throw new Error('Failed to fetch popular movies');
    return await response.json();
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
}

export async function fetchTopRatedMovies(page = 1) {
  try {
    const response = await fetch(`/api/movies/top?page=${page}`);
    if (!response.ok) throw new Error('Failed to fetch top rated movies');
    return await response.json();
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    throw error;
  }
}

export async function fetchMoviesByCategory(genre, page = 1) {
  try {
    const response = await fetch(`/api/movies/category?genre=${genre}&page=${page}`);
    if (!response.ok) throw new Error(`Failed to fetch ${genre} movies`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching movies by category:', error);
    throw error;
  }
}

// Generic movie fetcher that can handle different endpoints
export async function fetchMovies(type, query = '', page = 1) {
  switch (type) {
    case 'search':
      return fetchMoviesBySearch(query, page);
    case 'trending':
      return fetchTrendingMovies(page);
    case 'popular':
      return fetchPopularMovies(page);
    case 'top':
      return fetchTopRatedMovies(page);
    case 'category':
      return fetchMoviesByCategory(query, page);
    default:
      throw new Error(`Unknown movie fetch type: ${type}`);
  }
}
