import { NextResponse } from 'next/server';

/**
 * TikTok Content Download Endpoint
 * Uses RapidAPI for TikTok video downloading without watermark
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

    // Validate TikTok URL
    if (!url.includes('tiktok.com')) {
      return NextResponse.json(
        { error: 'Invalid TikTok URL' },
        { status: 400 }
      );
    }

    // Check for RapidAPI key
    if (!process.env.RAPIDAPI_KEY) {
      return NextResponse.json(
        { error: 'TikTok download service not configured' },
        { status: 500 }
      );
    }

    // Call RapidAPI TikTok downloader
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'tiktok-video-no-watermark2.p.rapidapi.com'
      },
      body: new URLSearchParams({ url })
    };

    const response = await fetch(
      'https://tiktok-video-no-watermark2.p.rapidapi.com/',
      options
    );

    if (!response.ok) {
      console.error('TikTok RapidAPI response:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Could not access this content. It may be private or unavailable.' },
        { status: 400 }
      );
    }

    const data = await response.json();

    // Debug log
    console.log('TikTok API response:', JSON.stringify(data, null, 2).slice(0, 500));

    // Parse the response
    if (!data || !data.data) {
      return NextResponse.json(
        { error: 'Could not fetch content information' },
        { status: 400 }
      );
    }

    const videoData = data.data;
    const mediaItems = [];

    // Get video without watermark
    if (videoData.play) {
      mediaItems.push({
        id: 0,
        url: videoData.play,
        type: 'video',
        quality: 'No Watermark',
        thumbnail: videoData.cover || videoData.origin_cover
      });
    }

    // Get HD video without watermark if available
    if (videoData.hdplay) {
      mediaItems.push({
        id: 1,
        url: videoData.hdplay,
        type: 'video',
        quality: 'HD No Watermark',
        thumbnail: videoData.cover || videoData.origin_cover
      });
    }

    // Get watermarked version as fallback
    if (videoData.wmplay) {
      mediaItems.push({
        id: 2,
        url: videoData.wmplay,
        type: 'video',
        quality: 'With Watermark',
        thumbnail: videoData.cover || videoData.origin_cover
      });
    }

    // Get music/audio
    if (videoData.music) {
      mediaItems.push({
        id: 3,
        url: videoData.music,
        type: 'audio',
        quality: 'Audio Only',
        thumbnail: videoData.music_info?.cover || null
      });
    }

    return NextResponse.json(
      {
        success: true,
        title: videoData.title || 'TikTok Video',
        author: videoData.author?.nickname || videoData.author?.unique_id || 'Unknown',
        authorAvatar: videoData.author?.avatar || null,
        thumbnail: videoData.cover || videoData.origin_cover || null,
        duration: videoData.duration || 0,
        playCount: videoData.play_count || 0,
        likeCount: videoData.digg_count || 0,
        commentCount: videoData.comment_count || 0,
        shareCount: videoData.share_count || 0,
        mediaItems: mediaItems.length > 0 ? mediaItems : null,
        musicInfo: videoData.music_info ? {
          title: videoData.music_info.title,
          author: videoData.music_info.author,
          cover: videoData.music_info.cover
        } : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('TikTok API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content information. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for downloading TikTok content
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const mediaUrl = searchParams.get('mediaUrl');
    const type = searchParams.get('type') || 'video';

    if (!url && !mediaUrl) {
      return NextResponse.json({
        message: 'TikTok download API endpoint',
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

      const contentType = type === 'audio' ? 'audio/mpeg' : 'video/mp4';
      const extension = type === 'audio' ? 'mp3' : 'mp4';
      const filename = `tiktok_${Date.now()}.${extension}`;

      const headers = new Headers();
      headers.set('Content-Type', contentType);
      headers.set('Content-Disposition', `attachment; filename="${filename}"`);

      return new NextResponse(mediaResponse.body, {
        status: 200,
        headers
      });
    }

    // Validate TikTok URL
    if (!url.includes('tiktok.com')) {
      return NextResponse.json(
        { error: 'Invalid TikTok URL' },
        { status: 400 }
      );
    }

    // Get content info first via POST logic
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'tiktok-video-no-watermark2.p.rapidapi.com'
      },
      body: new URLSearchParams({ url })
    };

    const response = await fetch(
      'https://tiktok-video-no-watermark2.p.rapidapi.com/',
      options
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Could not fetch download link' },
        { status: 400 }
      );
    }

    const data = await response.json();

    // Get the download URL (prefer HD no watermark)
    let downloadUrl = null;
    if (data.data) {
      downloadUrl = data.data.hdplay || data.data.play || data.data.wmplay;
    }

    if (!downloadUrl) {
      return NextResponse.json(
        { error: 'No download URL found' },
        { status: 400 }
      );
    }

    // Fetch and stream the video
    const mediaResponse = await fetch(downloadUrl);
    
    if (!mediaResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch media file' },
        { status: 400 }
      );
    }

    const filename = `tiktok_${Date.now()}.mp4`;

    const headers = new Headers();
    headers.set('Content-Type', 'video/mp4');
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);

    return new NextResponse(mediaResponse.body, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('TikTok download error:', error);
    return NextResponse.json(
      { error: 'Failed to download content' },
      { status: 500 }
    );
  }
}
