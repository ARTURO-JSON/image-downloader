/**
 * Image Download Utility
 * 
 * Handles downloading images from Unsplash and Pexels through a server-side proxy
 * to avoid CORS issues. The proxy endpoint handles URL validation and file streaming.
 */

/**
 * Downloads an image file to the user's device
 * 
 * Uses the server-side /api/image/download endpoint to bypass CORS restrictions
 * that would prevent direct fetching from Unsplash/Pexels URLs
 * 
 * @param {string} fullImageUrl - The full resolution image URL from the image provider
 * @param {string} imageId - Unique image ID (used for generating filename)
 * @param {string} source - Source of the image ('unsplash' or 'pexels')
 * 
 * Flow:
 * 1. Clean the image ID to ensure it's just alphanumeric characters
 * 2. Encode image URL in Base64 to prevent browser filename inference
 * 3. Create a link to the server proxy endpoint
 * 4. Trigger browser download which respects Content-Disposition header
 * 5. Server fetches the image and returns with proper file headers
 * 6. Browser saves file with correct name and extension
 * 
 * Fallback:
 * If an error occurs, opens the image in a new tab instead
 */
/**
 * Downloads an image file to the user's device
 * 
 * Uses the server-side /api/image/download endpoint to bypass CORS restrictions
 * that would prevent direct fetching from Unsplash/Pexels URLs
 * 
 * For Unsplash: Also triggers download event at Unsplash for statistics
 * 
 * @param {string} fullImageUrl - The full resolution image URL from the image provider
 * @param {string} imageId - Unique image ID (used for generating filename)
 * @param {string} source - Source of the image ('unsplash' or 'pexels')
 * @param {string} downloadLocation - Optional Unsplash download_location URL for triggering download event
 */
export async function downloadImage(fullImageUrl, imageId, source = 'unsplash', downloadLocation = null) {
    try {
        console.log('=== Download Image Function ===');
        console.log('Image URL:', fullImageUrl?.substring(0, 100));
        console.log('Image ID:', imageId);
        console.log('Source:', source);
        console.log('Has download location:', !!downloadLocation);

        if (!fullImageUrl) {
            throw new Error('Image URL is missing');
        }

        // Clean image ID: Keep ONLY alphanumeric characters and hyphens
        const cleanImageId = imageId.toString().replace(/[^a-zA-Z0-9-]/g, '');
        
        console.log('Clean Image ID:', cleanImageId);
        
        // Encode the full image URL in Base64
        const encodedUrl = btoa(fullImageUrl);
        console.log('Encoded URL length:', encodedUrl.length);
        
        // Build URL to server-side download proxy with proper URL encoding
        let downloadUrl = `/api/image/download?url=${encodeURIComponent(encodedUrl)}&id=${encodeURIComponent(cleanImageId)}&source=${encodeURIComponent(source)}`;
        
        // Add download location for Unsplash download event tracking (required for production API)
        // Encode it as Base64 then URL encode to handle special characters safely
        if (downloadLocation) {
            const encodedDownloadLocation = btoa(downloadLocation);
            downloadUrl += `&downloadLocation=${encodeURIComponent(encodedDownloadLocation)}`;
            console.log('Added Unsplash download location for tracking');
        }
        
        console.log('Download URL created');
        
        // Create temporary link element to trigger browser download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.target = '_self';
        link.download = '';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('Download initiated successfully');
    } catch (error) {
        console.error('=== Download Error ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        alert(`Failed to download image: ${error.message}`);
    }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use downloadImage() instead
 */
export async function downloadUnsplashImage(fullImageUrl, imageId) {
    return downloadImage(fullImageUrl, imageId, 'unsplash');
}

