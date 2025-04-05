
import { X } from "lucide-react";
import { FoodCard } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerOverlay,
} from "@/components/ui/drawer";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { toast } from "@/components/ui/use-toast";

interface SearchResultsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  results: FoodCard[];
  categoryColors: Record<string, string>;
  onCardClick: (card: FoodCard) => void;
  isLoading?: boolean;
  searchSource?: "web" | "local";
}

const SearchResultsDialog = ({
  isOpen,
  onOpenChange,
  results,
  categoryColors,
  onCardClick,
  isLoading = false,
  searchSource = "local",
}: SearchResultsDialogProps) => {
  const isMobile = useIsMobile();

  // Helper function to render results consistently
  const renderResults = () => (
    <div className="overflow-hidden">
      {isLoading ? (
        <div className="p-6 text-center">
          <div className="animate-pulse flex space-x-4 justify-center mb-4">
            <div className="w-6 h-6 rounded-full bg-slate-300"></div>
            <div className="flex-1 max-w-[200px] space-y-2">
              <div className="h-2 bg-slate-300 rounded"></div>
              <div className="h-2 bg-slate-300 rounded w-3/4"></div>
            </div>
          </div>
          <p className="text-muted-foreground">Searching the web...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">
          No results found
        </div>
      ) : (
        <Command className="rounded-lg border shadow-md overflow-hidden bg-white">
          <CommandList className="max-h-[350px] overflow-y-auto p-2">
            <CommandGroup heading={`${searchSource === "web" ? "Web Search Results" : "Search Results"}`}>
              {results.map((card) => (
                <CommandItem
                  key={card.id}
                  onSelect={() => {
                    console.log("Selected card from search results:", card);
                    onCardClick(card);
                  }}
                  className="cursor-pointer p-4 hover:bg-slate-100 data-[selected=true]:bg-slate-100 rounded-md flex flex-col gap-2"
                  data-testid={`search-result-${card.id}`}
                >
                  <div className="flex flex-row items-center w-full">
                    <div className="flex-1">
                      <div className="font-medium text-base">{card.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {card.category} • {card.cuisine || 'Various'}
                      </div>
                      {card.location && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {card.location}
                        </div>
                      )}
                      {searchSource === "web" && (
                        <div className="mt-2 text-xs text-blue-500">
                          {card.url ? "Source: Web" : "Add to catalog"}
                        </div>
                      )}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandEmpty className="p-4 text-center">
            No matches found. Try a different search.
          </CommandEmpty>
        </Command>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerOverlay className="bg-black/80 backdrop-blur-sm" />
        <DrawerContent 
          className="p-4 border-t-2 border-catalog-softBrown bg-[#f8f8f8] rounded-t-xl"
          style={{ 
            height: "85vh",
            maxHeight: "85vh"
          }}
        >
          <div className="mb-4">
            <DrawerTitle className="text-xl font-typewriter text-catalog-teal">
              {searchSource === "web" ? "Web Search Results" : "Search Results"}
            </DrawerTitle>
            <DrawerDescription className="text-sm text-catalog-softBrown">
              {isLoading 
                ? "Searching the web for matches..."
                : `We found ${results.length} matches. Tap a result to select it.`
              }
            </DrawerDescription>
          </div>
          
          <div className="pb-16 overflow-y-auto" style={{ height: "calc(100% - 80px)" }}>
            {renderResults()}
          </div>
          
          <DrawerClose className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-md hover:bg-gray-100">
            <X size={18} />
          </DrawerClose>
        </DrawerContent>
      </Drawer>
    );
  }
  
  // Desktop view
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
      <DialogContent 
        className="sm:max-w-[700px] p-6 border-2 border-catalog-softBrown rounded-xl overflow-hidden bg-[#f8f8f8]"
      >
        <DialogTitle className="text-xl font-typewriter text-catalog-teal">
          {searchSource === "web" ? "Web Search Results" : "Search Results"}
        </DialogTitle>
        <DialogDescription className="text-sm text-catalog-softBrown mb-4">
          {isLoading 
            ? "Searching the web for matches..."
            : `We found ${results.length} matches. Click on a result to select it.`
          }
        </DialogDescription>
        
        <div className="animate-fade-in">
          {renderResults()}
        </div>
        
        <DialogClose className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-md hover:bg-gray-100">
          <X size={18} />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default SearchResultsDialog;
