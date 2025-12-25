export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const page = searchParams.get('page') || 1;

    if (!query) {
      return Response.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from TMDB');
    }

    const data = await response.json();

    return Response.json({
      movies: data.results || [],
      totalPages: data.total_pages || 1,
      totalResults: data.total_results || 0,
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { error: error.message || 'Failed to search movies' },
      { status: 500 }
    );
  }
}
