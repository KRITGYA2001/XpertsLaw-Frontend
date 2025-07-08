import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const ActiveFiltersBar = ({ activeFilters, removeFilter, resetFilters }) => {
  if (activeFilters.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center flex-wrap gap-2">
        <span className="text-sm text-muted-foreground">Active filters:</span>
        {activeFilters.map((filter, index) => (
          <div
            key={index}
            className="flex items-center bg-muted rounded-full px-3 py-1 text-sm"
          >
            <span>{filter.display}</span>
            <button
              onClick={() => removeFilter(filter)}
              className="ml-2 text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="text-sm"
        >
          Clear all
        </Button>
      </div>
    </div>
  );
};

export default ActiveFiltersBar;