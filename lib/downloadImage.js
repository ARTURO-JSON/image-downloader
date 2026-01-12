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
        
        // Fetch the image as a blob through our proxy
        const response = await fetch(downloadUrl);
        if (!response.ok) {
            throw new Error(`Download failed: ${response.status}`);
        }
        
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        // Create a temporary download link and trigger the download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${source}-${imageId}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the blob URL
        window.URL.revokeObjectURL(blobUrl);
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

