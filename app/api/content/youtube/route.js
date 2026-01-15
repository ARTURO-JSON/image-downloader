import { NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';

/**
 * YouTube Video Download Endpoint
 * Uses @distube/ytdl-core for YouTube video downloading (no external API required)
 */

// Helper function to validate YouTube URL
function isValidYouTubeUrl(url) {
  const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)[\w-]+/;
  return pattern.test(url);
}

// Helper function to extract video ID
function extractVideoId(url) {
  try {
    // Handle youtu.be links
    if (url.includes('youtu.be/')) {
      const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
      return match ? match[1] : null;
    }
    
    // Handle YouTube shorts
    if (url.includes('/shorts/')) {
      const match = url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
      return match ? match[1] : null;
    }
    
    // Handle youtube.com links
    const urlObj = new URL(url);
    return urlObj.searchParams.get('v') || null;
  } catch {
    return null;
  }
}

// Helper function to filter formats with valid URLs
function getPlayableFormats(formats) {
  return formats.filter(f => f.url && f.url.length > 0);
}

// POST endpoint for getting video info and download URLs
export async function POST(request) {
  try {
    const { url, resolution } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    if (!isValidYouTubeUrl(url) && !ytdl.validateURL(url)) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    console.log('[YouTube API] Processing URL:', url);
    console.log('[YouTube API] Requested resolution:', resolution);

    // Get video info using ytdl-core
    const info = await ytdl.getInfo(url);
    const videoDetails = info.videoDetails;

    // Get available formats - only include those with valid URLs
    const allFormats = getPlayableFormats(info.formats);
    
    if (allFormats.length === 0) {
      console.log('[YouTube API] No playable formats found, trying alternative methods');
      // Return basic info even if no playable formats
      return NextResponse.json({
        success: false,
        error: 'No playable formats available. YouTube may be blocking this video.',
        video: {
          id: videoDetails.videoId,
          title: videoDetails.title,
          author: videoDetails.author.name,
          channelUrl: videoDetails.author.channel_url,
          length: parseInt(videoDetails.lengthSeconds),
          views: parseInt(videoDetails.viewCount),
          description: videoDetails.description?.substring(0, 500),
          publishDate: videoDetails.publishDate,
          thumbnail: videoDetails.thumbnails[videoDetails.thumbnails.length - 1]?.url,
        },
        formats: { video: [], audio: [] },
        availableResolutions: [],
        selectedFormat: null,
      });
    }

    const progressiveFormats = allFormats
      .filter(f => f.hasVideo && f.hasAudio && f.container === 'mp4')
      .map(f => ({
        quality: f.qualityLabel || f.quality,
        resolution: f.qualityLabel,
        itag: f.itag,
        mimeType: f.mimeType,
        hasAudio: f.hasAudio,
        hasVideo: f.hasVideo,
        url: f.url,
        contentLength: f.contentLength,
      }))
      .sort((a, b) => {
        // Sort by quality (highest first)
        const aRes = parseInt(a.resolution) || 0;
        const bRes = parseInt(b.resolution) || 0;
        return bRes - aRes;
      });

    // Get audio-only formats for MP3 conversion
    const audioFormats = allFormats
      .filter(f => f.hasAudio && !f.hasVideo)
      .map(f => ({
        quality: `${f.audioBitrate}kbps`,
        audioBitrate: f.audioBitrate,
        itag: f.itag,
        mimeType: f.mimeType,
        url: f.url,
        contentLength: f.contentLength,
      }))
      .sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0));

    // Get unique resolutions
    const availableResolutions = [...new Set(
      progressiveFormats
        .filter(f => f.resolution)
        .map(f => f.resolution)
    )];

    // If a specific resolution is requested, find the download URL
    let selectedFormat = null;
    if (resolution) {
      selectedFormat = progressiveFormats.find(f => 
        f.resolution === resolution || 
        f.resolution === `${resolution}p`
      );
      
      // If exact match not found, get the closest available
      if (!selectedFormat && progressiveFormats.length > 0) {
        selectedFormat = progressiveFormats[0]; // Highest quality available
      }
    }

    // Response
    return NextResponse.json({
      success: true,
      video: {
        id: videoDetails.videoId,
        title: videoDetails.title,
        author: videoDetails.author.name,
        channelUrl: videoDetails.author.channel_url,
        length: parseInt(videoDetails.lengthSeconds),
        views: parseInt(videoDetails.viewCount),
        description: videoDetails.description?.substring(0, 500),
        publishDate: videoDetails.publishDate,
        thumbnail: videoDetails.thumbnails[videoDetails.thumbnails.length - 1]?.url,
      },
      formats: {
        video: progressiveFormats.slice(0, 6), // Limit to top 6 qualities
        audio: audioFormats.slice(0, 3), // Top 3 audio qualities
      },
      availableResolutions,
      selectedFormat: selectedFormat ? {
        resolution: selectedFormat.resolution,
        downloadUrl: selectedFormat.url,
        contentLength: selectedFormat.contentLength,
        itag: selectedFormat.itag,
      } : null,
    });
  } catch (error) {
    console.error('[YouTube API] POST Error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to get video information' },
      { status: 500 }
    );
  }
}

