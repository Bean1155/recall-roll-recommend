
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterOption {
  label: string;
  value: string;
}

interface SharedFilterMenuProps {
  label: string;
  options: FilterOption[];
  selected: string;
  onChange: (value: string) => void;
}

const SharedFilterMenu: React.FC<SharedFilterMenuProps> = ({
  label,
  options,
  selected,
  onChange
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <Select value={selected} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All</SelectItem>
          {options.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SharedFilterMenu;
