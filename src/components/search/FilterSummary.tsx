
import React from "react";

interface FilterSummaryProps {
  activeFilter: string;
  searchTerm: string;
  selectedStatus: string;
}

const FilterSummary: React.FC<FilterSummaryProps> = ({
  activeFilter,
  searchTerm,
  selectedStatus
}) => {
  return (
    <div className="bg-[#FAEBD7] border border-[#8B7D6B]/20 p-3 rounded-md mb-4 text-sm">
      <span className="font-medium text-vintage-red font-typewriter text-lg">CURRENT FILTER: </span>
      <span className="text-[#5d4037] font-typewriter text-lg">
        {activeFilter === "all" && "All Items"}
        {activeFilter === "favorites" && "Favorites"}
        {activeFilter === "topRated" && "Top Rated Items (4-5 Stars)"}
        {activeFilter === "location" && "By Location"}
        {activeFilter === "byStatus" && "By Status"}
        {activeFilter === "keywords" && "By Keywords"}
        {activeFilter === "topReferrals" && "Most Recommended Items"}
        {activeFilter === "newest" && "Most Recent Items"}
      </span>

      <div className="flex items-center text-lg text-[#5d4037] border-t border-[#8B7D6B]/20 pt-3 mt-2 font-typewriter">
        <span>
          {searchTerm && `Searching for "${searchTerm}"`}
          {selectedStatus !== "all" && (searchTerm ? " with " : "") + `status "${selectedStatus}"`}
          {activeFilter !== "all" && (searchTerm || selectedStatus !== "all" ? " and " : "") + `filter: ${activeFilter}`}
          {!searchTerm && selectedStatus === "all" && activeFilter === "all" && "No filters applied"}
        </span>
      </div>
    </div>
  );
};

export default FilterSummary;
