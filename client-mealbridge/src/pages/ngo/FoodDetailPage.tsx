import { useParams } from "react-router-dom";

export function FoodDetailPage() {
  const { id } = useParams();
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Food Detail</h1>
        <p className="mt-1 text-sm text-gray-500">Viewing food donation ID: {id}</p>
      </div>
      <div>Food Detail Page - ID: {id}</div>
    </div>
  );
}
