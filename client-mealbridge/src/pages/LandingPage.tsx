import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-warm-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-xl font-bold text-primary">MealBridge</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-text-secondary transition-colors hover:text-primary">
              Home
            </Link>
            <Link to="/" className="text-sm font-medium text-text-secondary transition-colors hover:text-primary">
              How It Works
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-primary">
              Login
            </Link>
            <Link to="/register" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-5xl font-bold leading-tight text-dark-gray">
              Good food <br />
              <span className="text-primary">Better together</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-text-secondary">
              MealBridge connects restaurants with NGOs to rescue extra food and deliver it to people who need it most. Join us in reducing food waste and feeding communities.
            </p>
            <div className="mt-8 flex gap-4">
              <Link to="/register" className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-dark">
                Get Started
              </Link>
              <Link to="/login" className="rounded-lg border-2 border-primary px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary-50">
                Sign In
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <img src="/src/assets/hero.png" alt="MealBridge" className="max-h-[400px] w-auto object-contain" />
          </div>
        </div>
      </main>
    </div>
  );
}
