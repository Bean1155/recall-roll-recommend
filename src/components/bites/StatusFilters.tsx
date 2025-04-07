
import React from "react";
import { DropdownMenuLabel, DropdownMenuCheckboxItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

interface StatusFiltersProps {
  activeStatuses: string[];
  onSelect: (filterType: string, value: string) => void;
}

const StatusFilters = ({ activeStatuses, onSelect }: StatusFiltersProps) => {
  return (
    <>
      <DropdownMenuLabel className="text-xs text-gray-500">Status</DropdownMenuLabel>
      <DropdownMenuCheckboxItem
        checked={activeStatuses.includes("Visited: Tried this bite")}
        onSelect={() => onSelect("status", "Visited: Tried this bite")}
      >
        <div className="flex flex-col">
          <span>Visited</span>
          <span className="text-xs text-gray-500">Items you've already tried</span>
        </div>
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={activeStatuses.includes("Interested: Want a bite")}
        onSelect={() => onSelect("status", "Interested: Want a bite")}
      >
        <div className="flex flex-col">
          <span>Interested</span>
          <span className="text-xs text-gray-500">Items you want to try</span>
        </div>
      </DropdownMenuCheckboxItem>
      <DropdownMenuSeparator />
    </>
  );
};

export default StatusFilters;
