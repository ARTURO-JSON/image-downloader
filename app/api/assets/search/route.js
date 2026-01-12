import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Aggregate design assets from multiple legal APIs
 * GET /api/assets/search?query=...&type=...&category=...&page=...
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || 'design';
    const type = searchParams.get('type') || 'all'; // all, vector, illustration, photo, template
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('perPage') || '20', 10);
    const sort = searchParams.get('sort') || 'popular'; // popular, latest, downloads

    const pixabayKey = process.env.PIXABAY_API_KEY;
    const iconfinderKey = process.env.ICONFINDER_API_KEY;
    const freepikKey = process.env.FREEPIK_API_KEY;

    if (!pixabayKey && !freepikKey) {
      console.warn('No API keys configured - Pixabay or Freepik required');
      return NextResponse.json(
        { 
          error: 'No API keys configured for asset search. Please add PIXABAY_API_KEY or FREEPIK_API_KEY to your environment variables.',
          assets: [],
          total: 0 
        },
        { status: 500 }
      );
    }

    const results = [];

    // Fetch from Pixabay (vectors, illustrations, photos)
    if (['all', 'vector', 'illustration', 'photo'].includes(type) && pixabayKey) {
      try {
        const pixabayResults = await fetchFromPixabay(
          query,
          type,
          page,
          perPage,
          pixabayKey
        );
        results.push(...pixabayResults);
      } catch (err) {
        console.error('Pixabay fetch error:', err);
      }
    }

    // Fetch from OpenVerse (creative commons assets)
    if (['all', 'photo', 'illustration'].includes(type)) {
      try {
        const openverseResults = await fetchFromOpenVerse(query, page, perPage);
        results.push(...openverseResults);
      } catch (err) {
        console.error('OpenVerse fetch error:', err);
      }
    }

    // Fetch from IconFinder (SVG icons/vectors)
    if (['all', 'vector'].includes(type) && iconfinderKey) {
      try {
        const iconfindResults = await fetchFromIconFinder(
          query,
          page,
          perPage,
          iconfinderKey
        );
        results.push(...iconfindResults);
      } catch (err) {
        console.error('IconFinder fetch error:', err);
      }
    }

    // Fetch from Freepik (design assets)
    if (['all', 'vector', 'illustration', 'template', 'photo'].includes(type) && freepikKey) {
      try {
        const freepikResults = await fetchFromFreepik(
          query,
          type,
          page,
          perPage,
          freepikKey,
          sort
        );
        results.push(...freepikResults);
      } catch (err) {
        console.error('Freepik fetch error:', err);
      }
    }

    // Remove duplicates
    const uniqueResults = Array.from(
      new Map(results.map((item) => [item.id, item])).values()
    );

    // Sort by downloads (popularity)
    uniqueResults.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));

    // Slice for pagination
    const paginatedResults = uniqueResults.slice(
      (page - 1) * perPage,
      page * perPage
    );

    return NextResponse.json({
      assets: paginatedResults,
      total: uniqueResults.length,
      page,
      perPage,
      totalPages: Math.ceil(uniqueResults.length / perPage),
      query,
      type,
    });
  } catch (error) {
    console.error('Asset search error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to search assets',
        assets: [],
        total: 0,
      },
      { status: 500 }
    );
  }
}

/**
 * Fetch from Pixabay API
 */
async function fetchFromPixabay(query, type, page, perPage, apiKey) {
  const typeMap = {
    all: ['vector', 'illustration', 'photo'],
    vector: ['vector'],
    illustration: ['illustration'],
    photo: ['photo'],
    template: ['photo'], // Use photos as placeholder for templates
  };

  const types = typeMap[type] || ['vector', 'illustration', 'photo'];
  let results = [];

  for (const imgType of types) {
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(
      query
    )}&image_type=${imgType}&page=${page}&per_page=${perPage}&order=popular`;

    const response = await fetch(url);
    if (!response.ok) continue;

    const data = await response.json();

    const formatted = (data.hits || []).map((item) => ({
      id: `pixabay-${item.id}`,
      title: query,
      description: `${imgType} asset`,
      type: imgType === 'vector' ? 'vector' : imgType,
      thumbnail: item.previewURL,
      preview: item.largeImageURL,
      author: item.user,
      downloads: item.downloads,
      tags: item.tags?.split(', ') || [],
      formats: ['jpg', 'png'],
      source: 'pixabay',
      sourceUrl: item.pageURL,
      sourceId: item.id,
    }));

    results.push(...formatted);
  }

  return results;
}

/**
 * Fetch from OpenVerse API (CC licensed assets)
 */
async function fetchFromOpenVerse(query, page, perPage) {
  try {
    const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(
      query
    )}&page=${page}&page_size=${perPage}`;

    const response = await fetch(url);
    if (!response.ok) return [];

    const data = await response.json();

    return (data.results || []).map((item) => ({
      id: `openverse-${item.id}`,
      title: item.title || query,
      description: item.description || 'Design asset',
      type: 'photo',
      thumbnail: item.thumbnail,
      preview: item.url,
      author: item.creator,
      downloads: item.download_count || 0,
      tags: item.tags?.map((t) => t.name) || [],
      formats: ['jpg', 'png'],
      source: 'openverse',
      sourceUrl: item.url,
      sourceId: item.id,
      license: item.license || 'CC0',
    }));
  } catch (err) {
    console.error('OpenVerse error:', err);
    return [];
  }
}

