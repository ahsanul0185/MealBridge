export function RestaurantDashboard() {
  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Good morning, Restaurant</h1>
          <p className="mt-1 text-sm text-gray-500">Here's an overview of your food donations.</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-800">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Donation
        </button>
      </div>
      <div>Restaurant Dashboard Content</div>
    </div>
  );
}
