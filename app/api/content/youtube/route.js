import { NextResponse } from 'next/server';

/**
 * YouTube Video Download Endpoint
 * Uses RapidAPI for reliable YouTube downloading
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

    // Validate YouTube URL
    if (!url.includes('youtube') && !url.includes('youtu.be')) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    // Check for RapidAPI key
    if (!process.env.RAPIDAPI_KEY) {
      return NextResponse.json(
        { 
          error: 'YouTube download service not configured. Please add RAPIDAPI_KEY to .env.local',
          isDemo: true,
          demoData: {
            success: true,
            videoId: 'dQw4w9WgXcQ',
            title: 'YouTube Video Title',
            duration: 213,
            formats: [
              { quality: '4K (2160p)', format: 'mp4', itag: '313' },
              { quality: '1440p (2K)', format: 'mp4', itag: '271' },
              { quality: '1080p (Full HD)', format: 'mp4', itag: '18' },
              { quality: '720p (HD)', format: 'mp4', itag: '22' },
              { quality: '480p (SD)', format: 'mp4', itag: '135' },
            ],
          }
        },
        { status: 200 }
      );
    }

    // Call RapidAPI YouTube downloader
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': process.env.RAPIDAPI_HOST || 'youtube-media-downloader.p.rapidapi.com'
      }
    };

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: 'Could not extract video ID from URL' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://${process.env.RAPIDAPI_HOST}/v2/video/details?videoId=${videoId}`,
      options
    );

    if (!response.ok) {
      console.error('RapidAPI response:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Could not access this video. It may be private, age-restricted, or unavailable.' },
        { status: 400 }
      );
    }

    const data = await response.json();

    // Parse RapidAPI response
    if (!data || data.errorId !== 'Success' || !data.title) {
      return NextResponse.json(
        { error: 'Could not fetch video information' },
        { status: 400 }
      );
    }

    // Format the response - parse videos and audios from API
    const formats = [];
    
    // Add video formats if available
    if (data.videos && data.videos.items && Array.isArray(data.videos.items)) {
      data.videos.items.forEach(video => {
        if (video.quality || video.qualityLabel) {
          formats.push({
            quality: video.qualityLabel || video.quality,
            format: video.extension || 'mp4',
            itag: video.itag || video.id,
            url: video.url
          });
        }
      });
    }

    // Add audio formats
    if (data.audios && data.audios.items && Array.isArray(data.audios.items)) {
      const audioItem = data.audios.items[0];
      if (audioItem) {
        formats.push({
          quality: 'Audio Only',
          format: audioItem.extension || 'mp3',
          itag: audioItem.itag || '251',
          url: audioItem.url
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        videoId: data.id || videoId,
        title: data.title,
        duration: data.lengthSeconds || 0,
        thumbnail: data.thumbnails && data.thumbnails.length > 0 ? data.thumbnails[data.thumbnails.length - 1].url : null,
        formats: formats.length > 0 ? formats : [
          { quality: '720p', format: 'mp4', itag: '22' },
          { quality: 'Audio Only', format: 'mp3', itag: '251' }
        ],
        downloadUrl: `/api/content/youtube/download?url=${encodeURIComponent(url)}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('YouTube API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video information. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * Extract video ID from YouTube URL
 */
function extractVideoId(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

/**
 * GET endpoint for downloading videos
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const itag = searchParams.get('itag');

    if (!url) {
      return NextResponse.json({
        message: 'YouTube download API endpoint',
        methods: ['POST', 'GET'],
        description: 'POST: Get video info and available formats. GET: Download video',
        examplePost: {
          url: 'https://www.youtube.com/watch?v=...',
        },
      });
    }

    // Validate YouTube URL
    if (!url.includes('youtube') && !url.includes('youtu.be')) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: 'Could not extract video ID' },
        { status: 400 }
      );
    }

    // Get video details from RapidAPI
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': process.env.RAPIDAPI_HOST || 'youtube-media-downloader.p.rapidapi.com'
      }
    };

    const response = await fetch(
      `https://${process.env.RAPIDAPI_HOST}/v2/video/details?videoId=${videoId}`,
      options
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Could not fetch download link' },
        { status: 400 }
      );
    }

    const data = await response.json();

    if (!data || data.errorId !== 'Success') {
      return NextResponse.json(
        { error: 'No download formats available' },
        { status: 400 }
      );
    }

    // Find the requested format by itag
    let downloadUrl = null;
    let extension = 'mp4';
    
    // Check videos first
    if (data.videos && data.videos.items) {
      const video = data.videos.items.find(v => String(v.itag) === String(itag));
      if (video) {
        downloadUrl = video.url;
        extension = video.extension || 'mp4';
      }
    }
    
    // Check audios if not found in videos
    if (!downloadUrl && data.audios && data.audios.items) {
      const audio = data.audios.items.find(a => String(a.itag) === String(itag));
      if (audio) {
        downloadUrl = audio.url;
        extension = audio.extension || 'mp3';
      }
      // If no specific itag, use first audio
      if (!downloadUrl && itag === '251') {
        downloadUrl = data.audios.items[0]?.url;
        extension = data.audios.items[0]?.extension || 'mp3';
      }
    }

    // Fallback to first available video
    if (!downloadUrl && data.videos && data.videos.items && data.videos.items.length > 0) {
      downloadUrl = data.videos.items[0].url;
      extension = data.videos.items[0].extension || 'mp4';
    }

    if (!downloadUrl) {
      return NextResponse.json(
        { error: 'Download URL not found for selected format' },
        { status: 400 }
      );
    }

    // Create safe filename from video title
    const safeTitle = (data.title || 'youtube_video')
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 100);
    const filename = `${safeTitle}.${extension}`;

    // Fetch the video and stream it with download headers
    const videoResponse = await fetch(downloadUrl);
    
    if (!videoResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch video file' },
        { status: 400 }
      );
    }

    // Get the content type and length
    const contentType = videoResponse.headers.get('content-type') || (extension === 'mp3' ? 'audio/mpeg' : 'video/mp4');
    const contentLength = videoResponse.headers.get('content-length');

    // Create response with download headers
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }

    return new NextResponse(videoResponse.body, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('YouTube download error:', error);
    return NextResponse.json(
      { error: 'Failed to download video' },
      { status: 500 }
    );
  }
}
