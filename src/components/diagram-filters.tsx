'use client'

import { Button } from "@/components/ui/button"
import { FilterState } from "@/src/types"

interface DiagramFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export const DiagramFilters = ({ filters, onChange }: DiagramFiltersProps) => {
  const toggleFilter = (key: keyof Omit<FilterState, 'search' | 'currentPage'>) => {
    onChange({
      ...filters,
      [key]: !filters[key],
    });
  };

  const filterButtons = [
    { key: 'showComponents', label: 'Components' },
    { key: 'showHooks', label: 'Hooks' },
    { key: 'showHOCs', label: 'HOCs' },
    { key: 'showFunctions', label: 'Functions' },
    { key: 'showImports', label: 'Imports' },
    { key: 'showProps', label: 'Props' },
    { key: 'showHookDeps', label: 'Hook Dependencies' },
  ] as const;

  return (
    <div className="flex flex-row items-center gap-2 z-10 bg-white/80 p-2 rounded-lg shadow">
      <div className="text-sm font-medium text-gray-500">Filters</div>
      <div className="flex flex-wrap gap-2">
        {filterButtons.map(({ key, label }) => (
          <Button
            key={key}
            size="sm"
            variant={filters[key] ? "default" : "outline"}
            onClick={() => toggleFilter(key)}
            className="h-7 px-2 text-xs"
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}; 