import './globals.css';

export const metadata = {
  title: 'DownloadHub - Free Stock Photos & Movies',
  description: 'Discover and download high-quality free stock photos and movies from Unsplash and TMDB',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}

