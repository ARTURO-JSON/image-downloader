import { NextResponse } from 'next/server';

/**
 * Instagram Content Download Endpoint
 * Uses RapidAPI for Instagram media downloading
 */
export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate Instagram URL
    if (!url.includes('instagram.com')) {
      return NextResponse.json(
        { error: 'Invalid Instagram URL' },
        { status: 400 }
      );
    }

    // Check for RapidAPI key
    if (!process.env.RAPIDAPI_KEY) {
      return NextResponse.json(
        { error: 'Instagram download service not configured' },
        { status: 500 }
      );
    }

    // Extract shortcode from Instagram URL
    const shortcode = extractShortcode(url);
    if (!shortcode) {
      return NextResponse.json(
        { error: 'Could not extract post ID from URL. Please use a direct post/reel URL.' },
        { status: 400 }
      );
    }

    // Call RapidAPI Instagram downloader
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': process.env.INSTAGRAM_RAPIDAPI_HOST || 'instagram120.p.rapidapi.com'
      },
      body: JSON.stringify({ url })
    };

    const response = await fetch(
      `https://${process.env.INSTAGRAM_RAPIDAPI_HOST || 'instagram120.p.rapidapi.com'}/api/instagram/links`,
      options
    );

    if (!response.ok) {
      console.error('Instagram RapidAPI response:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Could not access this content. It may be private or unavailable.' },
        { status: 400 }
      );
    }

    const data = await response.json();

    // Parse the response
    if (!data) {
      return NextResponse.json(
        { error: 'Could not fetch content information' },
        { status: 400 }
      );
    }

    // Debug log
    console.log('Instagram API response:', JSON.stringify(data, null, 2).slice(0, 500));

    // Format the response based on API structure
    // API can return: 
    // 1. Array format: [{ urls: [...], meta: {...}, pictureUrl: ... }, ...]
    // 2. Object format: { value: [{ urls: [...], meta: {...}, pictureUrl: ... }, ...], Count: N }
    const mediaItems = [];
    let author = 'Unknown';
    let caption = 'Instagram Content';
    let thumbnail = null;
    
    // Normalize data - handle both array and object formats
    const itemsArray = Array.isArray(data) ? data : (data.value && Array.isArray(data.value)) ? data.value : null;
    
    if (itemsArray && itemsArray.length > 0) {
      // Process items array
      itemsArray.forEach((item, index) => {
        // Get author and caption from first item's meta
        if (index === 0 && item.meta) {
          author = item.meta.username || 'Unknown';
          caption = item.meta.title || 'Instagram Content';
          thumbnail = item.pictureUrl || null;
        }
        
        // Get download URLs from each item
        if (item.urls && Array.isArray(item.urls)) {
          item.urls.forEach((urlItem) => {
            const downloadUrl = urlItem.url || urlItem;
            const extension = urlItem.extension || 'jpg';
            const isVideo = extension === 'mp4' || downloadUrl.includes('.mp4');
            
            mediaItems.push({
              id: mediaItems.length,
              url: downloadUrl,
              type: isVideo ? 'video' : 'image',
              thumbnail: item.pictureUrl || null,
              extension: extension
            });
          });
        }
      });
    } else if (data.urls && Array.isArray(data.urls)) {
      // Fallback: direct urls array
      data.urls.forEach((item, index) => {
        mediaItems.push({
          id: index,
          url: item.url || item,
          type: item.type || (item.url?.includes('.mp4') ? 'video' : 'image'),
          thumbnail: item.thumbnail || null
        });
      });
      author = data.author || data.username || 'Unknown';
      caption = data.caption || data.title || 'Instagram Content';
    } else if (data.url) {
      // Single URL fallback
      mediaItems.push({
        id: 0,
        url: data.url,
        type: data.type || 'video',
        thumbnail: data.thumbnail || null
      });
      author = data.author || data.username || 'Unknown';
      caption = data.caption || data.title || 'Instagram Content';
    }

    return NextResponse.json(
      {
        success: true,
        shortcode,
        caption,
        author,
        thumbnail,
        mediaItems: mediaItems.length > 0 ? mediaItems : null,
        downloadUrl: `/api/content/instagram?url=${encodeURIComponent(url)}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Instagram API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content information. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * Extract shortcode from Instagram URL
 */
function extractShortcode(url) {
  // Match patterns like:
  // instagram.com/p/SHORTCODE/
  // instagram.com/reel/SHORTCODE/
  // instagram.com/reels/SHORTCODE/
  // instagram.com/tv/SHORTCODE/
  const match = url.match(/instagram\.com\/(?:p|reel|reels|tv)\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

/**
 * GET endpoint for downloading Instagram content
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const mediaUrl = searchParams.get('mediaUrl');

    if (!url && !mediaUrl) {
      return NextResponse.json({
        message: 'Instagram download API endpoint',
        methods: ['POST', 'GET'],
        description: 'POST: Get content info. GET: Download media',
      });
    }

    // If direct media URL provided, fetch and stream it
    if (mediaUrl) {
      const mediaResponse = await fetch(mediaUrl);
      
      if (!mediaResponse.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch media' },
          { status: 400 }
        );
      }

      const contentType = mediaResponse.headers.get('content-type') || 'video/mp4';
      const isVideo = contentType.includes('video');
      const extension = isVideo ? 'mp4' : 'jpg';
      const filename = `instagram_${Date.now()}.${extension}`;

      const headers = new Headers();
      headers.set('Content-Type', contentType);
      headers.set('Content-Disposition', `attachment; filename="${filename}"`);

      return new NextResponse(mediaResponse.body, {
        status: 200,
        headers
      });
    }

    // Validate Instagram URL
    if (!url.includes('instagram.com')) {
      return NextResponse.json(
        { error: 'Invalid Instagram URL' },
        { status: 400 }
      );
    }

    // Get content info first via POST logic
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': process.env.INSTAGRAM_RAPIDAPI_HOST || 'instagram120.p.rapidapi.com'
      },
      body: JSON.stringify({ url })
    };

    const response = await fetch(
      `https://${process.env.INSTAGRAM_RAPIDAPI_HOST || 'instagram120.p.rapidapi.com'}/api/instagram/links`,
      options
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Could not fetch download link' },
        { status: 400 }
      );
    }

    const data = await response.json();

    // Get the first download URL - handle both array and object formats
    let downloadUrl = null;
    
    // Handle array format: [{ urls: [...] }]
    if (Array.isArray(data) && data.length > 0) {
      const firstItem = data[0];
      if (firstItem.urls && firstItem.urls.length > 0) {
        downloadUrl = firstItem.urls[0].url || firstItem.urls[0];
      }
    } else if (data.value && Array.isArray(data.value) && data.value.length > 0) {
      // Object format: { value: [{ urls: [...] }] }
      const firstItem = data.value[0];
      if (firstItem.urls && firstItem.urls.length > 0) {
        downloadUrl = firstItem.urls[0].url || firstItem.urls[0];
      }
    } else if (data.urls && data.urls.length > 0) {
      downloadUrl = data.urls[0].url || data.urls[0];
    } else if (data.url) {
      downloadUrl = data.url;
    }

    if (!downloadUrl) {
      return NextResponse.json(
        { error: 'No download URL found' },
        { status: 400 }
      );
    }

    // Fetch and stream the media
    const mediaResponse = await fetch(downloadUrl);
    
    if (!mediaResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch media file' },
        { status: 400 }
      );
    }

    const contentType = mediaResponse.headers.get('content-type') || 'video/mp4';
    const isVideo = contentType.includes('video');
    const extension = isVideo ? 'mp4' : 'jpg';
    const filename = `instagram_${Date.now()}.${extension}`;

    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);

    return new NextResponse(mediaResponse.body, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Instagram download error:', error);
    return NextResponse.json(
      { error: 'Failed to download content' },
      { status: 500 }
    );
  }
}
