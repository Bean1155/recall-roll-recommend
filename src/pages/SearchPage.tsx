
import React, { useState, useEffect, useCallback } from "react";
import GridLayout from "@/components/GridLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UtensilsCrossed, Film, Search, ChevronRight, Share2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

const SearchPage = () => {
  const [activeTab, setActiveTab] = useState<string>("food");
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useUser();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const typeParam = searchParams.get('type');
    
    if (typeParam === 'entertainment') {
      setActiveTab('entertainment');
    } else {
      setActiveTab('food');
    }
  }, [location.search]);

  const getPageTitle = () => {
    return "Browse Catalog";
  };

  const handleCatalogTypeChange = useCallback((value: string) => {
    setActiveTab(value);
    navigate(`/browse?type=${value}`);
  }, [navigate]);

  // Browse categories for quick access
  const browseCategories = [
    { title: "Favorites", icon: "Heart", path: "/browse" },
    { title: "Highest Rated", icon: "Star", path: "/browse" },
    { title: "By Location", icon: "MapPin", path: "/browse" },
    { title: "Most Recent", icon: "Clock", path: "/browse" },
    { title: "Top Referrals", icon: "Share2", path: "/browse" }
  ];

  return (
    <GridLayout title={getPageTitle()}>
      <div className="max-w-5xl mx-auto">
        <Tabs value={activeTab} onValueChange={handleCatalogTypeChange} className="mb-6">
          <TabsList className="w-full bg-transparent p-0 rounded-md mb-4 flex gap-4">
            <TabsTrigger 
              value="food" 
              className="flex items-center gap-2 flex-1 py-3 rounded-md border-2 transition-colors text-black font-medium"
              style={{
                backgroundColor: "#FDE1D3",
                borderColor: activeTab === "food" ? "#d2b48c" : "transparent",
                boxShadow: activeTab === "food" ? "0 2px 4px rgba(0,0,0,0.1)" : "none"
              }}
            >
              <UtensilsCrossed size={18} />
              Bites
            </TabsTrigger>
            <TabsTrigger 
              value="entertainment" 
              className="flex items-center gap-2 flex-1 py-3 rounded-md border-2 transition-colors text-black font-medium"
              style={{
                backgroundColor: "#D6E5F0",
                borderColor: activeTab === "entertainment" ? "#d2b48c" : "transparent",
                boxShadow: activeTab === "entertainment" ? "0 2px 4px rgba(0,0,0,0.1)" : "none"
              }}
            >
              <Film size={18} />
              Blockbusters
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="food" className="mt-0">
            {/* Content automatically shows when tab is selected */}
          </TabsContent>
          
          <TabsContent value="entertainment" className="mt-0">
            {/* Content automatically shows when tab is selected */}
          </TabsContent>
        </Tabs>
        
        {/* Browse By section */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Browse by</h2>
          <div className="space-y-0.5 rounded-lg bg-gray-100 overflow-hidden">
            <Link 
              to="/browse"
              className="w-full hover:bg-gray-200 py-4 px-4 flex justify-between items-center transition-colors border-b border-gray-200 bg-white"
            >
              <span className="text-lg">All Categories</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Link>
            {browseCategories.map((category) => (
              <Link
                key={category.title}
                to={category.path}
                className="w-full hover:bg-gray-200 py-4 px-4 flex justify-between items-center transition-colors border-b border-gray-200 last:border-0 bg-white"
              >
                <span className="text-lg">{category.title}</span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </GridLayout>
  );
};

export default SearchPage;
