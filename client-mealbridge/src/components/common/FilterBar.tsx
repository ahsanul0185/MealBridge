import { useState } from "react";
import type { FoodType } from "../../types/food";

interface FilterBarProps {
  areas: string[];
  onAreaChange?: (area: string) => void;
  onFoodTypeChange?: (type: FoodType | "") => void;
  onSearchChange?: (search: string) => void;
  selectedArea?: string;
  selectedFoodType?: FoodType | "";
  searchValue?: string;
  className?: string;
}

export function FilterBar({
  areas,
  onAreaChange,
  onFoodTypeChange,
  onSearchChange,
  selectedArea = "",
  selectedFoodType = "",
  searchValue = "",
  className = "",
}: FilterBarProps) {
  const [localSearch, setLocalSearch] = useState(searchValue);

  const handleSearch = (value: string) => {
    setLocalSearch(value);
    onSearchChange?.(value);
  };

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {/* Search */}
      {onSearchChange && (
        <div className="relative flex-1 min-w-[200px]">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by food or restaurant name..."
            className="focus-ring block w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-4 text-sm text-dark-gray placeholder:text-text-muted"
          />
        </div>
      )}

      {/* Area Filter */}
      {onAreaChange && areas.length > 0 && (
        <div className="relative">
          <select
            value={selectedArea}
            onChange={(e) => onAreaChange(e.target.value)}
            className="focus-ring appearance-none rounded-lg border border-border bg-white py-2.5 pl-4 pr-10 text-sm text-dark-gray"
          >
            <option value="">All Areas</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      )}

      {/* Food Type Filter */}
      {onFoodTypeChange && (
        <div className="relative">
          <select
            value={selectedFoodType}
            onChange={(e) => onFoodTypeChange(e.target.value as FoodType | "")}
            className="focus-ring appearance-none rounded-lg border border-border bg-white py-2.5 pl-4 pr-10 text-sm text-dark-gray"
          >
            <option value="">All Types</option>
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
