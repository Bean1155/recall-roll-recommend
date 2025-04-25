import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Accordion, AccordionItem, AccordionContent } from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface BrowseOption {
  title: string;
  route: string;
  type: "food" | "entertainment";
  icon: React.ReactNode;
  subcategories?: string[];
}

interface BrowseCategorySectionProps {
  browseOptions: BrowseOption[];
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  onCategoryClick: (option: BrowseOption) => void;
  onSubcategoryClick: (subcategory: string) => void;
  colorForCategory: (category: string) => string;
}

const BrowseCategorySection: React.FC<BrowseCategorySectionProps> = ({
  browseOptions,
  selectedCategory,
  selectedSubcategory,
  onCategoryClick,
  onSubcategoryClick,
  colorForCategory,
}) => {
  const useDropdownForCategory = (title: string) => {
    return title === "By Cuisine";
  };

  const renderCategory = (option: BrowseOption) => {
    const bgColor = colorForCategory(option.title);
    
    if (useDropdownForCategory(option.title)) {
      return (
        <div key={option.title} className="mb-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full flex justify-between items-center py-3 h-auto text-lg hover:bg-opacity-10 border-b border-gray-100"
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: bgColor }}
                  >
                    {option.icon}
                  </div>
                  <span>{option.title}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {option.subcategories?.map((subcat) => (
                <DropdownMenuItem
                  key={subcat}
                  onClick={() => onSubcategoryClick(subcat)}
                  className="cursor-pointer"
                >
                  {subcat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }

    return (
      <div key={option.title}>
        <Button
          variant="ghost"
          className="w-full flex justify-between items-center py-3 h-auto text-lg hover:bg-opacity-10 border-b border-gray-100"
          onClick={() => onCategoryClick(option)}
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: bgColor }}
            >
              {option.icon}
            </div>
            <span>{option.title}</span>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </Button>
        
        {option.subcategories && selectedCategory === new URL(option.route, window.location.origin).searchParams.get('filter') && (
          <div className="ml-10 mt-2 mb-4">
            <Accordion type="single" collapsible className="w-full" defaultValue="subcategories">
              <AccordionItem value="subcategories" className="border-0">
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {option.subcategories.map(subcat => (
                      <Button
                        key={subcat}
                        variant={selectedSubcategory === subcat ? "default" : "outline"}
                        size="sm"
                        className={`text-sm justify-start ${selectedSubcategory === subcat ? 'bg-catalog-teal text-white' : 'bg-white'}`}
                        onClick={() => onSubcategoryClick(subcat)}
                      >
                        {subcat}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="px-4 pb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Browse by
      </h2>
      <div className="space-y-3">
        {browseOptions.map(renderCategory)}
      </div>
    </div>
  );
};

export default BrowseCategorySection;
