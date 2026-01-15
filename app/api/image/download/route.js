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
    const downloadLocation = searchParams.get('downloadLocation'); // For Unsplash download event

    console.log('=== Download Request ===');
    console.log('Encoded URL length:', encodedUrl?.length);
    console.log('Image ID:', imageId);
    console.log('Source:', source);
    console.log('Has download location:', !!downloadLocation);

    // Validate required parameters
    if (!encodedUrl) {
      console.error('ERROR: No encoded URL provided');
      return NextResponse.json(
        { error: 'url parameter is required' },
        { status: 400 }
      );
    }

    // Trigger Unsplash download event if downloadLocation is provided
    // This is required by Unsplash API for production use
    if (source === 'unsplash' && downloadLocation) {
      try {
        const decodedDownloadLocation = decodeURIComponent(atob(downloadLocation));
        console.log('Triggering Unsplash download event...');
        
        const triggerResponse = await fetch(decodedDownloadLocation, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });
        
        console.log('Unsplash download event triggered:', triggerResponse.ok);
      } catch (triggerError) {
        console.error('Failed to trigger Unsplash download event:', triggerError);
        // Continue with download even if trigger fails
      }
    }

    // Decode the Base64-encoded URL
    // searchParams.get() already handles URL decoding, so we just need to Base64 decode
    let imageUrl;
    try {
      imageUrl = atob(encodedUrl);
      console.log('Successfully decoded URL:', imageUrl.substring(0, 100));
    } catch (decodeError) {
      console.error('Failed to decode URL:', decodeError);
      return NextResponse.json(
        { error: 'Invalid URL encoding' },
        { status: 400 }
      );
    }

    // SECURITY: Validate URL to prevent downloading from arbitrary sources
    const url = new URL(imageUrl);
    // Pexels uses images.pexels.com domain
    const allowedHosts = ['images.unsplash.com', 'images.pexels.com'];
    
    const isAllowed = allowedHosts.some(host => url.hostname === host);
    
    console.log('URL validation:', { 
      hostname: url.hostname, 
      allowed: isAllowed,
      fullUrl: imageUrl.substring(0, 100)
    });
    
    if (!isAllowed) {
      return NextResponse.json(
        { error: `Invalid image source: ${url.hostname}` },
        { status: 403 }
      );
    }

    // Fetch the image from the original source
    // Include User-Agent header to avoid being blocked by some servers
    // Allow redirects (important for Pexels which may redirect)
    const imageResponse = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
      redirect: 'follow',  // Allow redirects for Pexels
    });

    // Handle fetch errors
    if (!imageResponse.ok) {
      console.error(`Failed to fetch image: ${imageResponse.status} from ${imageUrl}`);
      return NextResponse.json(
        { error: `Failed to fetch image: ${imageResponse.status}` },
        { status: imageResponse.status }
      );
    }

    // Convert image response to buffer for sending
    let buffer;
    try {
      buffer = await imageResponse.arrayBuffer();
      console.log('Image buffer created, size:', buffer.byteLength, 'bytes');
    } catch (bufferError) {
      console.error('Failed to create buffer:', bufferError);
      return NextResponse.json(
        { error: 'Failed to process image' },
        { status: 500 }
      );
    }
    
    // Validate buffer is not empty
    if (!buffer || buffer.byteLength === 0) {
      console.error('Image buffer is empty');
      return NextResponse.json(
        { error: 'Image data is empty' },
        { status: 500 }
      );
    }
    
    // Get content type from response headers
    let contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    
    // Extract base content type (remove charset and other parameters)
    if (contentType.includes(';')) {
      contentType = contentType.split(';')[0].trim();
    }

    // Try to extract file extension from the URL as well (especially useful for Pexels)
    let urlExtension = null;
    try {
      const urlPath = new URL(imageUrl).pathname.toLowerCase();
      const urlMatch = urlPath.match(/\.([a-z]+)(?:\?|$)/);
      if (urlMatch && urlMatch[1]) {
        urlExtension = urlMatch[1];
      }
    } catch (e) {
      // Silently fail URL parsing
    }

    // Normalize content type and determine file extension
    // Map all variations to standard formats
    let fileExtension = 'jpg';  // Default to jpg
    let finalContentType = 'image/jpeg';  // Default content type
    
    if (contentType.includes('png') || urlExtension === 'png') {
      fileExtension = 'png';
      finalContentType = 'image/png';
    } else if (contentType.includes('webp') || urlExtension === 'webp') {
      fileExtension = 'webp';
      finalContentType = 'image/webp';
    } else if (contentType.includes('gif') || urlExtension === 'gif') {
      fileExtension = 'gif';
      finalContentType = 'image/gif';
    } else if (contentType.includes('jpeg') || contentType.includes('jpg') || urlExtension === 'jpg' || urlExtension === 'jpeg') {
      fileExtension = 'jpg';
      finalContentType = 'image/jpeg';
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
    
    console.log('Built filename:', filename, 'Extension:', fileExtension, 'ContentType:', finalContentType);

    // Return image with download headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        // Always send correct content type based on actual format
        'Content-Type': finalContentType,
        
        // Tell browser to download file with specific name
        // Simple format that works in all browsers
        'Content-Disposition': `attachment; filename="${filename}"`,
        
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
    console.error('=== Download Error ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error:', error);
    
    return NextResponse.json(
      {
        error: error.message || 'Failed to download image',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
