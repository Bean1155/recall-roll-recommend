import React, { useState } from "react";
import GridLayout from "@/components/GridLayout";
import { useNavigate, Link } from "react-router-dom";
import { ChevronRight, ArrowLeft, Star, Heart, MapPin, Calendar, Clock, Film, UtensilsCrossed, Share2 } from "lucide-react";
import { FoodCard, EntertainmentCard } from "@/lib/types";
import { getAllCards } from "@/lib/data";
import { useIsMobile } from "@/hooks/use-mobile";
import CatalogCardCompact from "@/components/CatalogCardCompact";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type BrowseCategory = {
  name: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  filterFunction: (cards: (FoodCard | EntertainmentCard)[]) => (FoodCard | EntertainmentCard)[];
};

const BrowsePage = () => {
  const [activeType, setActiveType] = useState<'food' | 'entertainment'>('food');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const allCards = getAllCards();

  const foodCards = allCards.filter(card => card.type === 'food') as FoodCard[];
  const entertainmentCards = allCards.filter(card => card.type === 'entertainment') as EntertainmentCard[];
  const activeCards = activeType === 'food' ? foodCards : entertainmentCards;

  const browseCategories: BrowseCategory[] = [
    {
      name: "Favorites",
      description: "Items you've marked as favorites",
      path: "favorites",
      icon: <Heart className="h-5 w-5 text-pink-500" />,
      filterFunction: (cards) => cards.filter(card => card.isFavorite),
    },
    {
      name: "Highest Rated",
      description: "Items with 4-5 star ratings",
      path: "highest-rated",
      icon: <Star className="h-5 w-5 text-yellow-500" />,
      filterFunction: (cards) => cards.filter(card => card.rating >= 4).sort((a, b) => b.rating - a.rating),
    },
    {
      name: "By Location",
      description: "Browse items by their location",
      path: "by-location",
      icon: <MapPin className="h-5 w-5 text-blue-500" />,
      filterFunction: (cards) => {
        const locations = new Set<string>();
        cards.forEach(card => {
          if ('location' in card && card.location) {
            locations.add(card.location);
          }
        });
        
        const result: (FoodCard | EntertainmentCard)[] = [];
        locations.forEach(location => {
          const locationCards = cards.filter(card => 
            'location' in card && card.location === location
          );
          if (locationCards.length > 0) {
            result.push(locationCards[0]);
          }
        });
        return result;
      },
    },
    {
      name: activeType === 'food' ? "By Cuisine" : "By Genre",
      description: activeType === 'food' ? "Browse food by cuisine type" : "Browse entertainment by genre",
      path: activeType === 'food' ? "by-cuisine" : "by-genre",
      icon: activeType === 'food' ? 
        <UtensilsCrossed className="h-5 w-5 text-red-500" /> : 
        <Film className="h-5 w-5 text-purple-500" />,
      filterFunction: (cards) => {
        if (activeType === 'food') {
          const cuisines = new Set<string>();
          (cards as FoodCard[]).forEach(card => {
            if (card.cuisine) {
              cuisines.add(card.cuisine);
            }
          });
          
          const result: FoodCard[] = [];
          cuisines.forEach(cuisine => {
            const cuisineCards = (cards as FoodCard[]).filter(card => card.cuisine === cuisine);
            if (cuisineCards.length > 0) {
              result.push(cuisineCards[0]);
            }
          });
          return result;
        } else {
          const genres = new Set<string>();
          (cards as EntertainmentCard[]).forEach(card => {
            if (card.genre) {
              genres.add(card.genre);
            }
          });
          
          const result: EntertainmentCard[] = [];
          genres.forEach(genre => {
            const genreCards = (cards as EntertainmentCard[]).filter(card => card.genre === genre);
            if (genreCards.length > 0) {
              result.push(genreCards[0]);
            }
          });
          return result;
        }
      },
    },
    {
      name: "Most Recent",
      description: "Recently added items",
      path: "recent",
      icon: <Clock className="h-5 w-5 text-gray-500" />,
      filterFunction: (cards) => [...cards].sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      }).slice(0, 20),
    },
    {
      name: "By Status",
      description: activeType === 'food' ? "Browse by visited or interested" : "Browse by watched or interested",
      path: "by-status",
      icon: <Calendar className="h-5 w-5 text-green-500" />,
      filterFunction: (cards) => {
        const statuses = new Set<string>();
        cards.forEach(card => {
          if ('status' in card && card.status) {
            statuses.add(card.status);
          }
        });
        
        const result: (FoodCard | EntertainmentCard)[] = [];
        statuses.forEach(status => {
          const statusCards = cards.filter(card => 
            'status' in card && card.status === status
          );
          if (statusCards.length > 0) {
            result.push(statusCards[0]);
          }
        });
        return result;
      },
    },
    {
      name: "Top Referrals",
      description: "Items that have been shared or referred the most",
      path: "top-referrals",
      icon: <Share2 className="h-5 w-5 text-purple-500" />,
      filterFunction: (cards) => {
        return [...cards]
          .filter(card => card.recommendedTo && card.recommendedTo.length > 0)
          .sort((a, b) => {
            const aReferrals = a.recommendedTo ? a.recommendedTo.length : 0;
            const bReferrals = b.recommendedTo ? b.recommendedTo.length : 0;
            return bReferrals - aReferrals;
          })
          .slice(0, 20);
      },
    },
  ];

  const getFilteredCards = (category: BrowseCategory) => {
    return category.filterFunction(activeCards);
  };

  const handleCategorySelect = (category: BrowseCategory) => {
    setSelectedCategory(category.path);
    
    if (category.path === 'favorites' || category.path === 'highest-rated' || category.path === 'recent') {
      const filteredCards = getFilteredCards(category);
      const cardIds = filteredCards.map(card => card.id).join(',');
      
      if (activeType === 'food') {
        navigate(`/bites?browse=${category.path}&ids=${cardIds}`);
      } else {
        navigate(`/blockbusters?browse=${category.path}&ids=${cardIds}`);
      }
    } else {
      setSelectedCategory(category.path);
    }
  };

  const handleSubCategorySelect = (category: string, subCategory: string, cards: (FoodCard | EntertainmentCard)[]) => {
    const cardIds = cards.map(card => card.id).join(',');
    
    if (activeType === 'food') {
      navigate(`/bites?browse=${category}&subcategory=${subCategory}&ids=${cardIds}`);
    } else {
      navigate(`/blockbusters?browse=${category}&subcategory=${subCategory}&ids=${cardIds}`);
    }
  };

  const renderSubcategories = () => {
    if (!selectedCategory) return null;
    
    const category = browseCategories.find(cat => cat.path === selectedCategory);
    if (!category) return null;

    if (selectedCategory === 'by-location') {
      const locationMap = new Map<string, (FoodCard | EntertainmentCard)[]>();
      
      activeCards.forEach(card => {
        if ('location' in card && card.location) {
          const location = card.location;
          if (!locationMap.has(location)) {
            locationMap.set(location, []);
          }
          locationMap.get(location)?.push(card);
        }
      });
      
      return (
        <div className="mt-4">
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setSelectedCategory(null)}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Browse
            </Button>
            <h2 className="text-xl font-semibold ml-2">Browse By Location</h2>
          </div>
          
          <ScrollArea className="h-[70vh]">
            <Accordion type="single" collapsible className="w-full">
              {Array.from(locationMap.entries()).map(([location, cards]) => (
                <AccordionItem key={location} value={location}>
                  <AccordionTrigger className="hover:bg-gray-100 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span>{location}</span>
                      <span className="text-xs text-gray-500 ml-2">({cards.length} items)</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-3">
                      {cards.map((card) => (
                        <div 
                          key={card.id} 
                          className="cursor-pointer"
                          onClick={() => handleSubCategorySelect('by-location', location, cards)}
                        >
                          <CatalogCardCompact card={card} />
                        </div>
                      ))}
                      
                      {cards.length > 8 && (
                        <Button 
                          variant="outline"
                          className="h-full min-h-[100px] flex flex-col items-center justify-center"
                          onClick={() => handleSubCategorySelect('by-location', location, cards)}
                        >
                          <span>View all</span>
                          <span className="text-sm">{cards.length} items</span>
                        </Button>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </div>
      );
    } else if (selectedCategory === 'by-cuisine' || selectedCategory === 'by-genre') {
      const groupKey = activeType === 'food' ? 'cuisine' : 'genre';
      const groupMap = new Map<string, (FoodCard | EntertainmentCard)[]>();
      
      activeCards.forEach(card => {
        if (activeType === 'food' && 'cuisine' in card && card.cuisine) {
          const groupValue = card.cuisine;
          if (!groupMap.has(groupValue)) {
            groupMap.set(groupValue, []);
          }
          groupMap.get(groupValue)?.push(card);
        } else if (activeType === 'entertainment' && 'genre' in card && card.genre) {
          const groupValue = card.genre;
          if (!groupMap.has(groupValue)) {
            groupMap.set(groupValue, []);
          }
          groupMap.get(groupValue)?.push(card);
        }
      });
      
      return (
        <div className="mt-4">
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setSelectedCategory(null)}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Browse
            </Button>
            <h2 className="text-xl font-semibold ml-2">
              Browse By {activeType === 'food' ? 'Cuisine' : 'Genre'}
            </h2>
          </div>
          
          <ScrollArea className="h-[70vh]">
            <Accordion type="single" collapsible className="w-full">
              {Array.from(groupMap.entries()).map(([groupValue, cards]) => (
                <AccordionItem key={groupValue} value={groupValue}>
                  <AccordionTrigger className="hover:bg-gray-100 px-4 py-3">
                    <div className="flex items-center gap-2">
                      {activeType === 'food' ? (
                        <UtensilsCrossed className="h-4 w-4 text-red-500" />
                      ) : (
                        <Film className="h-4 w-4 text-purple-500" />
                      )}
                      <span>{groupValue}</span>
                      <span className="text-xs text-gray-500 ml-2">({cards.length} items)</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-3">
                      {cards.map((card) => (
                        <div 
                          key={card.id} 
                          className="cursor-pointer"
                          onClick={() => handleSubCategorySelect(
                            activeType === 'food' ? 'by-cuisine' : 'by-genre', 
                            groupValue, 
                            cards
                          )}
                        >
                          <CatalogCardCompact card={card} />
                        </div>
                      ))}
                      
                      {cards.length > 8 && (
                        <Button 
                          variant="outline"
                          className="h-full min-h-[100px] flex flex-col items-center justify-center"
                          onClick={() => handleSubCategorySelect(
                            activeType === 'food' ? 'by-cuisine' : 'by-genre', 
                            groupValue, 
                            cards
                          )}
                        >
                          <span>View all</span>
                          <span className="text-sm">{cards.length} items</span>
                        </Button>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </div>
      );
    } else if (selectedCategory === 'by-status') {
      const statusMap = new Map<string, (FoodCard | EntertainmentCard)[]>();
      
      activeCards.forEach(card => {
        if ('status' in card && card.status) {
          const status = card.status;
          if (!statusMap.has(status)) {
            statusMap.set(status, []);
          }
          statusMap.get(status)?.push(card);
        }
      });
      
      return (
        <div className="mt-4">
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setSelectedCategory(null)}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Browse
            </Button>
            <h2 className="text-xl font-semibold ml-2">Browse By Status</h2>
          </div>
          
          <ScrollArea className="h-[70vh]">
            <Accordion type="single" collapsible className="w-full">
              {Array.from(statusMap.entries()).map(([status, cards]) => (
                <AccordionItem key={status} value={status}>
                  <AccordionTrigger className="hover:bg-gray-100 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-500" />
                      <span>{status}</span>
                      <span className="text-xs text-gray-500 ml-2">({cards.length} items)</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-3">
                      {cards.map((card) => (
                        <div 
                          key={card.id} 
                          className="cursor-pointer"
                          onClick={() => handleSubCategorySelect('by-status', status, cards)}
                        >
                          <CatalogCardCompact card={card} />
                        </div>
                      ))}
                      
                      {cards.length > 8 && (
                        <Button 
                          variant="outline"
                          className="h-full min-h-[100px] flex flex-col items-center justify-center"
                          onClick={() => handleSubCategorySelect('by-status', status, cards)}
                        >
                          <span>View all</span>
                          <span className="text-sm">{cards.length} items</span>
                        </Button>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </div>
      );
    } else if (selectedCategory === 'top-referrals') {
      const topReferredCards = category.filterFunction(activeCards);
      
      return (
        <div className="mt-4">
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setSelectedCategory(null)}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Browse
            </Button>
            <h2 className="text-xl font-semibold ml-2">Top Referred Items</h2>
          </div>
          
          <ScrollArea className="h-[70vh]">
            {topReferredCards.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
                {topReferredCards.map((card) => (
                  <div 
                    key={card.id} 
                    className="cursor-pointer relative"
                    onClick={() => handleSubCategorySelect('top-referrals', 'all', topReferredCards)}
                  >
                    <CatalogCardCompact card={card} />
                    {card.recommendedTo && (
                      <div className="absolute top-2 right-2 bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                        <Share2 className="h-3 w-3 mr-1" />
                        {card.recommendedTo.length}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8">
                <p className="text-gray-500">No referrals found. Start sharing items with friends!</p>
              </div>
            )}
          </ScrollArea>
        </div>
      );
    }
    
    return null;
  };

  return (
    <GridLayout title="Browse">
      {selectedCategory ? (
        renderSubcategories()
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Browse by</h1>
            <div className="flex items-center space-x-2">
              <Button
                variant={activeType === 'food' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveType('food')}
                className={activeType === 'food' ? 'bg-[#FDE1D3] text-black hover:text-black hover:bg-[#FCE9E0]' : ''}
              >
                <UtensilsCrossed className="h-4 w-4 mr-2" />
                Bites
              </Button>
              <Button
                variant={activeType === 'entertainment' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveType('entertainment')}
                className={activeType === 'entertainment' ? 'bg-[#D6E5F0] text-black hover:text-black hover:bg-[#E0EDF5]' : ''}
              >
                <Film className="h-4 w-4 mr-2" />
                Blockbusters
              </Button>
            </div>
          </div>

          <div className="space-y-0.5 rounded-lg bg-gray-100 overflow-hidden">
            {browseCategories.map((category) => (
              <button
                key={category.path}
                className="w-full hover:bg-gray-200 py-4 px-4 flex justify-between items-center transition-colors border-b border-gray-200 last:border-0 bg-white"
                onClick={() => handleCategorySelect(category)}
              >
                <div className="flex items-center">
                  {category.icon}
                  <span className="ml-3 text-lg">{category.name}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <Button variant="link" size="sm" asChild>
                <Link to={`/${activeType === 'food' ? 'bites' : 'blockbusters'}`}>
                  View all
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {activeCards.slice(0, 5).map(card => (
                <div key={card.id}>
                  <CatalogCardCompact card={card} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </GridLayout>
  );
};

export default BrowsePage;
