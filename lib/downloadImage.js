/**
 * Downloads an image with proper filename from Unsplash or Pexels
 * @param {string} fullImageUrl - The full resolution image URL
 * @param {string} imageId - The image ID for filename
 * @param {string} source - The source ('unsplash' or 'pexels')
 */
export async function downloadImage(fullImageUrl, imageId, source = 'unsplash') {
    try {
        // Fetch the image as a blob to trigger download
        const response = await fetch(fullImageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${source}-${imageId}.jpg`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the object URL
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading image:', error);
        // Fallback: open in new tab if fetch fails
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

