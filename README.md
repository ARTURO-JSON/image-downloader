# DownloadHub - Image & Movie Downloader

A modern, fully-featured media downloader website built with Next.js 14+ and Tailwind CSS, similar to Freepik, Pexels, and Unsplash.

## Features

### 🖼️ Image Downloader
- 🔍 **Search Functionality** - Search for images using keywords
- 🎯 **Multiple Sources** - Switch between Unsplash and Pexels APIs
- 🏷️ **Category Filters** - Quick access to popular categories (nature, tech, people, animals, architecture, business, travel, sports, food, fashion)
- 🖼️ **Image Grid** - Responsive grid layout with lazy loading
- 🔍 **Image Modal** - Click any image to view in full-screen modal
- ⬇️ **Download** - Download full-resolution images
- 📱 **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- ⚡ **Performance** - Optimized with Next.js Image component and lazy loading

### 🎬 Movie Downloader (NEW!)
- 🔍 **Movie Search** - Search for movies by title
- 🎯 **Multiple Categories** - Trending, Popular, Top-Rated, and Genre filters (Action, Comedy, Horror, Sci-Fi, Animation)
- 🎨 **Movie Grid** - Responsive grid with posters and ratings
- 📋 **Movie Modal** - Detailed view with overview, rating, and download options
- ⬇️ **Quality Selection** - Choose from 360p, 480p, 720p, 1080p
- 🌟 **Star Ratings** - TMDB ratings on every movie card
- 📱 **Fully Responsive** - Optimized for all screen sizes

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Language**: JavaScript (JSX only, no TypeScript)
- **APIs**: 
  - Unsplash & Pexels (Image Downloader)
  - The Movie Database (TMDB) - Movie Downloader

## Getting Started

### Prerequisites

- Node.js 18+ installed
- An Unsplash API key ([Get one here](https://unsplash.com/developers))
- A Pexels API key ([Get one here](https://www.pexels.com/api/))
- A TMDB API key ([Get one here](https://www.themoviedb.org/settings/api))

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   # Image Downloader APIs
   UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
   PEXELS_API_KEY=your_pexels_api_key_here
   
   # Movie Downloader API
   TMDB_API_KEY=your_tmdb_api_key_here
   NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   - Images: [http://localhost:3000](http://localhost:3000)
   - Movies: [http://localhost:3000/movies](http://localhost:3000/movies)

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── search/
│   │   │   └── route.js               # Image search API
│   │   └── movies/
│   │       ├── search/route.js        # Movie search API
│   │       ├── trending/route.js      # Trending movies API
│   │       ├── popular/route.js       # Popular movies API
│   │       ├── top/route.js           # Top-rated movies API
│   │       └── category/route.js      # Genre movies API
│   ├── movies/
│   │   └── page.jsx                   # Movie downloader page
│   ├── globals.css                    # Global styles
│   ├── layout.jsx                     # Root layout
│   └── page.jsx                       # Image downloader (homepage)
├── components/
│   ├── CategoryBar.jsx                # Image category filter
│   ├── ImageCard.jsx                  # Individual image card
│   ├── ImageGrid.jsx                  # Image grid layout
│   ├── ImageModal.jsx                 # Image detail modal
│   ├── SearchBar.jsx                  # Image search input
│   ├── SourceSelector.jsx             # API source selector
│   ├── MovieCard.jsx                  # Individual movie card
│   ├── MovieGrid.jsx                  # Movie grid layout
│   ├── MovieModal.jsx                 # Movie detail modal
│   ├── MovieSearchBar.jsx             # Movie search input
│   └── MovieCategoryBar.jsx           # Movie category filter
├── lib/
│   ├── fetchImages.js                 # Image fetching utilities
│   ├── fetchMovies.js                 # Movie fetching utilities
│   ├── downloadImage.js               # Image download handler
│   ├── useInfiniteScroll.js           # Scroll infinite loader
│   └── useInfiniteScrollMovies.js     # Movie scroll infinite loader
└── public/                            # Static assets
```

## API Routes

### Image Search
The `/api/search` route acts as a proxy to Unsplash and Pexels APIs, keeping your API keys secure.

**Parameters:**
- `query` - Search term (default: "nature")
- `page` - Page number (default: 1)
- `perPage` - Results per page (default: 20)
- `source` - API source: "unsplash" or "pexels"

### Movie APIs
All movie routes are proxied through Next.js for security:

- `/api/movies/search` - Search movies by title
- `/api/movies/trending` - Get trending movies
- `/api/movies/popular` - Get popular movies
- `/api/movies/top` - Get top-rated movies
- `/api/movies/category` - Get movies by genre

See [MOVIE_DOWNLOADER_SETUP.md](./MOVIE_DOWNLOADER_SETUP.md) for detailed movie API documentation.

## Features in Detail

### Image Search
- Type any keyword in the search bar to find relevant images
- Press Enter or click the search icon to search

### Source Selection
- Toggle between Unsplash and Pexels using the source selector
- Each source provides different image collections
- Switching sources reloads images for the current query

### Categories
- Click category chips to quickly filter images
- Categories include: nature, tech, people, animals, architecture, business, travel, sports, food, fashion

### Movie Discovery
- Search for movies by title
- Browse trending, popular, and top-rated movies
- Filter by genre: Action, Comedy, Horror, Sci-Fi, Animation
- View detailed movie information in a modal
- Select download quality (simulated)

### Image/Movie Grid
- Responsive grid that adapts to screen size
- Lazy loading for better performance
- Smooth hover effects

### Modals
- Click any image or movie to view details
- Full-screen display with animations
- Close with Escape key or click outside

### Load More
- Pagination with "Load More" button
- Shows loading state during fetch

## Build for Production

```bash
npm run build
npm start
```

## Troubleshooting

### Movies not loading?
- Ensure TMDB API key is valid in `.env.local`
- Check TMDB API rate limits (40 requests per 10 seconds)
- See [MOVIE_DOWNLOADER_SETUP.md](./MOVIE_DOWNLOADER_SETUP.md) for more help

### Images not loading?
- Verify Unsplash/Pexels API keys are valid
- Check that API keys have required permissions
- Ensure environment variables are set correctly

## License

This project is open source and available under the MIT License.

## Credits

Media provided by:
- [Unsplash](https://unsplash.com) - High-resolution stock photos
- [Pexels](https://www.pexels.com) - Free stock photos
- [TMDB](https://www.themoviedb.org) - Movie database

## Future Enhancements

- [ ] Infinite scroll option
- [ ] Movie reviews and ratings
- [ ] Watchlist/favorites feature
- [ ] Movie trailers
- [ ] Advanced filters (year, rating range)
- [ ] Social sharing
- [ ] Dark mode
- [ ] User history and recommendations