/**
 * Fetch from IconFinder API (SVG icons)
 */
async function fetchFromIconFinder(query, page, perPage, apiKey) {
  try {
    const url = `https://api.iconfinder.com/v4/icons/search?query=${encodeURIComponent(
      query
    )}&limit=${perPage}&offset=${(page - 1) * perPage}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) return [];

    const data = await response.json();

    return (data.icons || []).map((item) => ({
      id: `iconfinder-${item.icon_id}`,
      title: item.tags?.[0] || query,
      description: 'SVG icon vector',
      type: 'vector',
      thumbnail: item.raster_sizes?.[0]?.formats?.[0]?.preview_url || '',
      preview: item.vector_sizes?.[0]?.formats?.[0]?.preview_url || '',
      author: item.creator?.name || 'IconFinder',
      downloads: 0,
      tags: item.tags || [],
      formats: ['svg', 'eps'],
      source: 'iconfinder',
      sourceUrl: item.urls?.page || '',
      sourceId: item.icon_id,
      isPremium: item.premium,
    }));
  } catch (err) {
    console.error('IconFinder error:', err);
    return [];
  }
}
/**
 * Fetch from Freepik API (design templates, vectors, illustrations)
 * Using the official Freepik API v1 endpoints
 * Docs: https://docs.freepik.com/api-reference/resources/get-all-resources
 */
async function fetchFromFreepik(query, type, page, perPage, apiKey, sort = 'popular') {
  try {
    // Map sort to Freepik order values
    const orderMap = {
      popular: 'relevance',
      latest: 'recent',
      downloads: 'relevance', // Freepik only supports relevance and recent
    };

    // Build the URL with query parameters
    const params = new URLSearchParams({
      term: query,
      page: page.toString(),
      limit: perPage.toString(),
      order: orderMap[sort] || 'relevance',
    });

    // Add content-type filter based on type selection
    // Freepik image.type values: vector, photo, psd, ai-generated
    if (type !== 'all') {
      const filterMap = {
        vector: 'vector',
        illustration: 'vector', // illustrations are vectors in Freepik
        photo: 'photo',
        template: 'psd',
      };
      if (filterMap[type]) {
        params.append('filters[content_type][photo]', type === 'photo' ? '1' : '0');
        params.append('filters[content_type][vector]', (type === 'vector' || type === 'illustration') ? '1' : '0');
        params.append('filters[content_type][psd]', type === 'template' ? '1' : '0');
      }
    }

    const url = `https://api.freepik.com/v1/resources?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        'x-freepik-api-key': apiKey,
        'Accept': 'application/json',
        'Accept-Language': 'en-US',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Freepik API error ${response.status}:`, errorText);
      return [];
    }

    const responseData = await response.json();
    const items = responseData.data || [];

    return items.map((item) => {
      // Extract available formats from meta.available_formats
      const availableFormats = item.meta?.available_formats || {};
      const formats = Object.keys(availableFormats).filter(
        (format) => availableFormats[format]?.total > 0
      );

      // Get image type and thumbnail URL
      const imageType = item.image?.type || 'photo';
      const thumbnailUrl = item.image?.source?.url || '';
      
      // Extract related keywords for tags
      const keywords = item.related?.keywords || [];
      const tags = Array.isArray(keywords) 
        ? keywords.map((k) => typeof k === 'string' ? k : k.name).filter(Boolean)
        : [];

      return {
        id: `freepik-${item.id}`,
        title: item.title || query,
        description: `${imageType.charAt(0).toUpperCase() + imageType.slice(1)} design asset from Freepik`,
        type: imageType,
        thumbnail: thumbnailUrl,
        preview: thumbnailUrl,
        author: item.author?.name || 'Freepik Creator',
        authorAvatar: item.author?.avatar || '',
        downloads: item.stats?.downloads || 0,
        likes: item.stats?.likes || 0,
        tags: tags.slice(0, 10),
        formats: formats.length > 0 ? formats : ['jpg', 'png'],
        source: 'freepik',
        sourceUrl: item.url || '',
        sourceId: item.id,
        isPremium: item.licenses?.some((l) => l.type === 'premium') || false,
        license: item.licenses?.[0]?.type || 'freemium',
        licenseUrl: item.licenses?.[0]?.url || '',
        isNew: item.meta?.is_new || false,
        publishedAt: item.meta?.published_at || null,
        orientation: item.image?.orientation || 'square',
        size: item.image?.source?.size || '',
      };
    });
  } catch (err) {
    console.error('Freepik fetch error:', err);
    return [];
  }
}