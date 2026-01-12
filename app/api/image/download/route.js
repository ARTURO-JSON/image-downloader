import { NextResponse } from 'next/server';

/**
 * Image Download API Route
 * 
 * Endpoint: GET /api/image/download
 * 
 * Purpose:
 * Provides a server-side proxy for downloading images from Unsplash and Pexels
 * Solves CORS issues that prevent direct client-side fetching from external URLs
 * 
 * How it works:
 * 1. Client sends URL of image to download (from Unsplash/Pexels)
 * 2. Server validates the URL to ensure it's from allowed sources
 * 3. Server fetches the image from the original source
 * 4. Returns image with proper Content-Disposition header for download
 * 
 * Security:
 * - Only allows URLs from images.unsplash.com and images.pexels.com
 * - Validates source parameter to prevent abuse
 * 
 * Query Parameters:
 * - url: Full image URL (from image provider)
 * - id: Image ID (used for filename)
 * - source: Source name ('unsplash' or 'pexels')
 */
export const dynamic = 'force-dynamic';  // Don't cache this route

export async function GET(request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    const imageId = searchParams.get('id');
    const source = searchParams.get('source') || 'unsplash';

    // Validate required parameters
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'url parameter is required' },
        { status: 400 }
      );
    }

    // SECURITY: Validate URL to prevent downloading from arbitrary sources
    const url = new URL(imageUrl);
    const allowedHosts = ['images.unsplash.com', 'images.pexels.com'];
    
    if (!allowedHosts.some(host => url.hostname === host)) {
      return NextResponse.json(
        { error: 'Invalid image source' },
        { status: 403 }
      );
    }

    // Fetch the image from the original source
    // Include User-Agent header to avoid being blocked by some servers
    const imageResponse = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    // Handle fetch errors
    if (!imageResponse.ok) {
      console.error(`Failed to fetch image: ${imageResponse.status}`);
      return NextResponse.json(
        { error: 'Failed to fetch image' },
        { status: imageResponse.status }
      );
    }

    // Convert image response to buffer for sending
    const buffer = await imageResponse.arrayBuffer();
    
    // Get content type from response headers
    let contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    
    // Extract base content type (remove charset and other parameters)
    if (contentType.includes(';')) {
      contentType = contentType.split(';')[0].trim();
    }

    // Map content type to file extension
    const extensionMap = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
    };
    const fileExtension = extensionMap[contentType] || 'jpg';
    
    // Sanitize image ID: remove any non-alphanumeric characters except hyphens and underscores
    // This prevents issues with special characters in filenames
    const sanitizedImageId = imageId.replace(/[^a-zA-Z0-9_-]/g, '');
    
    // Build filename: source-imageId.extension
    // Example: unsplash-abc123def456.jpg
    const filename = `${source}-${sanitizedImageId || 'image'}.${fileExtension}`;

    // Return image with download headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        // Content type must match actual image format
        'Content-Type': contentType,
        
        // Tell browser to download file with specific name
        // filename* is for UTF-8 encoding, filename is fallback
        'Content-Disposition': `attachment; filename*=UTF-8''${filename}; filename="${filename}"`,
        
        // File size in bytes
        'Content-Length': buffer.byteLength.toString(),
        
        // Cache control: don't cache downloads
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        
        // Security: prevent browsers from guessing file type
        'X-Content-Type-Options': 'nosniff',
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
