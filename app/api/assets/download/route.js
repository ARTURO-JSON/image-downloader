import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Download asset - fetches and returns the file with download headers
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
    let filename = `${source}-${assetId}.${format}`;

    if (source === 'pixabay') {
      downloadUrl = await getPixabayDownloadUrl(assetId, format);
    } else if (source === 'openverse') {
      downloadUrl = await getOpenverseDownloadUrl(assetId, format);
    } else if (source === 'iconfinder') {
      downloadUrl = await getIconfinderDownloadUrl(assetId, format);
    } else if (source === 'freepik') {
      downloadUrl = await getFreepikDownloadUrl(assetId, format);
    }

    if (!downloadUrl) {
      return NextResponse.json(
        { error: 'Download URL not available' },
        { status: 404 }
      );
    }

    // Fetch the actual image file
    const imageResponse = await fetch(downloadUrl);
    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch image' },
        { status: 500 }
      );
    }

    // Get the image data as buffer
    const imageBuffer = await imageResponse.arrayBuffer();
    
    // Determine content type
    const contentType = imageResponse.headers.get('content-type') || `image/${format}`;
    
    // Extract extension from content type if possible
    const extMap = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/svg+xml': 'svg',
      'image/gif': 'gif',
      'image/webp': 'webp',
    };
    const ext = extMap[contentType] || format;
    filename = `${source}-${assetId}.${ext}`;

    // Return the image with download headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': imageBuffer.byteLength.toString(),
      },
    });
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
    if (!apiKey) {
      console.error('Pixabay API key not configured');
      return null;
    }
    
    const url = `https://pixabay.com/api/?key=${apiKey}&id=${pixabayId}`;

    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Pixabay API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const item = data.hits?.[0];

    if (!item) return null;

    // Return the best available URL
    // imageURL requires paid API, largeImageURL is available on free tier
    // webformatURL is smaller but always available
    return item.largeImageURL || item.webformatURL || item.previewURL;
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

/**
 * Get Freepik download URL
 * Docs: https://docs.freepik.com/api-reference/resources/download-a-resource
 */
async function getFreepikDownloadUrl(freepikId, format) {
  try {
    const apiKey = process.env.FREEPIK_API_KEY;
    if (!apiKey) {
      console.error('Freepik API key not configured');
      return null;
    }

    const url = `https://api.freepik.com/v1/resources/${freepikId}/download`;

    const response = await fetch(url, {
      headers: {
        'x-freepik-api-key': apiKey,
        'Accept': 'application/json',
        'Accept-Language': 'en-US',
      },
    });

    if (!response.ok) {
      console.error(`Freepik download API error: ${response.status}`);
      // If download fails, try to get the preview URL from details
      return await getFreepikPreviewUrl(freepikId);
    }

    const responseData = await response.json();
    const data = responseData.data;

    // Freepik returns either a signed_url (for photos) or a url (for vectors/psd)
    return data?.signed_url || data?.url || null;
  } catch (err) {
    console.error('Freepik download error:', err);
    return null;
  }
}

/**
 * Fallback: Get Freepik preview URL when download is not available
 */
async function getFreepikPreviewUrl(freepikId) {
  try {
    const apiKey = process.env.FREEPIK_API_KEY;
    if (!apiKey) return null;

    const url = `https://api.freepik.com/v1/resources/${freepikId}`;

    const response = await fetch(url, {
      headers: {
        'x-freepik-api-key': apiKey,
        'Accept': 'application/json',
        'Accept-Language': 'en-US',
      },
    });

    if (!response.ok) return null;

    const responseData = await response.json();
    const item = responseData.data;

    // Return the preview URL as fallback
    return item?.preview?.url || null;
  } catch (err) {
    console.error('Freepik preview URL error:', err);
    return null;
  }
}
