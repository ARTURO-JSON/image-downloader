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