// GET endpoint for downloading video or getting info
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const action = searchParams.get('action') || 'info';
    const itag = searchParams.get('itag');

    // Return API info if no URL provided
    if (!url) {
      return NextResponse.json({
        message: 'YouTube Download API',
        endpoints: {
          'POST /api/content/youtube': {
            description: 'Get video info and download URLs',
            body: { url: 'YouTube URL', resolution: '720p (optional)' },
          },
          'GET /api/content/youtube?url=...&action=info': {
            description: 'Get video information',
          },
          'GET /api/content/youtube?url=...&action=resolutions': {
            description: 'Get available resolutions',
          },
          'GET /api/content/youtube?url=...&itag=18': {
            description: 'Stream video by itag',
          },
        },
      });
    }

    if (!isValidYouTubeUrl(url) && !ytdl.validateURL(url)) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    // Get video info
    const info = await ytdl.getInfo(url);
    const playableFormats = getPlayableFormats(info.formats);

    // Action: resolutions - Get available resolutions only
    if (action === 'resolutions') {
      const progressiveResolutions = [...new Set(
        playableFormats
          .filter(f => f.hasVideo && f.hasAudio && f.container === 'mp4' && f.qualityLabel)
          .map(f => f.qualityLabel)
      )].sort();

      const allResolutions = [...new Set(
        playableFormats
          .filter(f => f.container === 'mp4' && f.qualityLabel)
          .map(f => f.qualityLabel)
      )].sort();

      return NextResponse.json({
        success: true,
        progressive: progressiveResolutions,
        all: allResolutions,
      });
    }

    // Action: download/stream by itag
    if (itag) {
      const format = playableFormats.find(f => f.itag === parseInt(itag));
      
      if (!format || !format.url) {
        // Try to find any playable format as fallback
        const fallbackFormat = playableFormats.find(f => f.hasVideo && f.hasAudio && f.container === 'mp4');
        
        if (fallbackFormat && fallbackFormat.url) {
          console.log('[YouTube API] Requested itag not available, using fallback:', fallbackFormat.itag);
          return NextResponse.json({
            success: true,
            downloadUrl: fallbackFormat.url,
            quality: fallbackFormat.qualityLabel || 'auto',
            mimeType: fallbackFormat.mimeType,
            contentLength: fallbackFormat.contentLength,
            note: `Requested quality not available. Using ${fallbackFormat.qualityLabel || 'best available'} instead.`,
          });
        }
        
        return NextResponse.json(
          { error: 'Failed to find any playable formats. YouTube may be blocking this video.' },
          { status: 400 }
        );
      }

      // Return the direct download URL
      return NextResponse.json({
        success: true,
        downloadUrl: format.url,
        quality: format.qualityLabel,
        mimeType: format.mimeType,
        contentLength: format.contentLength,
      });
    }

    // Default action: info
    const videoDetails = info.videoDetails;
    
    const formats = playableFormats
      .filter(f => f.hasVideo && f.hasAudio && f.container === 'mp4')
      .map(f => ({
        quality: f.qualityLabel,
        itag: f.itag,
        mimeType: f.mimeType,
        url: f.url,
      }))
      .slice(0, 6);

    return NextResponse.json({
      success: true,
      video: {
        id: videoDetails.videoId,
        title: videoDetails.title,
        author: videoDetails.author.name,
        length: parseInt(videoDetails.lengthSeconds),
        views: parseInt(videoDetails.viewCount),
        thumbnail: videoDetails.thumbnails[videoDetails.thumbnails.length - 1]?.url,
      },
      formats,
    });
  } catch (error) {
    console.error('[YouTube API] GET Error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to get video information' },
      { status: 500 }
    );
  }
}
