import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Get detailed information about a specific asset
 * GET /api/assets/details?id=...&source=...
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get('id');
    const source = searchParams.get('source');

    if (!assetId || !source) {
      return NextResponse.json(
        { error: 'id and source parameters are required' },
        { status: 400 }
      );
    }

    let assetDetails = null;

    if (source === 'pixabay') {
      assetDetails = await getPixabayDetails(assetId);
    } else if (source === 'openverse') {
      assetDetails = await getOpenverseDetails(assetId);
    } else if (source === 'iconfinder') {
      assetDetails = await getIconfinderDetails(assetId);
    } else if (source === 'freepik') {
      assetDetails = await getFreepikDetails(assetId);
    }

    if (!assetDetails) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      asset: assetDetails,
    });
  } catch (error) {
    console.error('Asset details error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to fetch asset details',
      },
      { status: 500 }
    );
  }
}

/**
 * Get Pixabay asset details
 */
async function getPixabayDetails(pixabayId) {
  try {
    const apiKey = process.env.PIXABAY_API_KEY;
    const url = `https://pixabay.com/api/?key=${apiKey}&id=${pixabayId}`;

    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();
    const item = data.hits?.[0];

    if (!item) return null;

    return {
      id: `pixabay-${item.id}`,
      title: 'Design Asset',
      description: `High-quality design asset from Pixabay`,
      type: item.type === 'vector' ? 'vector' : item.type,
      thumbnail: item.previewURL,
      preview: item.largeImageURL,
      full: item.imageURL,
      author: item.user,
      downloads: item.downloads,
      tags: item.tags?.split(', ') || [],
      formats: ['jpg', 'png'],
      source: 'pixabay',
      sourceUrl: item.pageURL,
      sourceId: item.id,
      width: item.imageWidth,
      height: item.imageHeight,
      category: 'Design',
      license: 'Pixabay License',
    };
  } catch (err) {
    console.error('Pixabay details error:', err);
    return null;
  }
}

/**
 * Get OpenVerse asset details
 */
async function getOpenverseDetails(openverseId) {
  try {
    const url = `https://api.openverse.org/v1/images/${openverseId}`;

    const response = await fetch(url);
    if (!response.ok) return null;

    const item = await response.json();

    return {
      id: `openverse-${item.id}`,
      title: item.title || 'Design Asset',
      description: item.description || 'Creative Commons licensed asset',
      type: 'photo',
      thumbnail: item.thumbnail,
      preview: item.url,
      full: item.url,
      author: item.creator,
      downloads: item.download_count || 0,
      tags: item.tags?.map((t) => t.name) || [],
      formats: ['jpg', 'png'],
      source: 'openverse',
      sourceUrl: item.url,
      sourceId: item.id,
      license: item.license || 'CC0',
      category: 'Photo',
    };
  } catch (err) {
    console.error('OpenVerse details error:', err);
    return null;
  }
}

/**
 * Get IconFinder asset details
 */
async function getIconfinderDetails(iconfinderId) {
  try {
    const apiKey = process.env.ICONFINDER_API_KEY;
    const url = `https://api.iconfinder.com/v4/icons/${iconfinderId}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) return null;

    const item = await response.json();

    return {
      id: `iconfinder-${item.icon_id}`,
      title: item.tags?.[0] || 'SVG Icon',
      description: 'High-quality SVG icon vector',
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
      category: 'Vector',
      license: 'Various',
      isPremium: item.premium,
    };
  } catch (err) {
    console.error('IconFinder details error:', err);
    return null;
  }
}

/**
 * Get Freepik asset details
 * Docs: https://docs.freepik.com/api-reference/resources/get-the-detail-of-a-resource-psd-vector-or-photo
 */
async function getFreepikDetails(freepikId) {
  try {
    const apiKey = process.env.FREEPIK_API_KEY;
    if (!apiKey) {
      console.error('Freepik API key not configured');
      return null;
    }

    const url = `https://api.freepik.com/v1/resources/${freepikId}`;

    const response = await fetch(url, {
      headers: {
        'x-freepik-api-key': apiKey,
        'Accept': 'application/json',
        'Accept-Language': 'en-US',
      },
    });

    if (!response.ok) {
      console.error(`Freepik details API error: ${response.status}`);
      return null;
    }

    const responseData = await response.json();
    const item = responseData.data;

    if (!item) return null;

    // Extract available formats
    const availableFormats = item.available_formats || {};
    const formats = Object.keys(availableFormats).filter(
      (format) => availableFormats[format]?.total > 0
    );

    // Extract tags from related_tags
    const tags = (item.related_tags || []).map((t) => t.name).filter(Boolean);

    // Get dimensions
    const width = item.dimensions?.width || item.preview?.width || 0;
    const height = item.dimensions?.height || item.preview?.height || 0;

    return {
      id: `freepik-${item.id}`,
      title: item.name || 'Design Asset',
      description: `High-quality ${item.type || 'design'} asset from Freepik`,
      type: item.type || 'photo',
      thumbnail: item.preview?.url || '',
      preview: item.preview?.url || '',
      full: item.preview?.url || '',
      author: item.author?.name || 'Freepik Creator',
      authorAvatar: item.author?.avatar || '',
      authorSlug: item.author?.slug || '',
      downloads: 0,
      tags: tags,
      formats: formats.length > 0 ? formats : ['jpg'],
      source: 'freepik',
      sourceUrl: item.url || '',
      sourceId: item.id,
      width: width,
      height: height,
      category: item.type?.charAt(0).toUpperCase() + item.type?.slice(1) || 'Design',
      license: 'Freepik License',
      licenseUrl: item.license || '',
      isPremium: item.premium || false,
      isNew: item.new || false,
      isAiGenerated: item.is_ai_generated || false,
      hasPrompt: item.has_prompt || false,
      createdAt: item.created || null,
      downloadSize: item.download_size || 0,
      slug: item.slug || '',
      relatedResources: item.related_resources || null,
    };
  } catch (err) {
    console.error('Freepik details error:', err);
    return null;
  }
}
