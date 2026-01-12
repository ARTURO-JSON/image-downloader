import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Server-side image download proxy
 * Handles CORS issues by fetching images on the server
 * GET /api/image/download?url=...&id=...&source=...
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    const imageId = searchParams.get('id');
    const source = searchParams.get('source') || 'unsplash';

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'url parameter is required' },
        { status: 400 }
      );
    }

    // Validate URL to prevent abuse (only allow Unsplash and Pexels)
    const url = new URL(imageUrl);
    const allowedHosts = ['images.unsplash.com', 'images.pexels.com'];
    
    if (!allowedHosts.some(host => url.hostname === host)) {
      return NextResponse.json(
        { error: 'Invalid image source' },
        { status: 403 }
      );
    }

    // Fetch the image from the source
    const imageResponse = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!imageResponse.ok) {
      console.error(`Failed to fetch image: ${imageResponse.status}`);
      return NextResponse.json(
        { error: 'Failed to fetch image' },
        { status: imageResponse.status }
      );
    }

    const buffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

    // Determine file extension from content type
    const extMap = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
    };
    const ext = extMap[contentType] || 'jpg';
    const filename = `${source}-${imageId}.${ext}`;

    // Return image with download headers and CORS support
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.byteLength.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to download image',
      },
      { status: 500 }
    );
  }
}
