export const dynamic = 'force-dynamic';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || 'nature';
    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('perPage') || '20';
    const source = searchParams.get('source') || 'unsplash'; // 'unsplash' or 'pexels'

    try {
        if (source === 'pexels') {
            return await fetchFromPexels(query, page, perPage);
        } else {
            return await fetchFromUnsplash(query, page, perPage);
        }
    } catch (error) {
        console.error(`Error fetching from ${source}:`, error);
        return Response.json(
            { error: 'Failed to fetch images', details: error.message },
            { status: 500 }
        );
    }
}

async function fetchFromUnsplash(query, page, perPage) {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;

    if (!accessKey) {
        return Response.json(
            { error: 'Unsplash API key not configured' },
            { status: 500 }
        );
    }

    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&client_id=${accessKey}`;

    const response = await fetch(url, {
        headers: {
            'Accept-Version': 'v1',
        },
    });

    if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform the data to a cleaner format
    const images = data.results.map((photo) => ({
        id: photo.id,
        source: 'unsplash',
        url: photo.urls.regular,
        thumb: photo.urls.thumb,
        full: photo.urls.full,
        download: photo.links.download,
        downloadLocation: photo.links.download_location,
        description: photo.description || photo.alt_description || 'Untitled',
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
        width: photo.width,
        height: photo.height,
    }));

    return Response.json({
        images,
        total: data.total,
        totalPages: data.total_pages,
        currentPage: parseInt(page),
    });
}

async function fetchFromPexels(query, page, perPage) {
    const accessKey = process.env.PEXELS_API_KEY;

    if (!accessKey) {
        return Response.json(
            { error: 'Pexels API key not configured' },
            { status: 500 }
        );
    }

    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;

    const response = await fetch(url, {
        headers: {
            'Authorization': accessKey,
        },
    });

    if (!response.ok) {
        throw new Error(`Pexels API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform the data to a cleaner format
    const images = data.photos.map((photo) => ({
        id: photo.id,
        source: 'pexels',
        url: photo.src.large,
        thumb: photo.src.medium,
        full: photo.src.original,
        download: photo.src.original,
        description: photo.alt || 'Untitled',
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        width: photo.width,
        height: photo.height,
    }));

    return Response.json({
        images,
        total: data.total_results,
        totalPages: Math.ceil(data.total_results / perPage),
        currentPage: parseInt(page),
    });
}

