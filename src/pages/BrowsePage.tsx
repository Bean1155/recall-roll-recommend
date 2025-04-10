
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import GridLayout from "@/components/GridLayout";
import { Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { defaultCategories, defaultEntertainmentCategories } from "@/utils/categoryUtils";
import { useBrowseState } from "@/hooks/useBrowseState";
import { useIsMobile } from "@/hooks/use-mobile";

// List of browse options for the Letterboxd-style interface
interface BrowseOption {
  title: string;
  route: string;
  type: "food" | "entertainment" | "other";
}

const foodBrowseOptions: BrowseOption[] = [
  { title: "By Cuisine", route: "/bites?filter=cuisine", type: "food" },
  { title: "By Restaurant Type", route: "/bites?filter=category", type: "food" },
  { title: "Top Rated", route: "/bites?filter=topRated", type: "food" },
  { title: "Most Popular", route: "/bites?filter=popular", type: "food" },
  { title: "Recently Added", route: "/bites?filter=recent", type: "food" },
  { title: "Location", route: "/bites?filter=location", type: "food" }
];

const entertainmentBrowseOptions: BrowseOption[] = [
  { title: "By Genre", route: "/blockbusters?filter=genre", type: "entertainment" },
  { title: "By Medium", route: "/blockbusters?filter=medium", type: "entertainment" },
  { title: "Top Rated", route: "/blockbusters?filter=topRated", type: "entertainment" },
  { title: "Most Popular", route: "/blockbusters?filter=popular", type: "entertainment" },
  { title: "Recently Added", route: "/blockbusters?filter=recent", type: "entertainment" },
  { title: "Featured Lists", route: "/blockbusters?filter=lists", type: "entertainment" }
];

const appSpecificOptions: BrowseOption[] = [
  { title: "Journal", route: "/journal", type: "other" },
  { title: "Collections", route: "/collections", type: "other" },
  { title: "Rewards", route: "/rewards", type: "other" }
];

const BrowsePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const typeParam = searchParams.get('type') as 'food' | 'entertainment' | null;
  const [activeType, setActiveType] = useState<'food' | 'entertainment'>(typeParam || 'food');
  
  // Use the appropriate options list based on the active type
  const browseOptions = activeType === 'food' ? foodBrowseOptions : entertainmentBrowseOptions;
  
  const navigateToSearch = () => {
    navigate('/search');
  };
  
  const toggleType = () => {
    const newType = activeType === 'food' ? 'entertainment' : 'food';
    setActiveType(newType);
    // Update URL params when toggling
    navigate(`/browse?type=${newType}`);
  };

  return (
    <GridLayout title="Browse" className="bg-gray-900 text-white">
      <div className="flex flex-col max-w-3xl mx-auto w-full">
        {/* Search Bar */}
        <div className="px-4 py-8 flex justify-center">
          <Button 
            variant="outline" 
            className="w-full max-w-md h-12 flex justify-start gap-2 text-gray-200 border-gray-700 bg-gray-800"
            onClick={navigateToSearch}
          >
            <Search className="h-5 w-5" />
            <span>Find items, tags, categories...</span>
          </Button>
        </div>
        
        {/* Type Toggle Button */}
        <div className="px-4 mb-6 flex justify-center">
          <Button
            variant="outline"
            className="bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
            onClick={toggleType}
          >
            {activeType === 'food' ? 'Switch to Blockbusters' : 'Switch to Bites'}
          </Button>
        </div>
        
        {/* Browse By Section */}
        <div className="px-4 pb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">
            Browse {activeType === 'food' ? 'Bites' : 'Blockbusters'} by
          </h2>
          
          <div className="space-y-0 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            {browseOptions.map((option, index) => (
              <React.Fragment key={option.title}>
                <Button
                  variant="ghost"
                  className="w-full flex justify-between items-center py-4 h-auto text-lg text-gray-200 hover:bg-gray-700"
                  onClick={() => navigate(option.route)}
                >
                  <span>{option.title}</span>
                  <ChevronRight className="h-5 w-5" />
                </Button>
                {index < browseOptions.length - 1 && (
                  <Separator className="my-0 bg-gray-700" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* App-specific Browse Options */}
        <div className="px-4 pb-20">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">Catalog Features</h2>
          
          <div className="space-y-0 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            {appSpecificOptions.map((option, index) => (
              <React.Fragment key={option.title}>
                <Button
                  variant="ghost"
                  className="w-full flex justify-between items-center py-4 h-auto text-lg text-gray-200 hover:bg-gray-700"
                  onClick={() => navigate(option.route)}
                >
                  <span>{option.title}</span>
                  <ChevronRight className="h-5 w-5" />
                </Button>
                {index < appSpecificOptions.length - 1 && (
                  <Separator className="my-0 bg-gray-700" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </GridLayout>
  );
};

export default BrowsePage;
