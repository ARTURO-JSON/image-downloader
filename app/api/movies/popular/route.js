export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&page=${page}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from TMDB');
    }

    const data = await response.json();

    return Response.json({
      movies: data.results || [],
      totalPages: data.total_pages || 1,
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { error: error.message || 'Failed to fetch popular movies' },
      { status: 500 }
    );
  }
}
