/**
 * Downloads an image with proper filename from Unsplash or Pexels
 * Routes through API proxy to handle CORS issues
 * @param {string} fullImageUrl - The full resolution image URL
 * @param {string} imageId - The image ID for filename
 * @param {string} source - The source ('unsplash' or 'pexels')
 */
export async function downloadImage(fullImageUrl, imageId, source = 'unsplash') {
    try {
        // Use the server-side download proxy to avoid CORS issues
        const downloadUrl = `/api/image/download?url=${encodeURIComponent(fullImageUrl)}&id=${imageId}&source=${source}`;
        
        // Create a temporary link and trigger download directly
        // Browser respects Content-Disposition header from API response
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.target = '_self';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error downloading image:', error);
        // Fallback: open in new tab if download fails
        const link = document.createElement('a');
        link.href = fullImageUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

/**
 * Legacy function name for backward compatibility
 * @deprecated Use downloadImage instead
 */
export async function downloadUnsplashImage(fullImageUrl, imageId) {
    return downloadImage(fullImageUrl, imageId, 'unsplash');
}

