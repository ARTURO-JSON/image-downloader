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
export async function downloadImage(fullImageUrl, imageId, source = 'unsplash') {
    try {
        // Clean image ID: Keep ONLY alphanumeric characters and hyphens
        // This removes underscores, query params, and any other special chars
        const cleanImageId = imageId.replace(/[^a-zA-Z0-9-]/g, '');
        
        // Encode the full image URL in Base64 to hide it from browser's filename inference
        const encodedUrl = encodeURIComponent(btoa(fullImageUrl));
        
        // Build URL to server-side download proxy
        // Using Base64-encoded URL hides the actual image URL from the browser
        const downloadUrl = `/api/image/download?url=${encodedUrl}&id=${cleanImageId}&source=${source}`;
        
        console.log('Download URL:', downloadUrl);
        
        // Create temporary link element to trigger browser download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.target = '_self';  // Stay on current page (don't open new tab)
        link.download = '';  // Force download behavior
        
        // Append to DOM (required for some browsers), click, then remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('Download initiated');
    } catch (error) {
        console.error('Error downloading image:', error);
        alert('Failed to download image. Please try again.');
    }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use downloadImage() instead
 */
export async function downloadUnsplashImage(fullImageUrl, imageId) {
    return downloadImage(fullImageUrl, imageId, 'unsplash');
}

