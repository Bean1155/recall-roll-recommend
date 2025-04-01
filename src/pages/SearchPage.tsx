
import React, { useState } from "react";
import GridLayout from "@/components/GridLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
    // Implement actual search functionality here
  };

  return (
    <GridLayout title="Search Catalog">
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSearch} className="flex mb-6">
          <Input
            type="text"
            placeholder="Search foods or entertainment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-catalog-softBrown"
          />
          <Button type="submit" className="ml-2 bg-catalog-teal hover:bg-catalog-darkTeal">
            <Search size={18} />
          </Button>
        </form>

        <div className="catalog-card p-6 bg-white text-center">
          <p className="text-catalog-softBrown">
            {searchTerm ? "No results found for your search." : "Enter a search term to find items in your catalog."}
          </p>
        </div>
      </div>
    </GridLayout>
  );
};

export default SearchPage;
