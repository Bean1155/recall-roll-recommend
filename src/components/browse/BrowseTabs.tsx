
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListFilter, Utensils, Film } from "lucide-react";

interface BrowseTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  typeFilter: 'food' | 'entertainment';
  children: {
    search: React.ReactNode;
    byCategory: React.ReactNode;
  };
}

const BrowseTabs: React.FC<BrowseTabsProps> = ({ 
  activeTab, 
  onTabChange, 
  typeFilter,
  children 
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="w-full grid grid-cols-2 mb-4">
        <TabsTrigger value="search">
          <ListFilter className="h-4 w-4 mr-2" />
          Browse and Filter
        </TabsTrigger>
        <TabsTrigger value="byCategory">
          {typeFilter === 'food' ? (
            <Utensils className="h-4 w-4 mr-2" />
          ) : (
            <Film className="h-4 w-4 mr-2" />
          )}
          Browse by Category
        </TabsTrigger>
      </TabsList>

      <TabsContent value="search" className="space-y-4">
        {children.search}
      </TabsContent>

      <TabsContent value="byCategory">
        {children.byCategory}
      </TabsContent>
    </Tabs>
  );
};

export default BrowseTabs;
