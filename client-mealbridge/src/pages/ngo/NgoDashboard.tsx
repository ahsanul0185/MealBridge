export function NgoDashboard() {
  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, NGO</h1>
          <p className="mt-1 text-sm text-gray-500">Here's an overview of available food and your recent activity.</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-800">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Browse Available Food
        </button>
      </div>
      <div>NGO Dashboard Content</div>
    </div>
  );
}
