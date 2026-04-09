import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--background)]">
      <div className="text-center animate-fade-in">
        <div className="relative mb-8">
          <h1 className="text-[10rem] font-extrabold leading-none gradient-text opacity-20">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-3xl flex items-center justify-center">
              <svg className="w-12 h-12 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-3">Page Not Found</h2>
        <p className="text-[var(--muted)] mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
          >
            Go Home
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 border-2 border-[var(--card-border)] font-semibold rounded-xl hover:border-primary-400 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
