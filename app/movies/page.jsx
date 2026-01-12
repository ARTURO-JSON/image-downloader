import Navigation from '@/components/Navigation';

export default function MoviesPage() {
  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            ARTURO.JSX
          </Link>
          <div className="flex gap-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Images
            </Link>
            <Link
              href="/movies"
              className="text-primary-600 font-medium"
            >
              Movies
            </Link>
            <Link
              href="/design-assets"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Design Assets
            </Link>
          </div>
=======
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-8">Movies</h1>
          {/* Movies content goes here */}
>>>>>>> 8d71bfa9dfb5dc299e44554aa137ec9ca73b8ec9
        </div>
      </main>
    </>
  );
}
