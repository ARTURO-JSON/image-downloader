/**
 * Fetches images from our API proxy
 * @param {string} query - Search query
 * @param {number} page - Page number
 * @param {number} perPage - Number of images per page
 * @param {string} source - Source API ('unsplash' or 'pexels')
 * @returns {Promise<Object>} Image data
 */
export async function fetchImages(query = 'nature', page = 1, perPage = 20, source = 'unsplash') {
  try {
    const response = await fetch(
      `/api/search?query=${encodeURIComponent(query)}&page=${page}&perPage=${perPage}&source=${source}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
}

