import { useParams } from "react-router-dom";

export function FoodDetailPage() {
  const { id } = useParams();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">FoodDetailPage - ID: {id}</h1>
    </div>
  );
}
