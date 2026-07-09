import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-warm-white">

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
