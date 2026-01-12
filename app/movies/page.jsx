import Navigation from '@/components/Navigation';

export default function MoviesPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-8">Movies</h1>
          {/* Movies content goes here */}
        </div>
      </main>
    </>
  );
}
