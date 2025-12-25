import { NextResponse } from 'next/server';

/**
 * Download asset - returns redirect URL
 * GET /api/assets/download?id=...&source=...&format=...
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get('id');
    const source = searchParams.get('source');
    const format = searchParams.get('format') || 'jpg';

    if (!assetId || !source) {
      return NextResponse.json(
        { error: 'id and source parameters are required' },
        { status: 400 }
      );
    }

    let downloadUrl = null;

    if (source === 'pixabay') {
      downloadUrl = await getPixabayDownloadUrl(assetId, format);
    } else if (source === 'openverse') {
      downloadUrl = await getOpenverseDownloadUrl(assetId, format);
    } else if (source === 'iconfinder') {
      downloadUrl = await getIconfinderDownloadUrl(assetId, format);
    }

    if (!downloadUrl) {
      return NextResponse.json(
        { error: 'Download URL not available' },
        { status: 404 }
      );
    }

    // Redirect to the actual download URL
    return NextResponse.redirect(downloadUrl);
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to generate download URL',
      },
      { status: 500 }
    );
  }
}

/**
 * Get Pixabay download URL
 */
async function getPixabayDownloadUrl(pixabayId, format) {
  try {
    const apiKey = process.env.PIXABAY_API_KEY;
    const url = `https://pixabay.com/api/?key=${apiKey}&id=${pixabayId}`;

    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();
    const item = data.hits?.[0];

    if (!item) return null;

    // Return the image URL - Pixabay allows direct downloads
    return item.imageURL;
  } catch (err) {
    console.error('Pixabay download error:', err);
    return null;
  }
}

/**
 * Get OpenVerse download URL
 */
async function getOpenverseDownloadUrl(openverseId, format) {
  try {
    const url = `https://api.openverse.org/v1/images/${openverseId}`;

    const response = await fetch(url);
    if (!response.ok) return null;

    const item = await response.json();

    // Return the direct image URL
    return item.url;
  } catch (err) {
    console.error('OpenVerse download error:', err);
    return null;
  }
}

/**
 * Get IconFinder download URL
 */
async function getIconfinderDownloadUrl(iconfinderId, format) {
  try {
    const apiKey = process.env.ICONFINDER_API_KEY;
    const url = `https://api.iconfinder.com/v4/icons/${iconfinderId}/download`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) return null;

    const data = await response.json();

    // IconFinder returns download URLs in their response
    const formatMap = {
      svg: data.formats?.find((f) => f.format === 'svg')?.download_url,
      eps: data.formats?.find((f) => f.format === 'eps')?.download_url,
      png: data.formats?.find((f) => f.format === 'png')?.download_url,
    };

    return formatMap[format] || data.formats?.[0]?.download_url;
  } catch (err) {
    console.error('IconFinder download error:', err);
    return null;
  }
}
