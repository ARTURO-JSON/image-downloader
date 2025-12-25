// Genre ID mapping for TMDB API
const genreMap = {
  action: 28,
  comedy: 35,
  horror: 27,
  'sci-fi': 878,
  animation: 16,
  drama: 18,
  romance: 10749,
  thriller: 53,
  adventure: 12,
  fantasy: 14,
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre');
    const page = searchParams.get('page') || 1;

    if (!genre) {
      return Response.json(
        { error: 'Genre parameter is required' },
        { status: 400 }
      );
    }

    const genreId = genreMap[genre.toLowerCase()];
    if (!genreId) {
      return Response.json(
        { error: `Unknown genre: ${genre}` },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from TMDB');
    }

    const data = await response.json();

    return Response.json({
      movies: data.results || [],
      totalPages: data.total_pages || 1,
      currentPage: parseInt(page),
      genre,
    });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { error: error.message || 'Failed to fetch movies by genre' },
      { status: 500 }
    );
  }
}
