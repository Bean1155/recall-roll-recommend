
import React from "react";
import { useNavigate } from "react-router-dom";
import GridLayout from "@/components/GridLayout";
import { Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
  
  const navigateToSearch = () => {
    navigate('/search');
  };

  return (
    <GridLayout title="Browse">
      <div className="flex flex-col max-w-3xl mx-auto w-full">
        {/* Search Bar */}
        <div className="px-4 py-8 flex justify-center">
          <Button 
            variant="outline" 
            className="w-full max-w-md h-12 flex justify-start gap-2 text-gray-500 border-gray-300 bg-gray-100/70"
            onClick={navigateToSearch}
          >
            <Search className="h-5 w-5" />
            <span>Find items, tags, categories...</span>
          </Button>
        </div>
        
        {/* Browse By Section - Food/Bites */}
        <div className="px-4 pb-8">
          <h2 className="text-2xl font-bold mb-4">Browse Bites by</h2>
          
          <div className="space-y-0">
            {foodBrowseOptions.map((option, index) => (
              <React.Fragment key={option.title}>
                <Button
                  variant="ghost"
                  className="w-full flex justify-between items-center py-4 h-auto text-lg"
                  onClick={() => navigate(option.route)}
                >
                  <span>{option.title}</span>
                  <ChevronRight className="h-5 w-5" />
                </Button>
                {index < foodBrowseOptions.length - 1 && (
                  <Separator className="my-1" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Browse By Section - Entertainment/Blockbusters */}
        <div className="px-4 pb-8">
          <h2 className="text-2xl font-bold mb-4">Browse Blockbusters by</h2>
          
          <div className="space-y-0">
            {entertainmentBrowseOptions.map((option, index) => (
              <React.Fragment key={option.title}>
                <Button
                  variant="ghost"
                  className="w-full flex justify-between items-center py-4 h-auto text-lg"
                  onClick={() => navigate(option.route)}
                >
                  <span>{option.title}</span>
                  <ChevronRight className="h-5 w-5" />
                </Button>
                {index < entertainmentBrowseOptions.length - 1 && (
                  <Separator className="my-1" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* App-specific Browse Options */}
        <div className="px-4 pb-20">
          <h2 className="text-2xl font-bold mb-4">Catalog Features</h2>
          
          <div className="space-y-0">
            {appSpecificOptions.map((option, index) => (
              <React.Fragment key={option.title}>
                <Button
                  variant="ghost"
                  className="w-full flex justify-between items-center py-4 h-auto text-lg"
                  onClick={() => navigate(option.route)}
                >
                  <span>{option.title}</span>
                  <ChevronRight className="h-5 w-5" />
                </Button>
                {index < appSpecificOptions.length - 1 && (
                  <Separator className="my-1" />
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
