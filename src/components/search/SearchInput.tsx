
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ 
  searchTerm, 
  setSearchTerm,
  onKeyDown
}) => {
  return (
    <div className="mb-4">
      <label htmlFor="search-input" className="block text-xl font-medium text-vintage-red mb-1 font-typewriter">
        SEARCH TERMS
      </label>
      <div className="relative">
        <Input
          id="search-input"
          type="text"
          placeholder="Search by Keywords"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={onKeyDown}
          className="w-full border-[#8B7D6B] pl-10 bg-[#FAF3E3] focus:ring-[#8B7D6B] focus:border-[#8B7D6B]"
          autoFocus
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B7D6B]" size={16} />
        {searchTerm && (
          <Button 
            type="button" 
            variant="ghost" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => setSearchTerm("")}
          >
            <X size={14} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
