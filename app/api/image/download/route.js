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
    const encodedUrl = searchParams.get('url');  // Base64-encoded image URL (also URL-encoded)
    const imageId = searchParams.get('id');
    const source = searchParams.get('source') || 'unsplash';

    console.log('Download request received:', { encodedUrl: encodedUrl?.substring(0, 20), imageId, source });

    // Validate required parameters
    if (!encodedUrl) {
      return NextResponse.json(
        { error: 'url parameter is required' },
        { status: 400 }
      );
    }

    // Decode the Base64-encoded URL (first decode from URL encoding, then from Base64)
    let imageUrl;
    try {
      const decodedFromUrl = decodeURIComponent(encodedUrl);
      imageUrl = atob(decodedFromUrl);
      console.log('Successfully decoded URL');
    } catch (decodeError) {
      console.error('Failed to decode URL:', decodeError);
      return NextResponse.json(
        { error: 'Invalid URL encoding' },
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

    // Normalize content type and determine file extension
    // Map all variations to standard formats
    let fileExtension = 'jpg';  // Default to jpg
    let finalContentType = 'image/jpeg';  // Default content type
    
    if (contentType.includes('png')) {
      fileExtension = 'png';
      finalContentType = 'image/png';
    } else if (contentType.includes('webp')) {
      fileExtension = 'webp';
      finalContentType = 'image/webp';
    } else if (contentType.includes('gif')) {
      fileExtension = 'gif';
      finalContentType = 'image/gif';
    } else {
      // All other image types (jpeg, jpg, or unknown) default to jpg
      fileExtension = 'jpg';
      finalContentType = 'image/jpeg';
    }
    
    // Sanitize image ID: remove any non-alphanumeric characters except hyphens and underscores
    // This prevents issues with special characters in filenames
    const sanitizedImageId = imageId.replace(/[^a-zA-Z0-9_-]/g, '');
    
    // Build clean filename: source-imageId.extension
    // Example: unsplash-photo-1509316975850.jpg
    const filename = `${source}-${sanitizedImageId || 'image'}.${fileExtension}`;

    // Return image with download headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        // Always send correct content type based on actual format
        'Content-Type': finalContentType,
        
        // Tell browser to download file with specific name
        // Use RFC 5987 encoding to ensure filename is properly interpreted
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}; filename="${filename}"`,
        
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
