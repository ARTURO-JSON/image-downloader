import { NextResponse } from 'next/server';

const VIDU_RAPIDAPI_HOST = process.env.VIDU_RAPIDAPI_HOST;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

export async function POST(request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    console.log('[VIDU API] Host:', VIDU_RAPIDAPI_HOST);
    console.log('[VIDU API] URL:', url);

    // Try the download endpoint
    const response = await fetch(`https://${VIDU_RAPIDAPI_HOST}/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': VIDU_RAPIDAPI_HOST,
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();
    console.log('[VIDU API] Response:', JSON.stringify(data, null, 2));
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('[VIDU API] Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
