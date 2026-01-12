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
 * 2. Create a link to the server proxy endpoint with image details
 * 3. Trigger browser download which respects Content-Disposition header
 * 4. Server fetches the image and returns with proper file headers
 * 5. Browser saves file with correct name and extension
 * 
 * Fallback:
 * If an error occurs, opens the image in a new tab instead
 */
export async function downloadImage(fullImageUrl, imageId, source = 'unsplash') {
    try {
        // Clean image ID: extract only the alphanumeric part (before any special characters)
        // This handles cases where ID might contain query parameters or special chars
        const cleanImageId = imageId.split(/[?_,\s]|%/)[0];
        
        // Build URL to server-side download proxy
        // IMPORTANT: Add a timestamp query param to prevent browser from using URL as filename
        // This ensures the browser uses our Content-Disposition header instead
        const timestamp = Date.now();
        const downloadUrl = `/api/image/download?url=${encodeURIComponent(fullImageUrl)}&id=${cleanImageId}&source=${source}&t=${timestamp}`;
        
        // Create temporary link element to trigger browser download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.target = '_self';  // Stay on current page (don't open new tab)
        
        // Append to DOM (required for some browsers), click, then remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error downloading image:', error);
        
        // Fallback: Open image in new tab if download fails
        const fallbackLink = document.createElement('a');
        fallbackLink.href = fullImageUrl;
        fallbackLink.target = '_blank';
        fallbackLink.rel = 'noopener noreferrer';  // Security: prevent access to window.opener
        
        document.body.appendChild(fallbackLink);
        fallbackLink.click();
        document.body.removeChild(fallbackLink);
    }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use downloadImage() instead
 */
export async function downloadUnsplashImage(fullImageUrl, imageId) {
    return downloadImage(fullImageUrl, imageId, 'unsplash');
}

