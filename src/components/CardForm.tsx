import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { CardType, CatalogCard, FoodCard, EntertainmentCard, FoodCategory, FoodStatus, EntertainmentStatus, ServiceRating } from "@/lib/types";
import { addCard, updateCard, getCardById } from "@/lib/data";
import { toast } from "@/hooks/use-toast";
import { Plus, Minus, Calendar, Link, Tag, Star, Smile, Meh, Frown, Search } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { defaultCategories, getCategoryDisplayName } from "@/utils/categoryUtils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useUser } from "@/contexts/UserContext";
import { addPointsForSearch } from "@/utils/rewardUtils";
import SearchResultsDialog from "./bites/SearchResultsDialog";

interface CardFormProps {
  type: CardType;
  cardId?: string;
  onSubmitSuccess?: () => void;
}

const CardForm = ({ type, cardId, onSubmitSuccess }: CardFormProps) => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const isFoodCard = type === 'food';
  const isEditMode = !!cardId;
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [customFoodCategories, setCustomFoodCategories] = useState<FoodCategory[]>([]);
  const [customEntertainmentCategories, setCustomEntertainmentCategories] = useState<string[]>([]);
  const [showRating, setShowRating] = useState(true);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasPerformedSearch, setHasPerformedSearch] = useState(false);
  
  useEffect(() => {
    const savedFoodCategories = localStorage.getItem('customFoodCategories');
    if (savedFoodCategories) {
      try {
        const parsed = JSON.parse(savedFoodCategories);
        setCustomFoodCategories(parsed);
      } catch (e) {
        console.error("Error parsing custom food categories:", e);
      }
    }
    
    const savedEntertainmentCategories = localStorage.getItem('customEntertainmentCategories');
    if (savedEntertainmentCategories) {
      try {
        const parsed = JSON.parse(savedEntertainmentCategories);
        setCustomEntertainmentCategories(parsed);
      } catch (e) {
        console.error("Error parsing custom entertainment categories:", e);
      }
    }
  }, []);
  
  const [formData, setFormData] = useState({
    title: '',
    creator: '',
    date: new Date().toISOString().split('T')[0],
    rating: 3,
    hasRating: true,
    notes: '',
    cuisine: '',
    location: '',
    category: 'cafe' as FoodCategory,
    visitCount: 1,
    url: '',
    tags: '',
    genre: '',
    medium: 'Netflix',
    entertainmentCategory: 'movies',
    status: isFoodCard ? 'Visited: Tried this bite' as FoodStatus : 'Watched' as EntertainmentStatus,
    isFavorite: false,
    serviceRating: null as ServiceRating | null,
  });

  useEffect(() => {
    if (isEditMode && cardId) {
      const card = getCardById(cardId);
      if (card) {
        const initialData = {
          title: card.title,
          creator: card.creator,
          date: card.date,
          rating: card.rating || 0,
          hasRating: card.rating !== undefined && card.rating !== null,
          notes: card.notes,
          cuisine: '',
          location: '',
          category: 'cafe' as FoodCategory,
          visitCount: 1,
          url: '',
          tags: '',
          genre: '',
          medium: 'Netflix',
          entertainmentCategory: 'movies',
          status: isFoodCard ? 'Visited: Tried this bite' as FoodStatus : 'Watched' as EntertainmentStatus,
          isFavorite: card.isFavorite || false,
          serviceRating: null as ServiceRating | null,
        };
        
        if (card.type === 'food') {
          const foodCard = card as FoodCard;
          initialData.cuisine = foodCard.cuisine;
          initialData.location = foodCard.location;
          initialData.category = foodCard.category;
          initialData.visitCount = foodCard.visitCount;
          initialData.status = foodCard.status;
          initialData.url = foodCard.url || '';
          initialData.tags = foodCard.tags ? foodCard.tags.join(', ') : '';
          initialData.serviceRating = foodCard.serviceRating || null;
          
          setShowRating(foodCard.status === 'Visited: Tried this bite');
        } else {
          const entertainmentCard = card as EntertainmentCard;
          initialData.genre = entertainmentCard.genre;
          initialData.medium = entertainmentCard.medium;
          initialData.entertainmentCategory = entertainmentCard.entertainmentCategory;
          initialData.status = entertainmentCard.status;
          initialData.url = entertainmentCard.url || '';
          initialData.tags = entertainmentCard.tags ? entertainmentCard.tags.join(', ') : '';
          
          setShowRating(entertainmentCard.status === 'Watched');
        }
        
        setFormData(initialData);
      }
    }
  }, [cardId, isEditMode, isFoodCard]);
  
  useEffect(() => {
    if (isFoodCard) {
      setShowRating(formData.status === 'Visited: Tried this bite');
    } else {
      setShowRating(formData.status === 'Watched');
    }
    
    if (!showRating) {
      setFormData(prev => ({ ...prev, hasRating: false }));
    }
  }, [formData.status, isFoodCard, showRating]);

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setHasPerformedSearch(true);
    console.log("Performing search for:", query);
    
    try {
      // Simulate a network request delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let results = [];
      
      if (isFoodCard) {
        if (query.toLowerCase().includes('pizza')) {
          results = [
            {
              id: "pizza-palace",
              title: "Pizza Palace",
              creator: "Chef Mario",
              cuisine: "Italian",
              location: "123 Main St",
              category: "restaurant",
              url: "https://pizzapalace.com",
              tags: ["pizza", "italian", "pasta"]
            },
            {
              id: "slice-of-heaven",
              title: "Slice of Heaven",
              creator: "Pizza Bros",
              cuisine: "Italian-American",
              location: "456 Broadway",
              category: "restaurant",
              url: "https://sliceofheaven.com",
              tags: ["pizza", "delivery", "casual"]
            }
          ];
        } else if (query.toLowerCase().includes('sushi')) {
          results = [
            {
              id: "sushi-delight",
              title: "Sushi Delight",
              creator: "Chef Tanaka",
              cuisine: "Japanese",
              location: "789 Ocean Ave",
              category: "restaurant",
              url: "https://sushidelight.com",
              tags: ["sushi", "japanese", "seafood"]
            }
          ];
        } else if (query.toLowerCase().includes('cafe')) {
          results = [
            {
              id: "morning-brew",
              title: "Morning Brew",
              creator: "Coffee Experts Inc.",
              cuisine: "Coffee, Pastries",
              location: "101 Bean St",
              category: "cafe",
              url: "https://morningbrew.com",
              tags: ["coffee", "pastries", "breakfast"]
            }
          ];
        } else {
          results = [
            {
              id: "generic-" + Date.now(),
              title: query + " Restaurant",
              creator: "Local Chef",
              cuisine: "Various",
              location: "Local Area",
              category: "restaurant",
              url: "",
              tags: ["local", "food"]
            }
          ];
        }
      } else {
        if (query.toLowerCase().includes('star')) {
          results = [
            {
              id: "star-wars",
              title: "Star Wars: The Force Awakens",
              creator: "J.J. Abrams",
              genre: "Science Fiction",
              medium: "Disney+",
              entertainmentCategory: "movies",
              url: "https://www.disneyplus.com/movies/star-wars-the-force-awakens/4RLKxpFcZRQK",
              tags: ["sci-fi", "action", "adventure"]
            },
            {
              id: "star-trek",
              title: "Star Trek: Discovery",
              creator: "Bryan Fuller, Alex Kurtzman",
              genre: "Science Fiction",
              medium: "Paramount+",
              entertainmentCategory: "tv shows",
              url: "https://www.paramountplus.com/shows/star-trek-discovery/",
              tags: ["sci-fi", "space", "drama"]
            }
          ];
        } else if (query.toLowerCase().includes('stranger')) {
          results = [
            {
              id: "stranger-things",
              title: "Stranger Things",
              creator: "Duffer Brothers",
              genre: "Science Fiction, Horror",
              medium: "Netflix",
              entertainmentCategory: "tv shows",
              url: "https://www.netflix.com/title/80057281",
              tags: ["sci-fi", "horror", "1980s"]
            }
          ];
        } else if (query.toLowerCase().includes('game')) {
          results = [
            {
              id: "game-of-thrones",
              title: "Game of Thrones",
              creator: "David Benioff, D. B. Weiss",
              genre: "Fantasy, Drama",
              medium: "HBO Max",
              entertainmentCategory: "tv shows",
              url: "https://www.hbomax.com/series/game-of-thrones",
              tags: ["fantasy", "drama", "medieval"]
            }
          ];
        } else {
          results = [
            {
              id: "generic-" + Date.now(),
              title: query,
              creator: "Various",
              genre: "Mixed",
              medium: "Various Streaming Services",
              entertainmentCategory: "movies",
              url: "",
              tags: ["entertainment"]
            }
          ];
        }
      }
      
      console.log("Search completed. Found results:", results.length);
      setSearchResults(results);
    } catch (error) {
      console.error("Error performing search:", error);
      toast({
        title: "Search Error",
        description: "Failed to perform search. Please try again.",
        variant: "destructive",
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [isFoodCard]);
  
  const handleSearchItemSelect = (item: any) => {
    console.log("Selected search item:", item);
    
    if (currentUser?.id) {
      addPointsForSearch(currentUser.id, isFoodCard ? 'food' : 'entertainment');
    }
    
    setFormData(prev => ({
      ...prev,
      title: item.title || prev.title,
      creator: item.creator || prev.creator,
      url: item.url || prev.url,
      tags: item.tags ? item.tags.join(', ') : prev.tags,
      cuisine: item.cuisine || prev.cuisine,
      location: item.location || prev.location,
      category: (item.category as FoodCategory) || prev.category,
      genre: item.genre || prev.genre,
      medium: item.medium || prev.medium,
      entertainmentCategory: item.entertainmentCategory || prev.entertainmentCategory,
    }));
    
    setIsSearchDialogOpen(false);
    setSearchQuery('');
    setHasPerformedSearch(false);
    
    toast({
      title: "Information Added",
      description: `Details for "${item.title}" have been populated in the form.`,
    });
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (value === "add_new_category") {
      setIsAddCategoryDialogOpen(true);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      if (name === 'status') {
        if (isFoodCard) {
          const newShowRating = value === 'Visited: Tried this bite';
          setShowRating(newShowRating);
          if (!newShowRating) {
            setFormData(prev => ({ ...prev, hasRating: false }));
          }
        } else {
          const newShowRating = value === 'Watched';
          setShowRating(newShowRating);
          if (!newShowRating) {
            setFormData(prev => ({ ...prev, hasRating: false }));
          }
        }
      }
    }
  };

  const handleServiceRatingChange = (value: string | null) => {
    if (value === "null") {
      setFormData(prev => ({ ...prev, serviceRating: null }));
    } else {
      setFormData(prev => ({ ...prev, serviceRating: value as ServiceRating }));
    }
  };

  const handleAddNewCategory = () => {
    if (newCategory.trim()) {
      const categoryValue = newCategory.trim().toLowerCase();
      
      if (isFoodCard) {
        const updatedCategories = [...customFoodCategories, categoryValue as FoodCategory];
        setCustomFoodCategories(updatedCategories);
        localStorage.setItem('customFoodCategories', JSON.stringify(updatedCategories));
        setFormData(prev => ({ ...prev, category: categoryValue as FoodCategory }));
      } else {
        const updatedCategories = [...customEntertainmentCategories, categoryValue];
        setCustomEntertainmentCategories(updatedCategories);
        localStorage.setItem('customEntertainmentCategories', JSON.stringify(updatedCategories));
        setFormData(prev => ({ ...prev, entertainmentCategory: categoryValue }));
      }
      
      setNewCategory('');
      setIsAddCategoryDialogOpen(false);
      
      toast({
        title: "Category Added",
        description: `"${newCategory}" has been added to your categories.`,
      });
    }
  };

  const incrementVisitCount = () => {
    setFormData(prev => ({ ...prev, visitCount: prev.visitCount + 1 }));
  };

  const decrementVisitCount = () => {
    if (formData.visitCount > 1) {
      setFormData(prev => ({ ...prev, visitCount: prev.visitCount - 1 }));
    }
  };
  
  const handleRatingChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, rating: value[0], hasRating: true }));
  };
  
  const handleRatingToggle = (hasRating: boolean) => {
    setFormData(prev => ({ 
      ...prev, 
      hasRating,
      rating: hasRating ? (prev.rating || 3) : 0
    }));
  };

  const getRatingLabel = (rating: number): string => {
    switch(rating) {
      case 1: return "Yikes";
      case 2: return "Meh";
      case 3: return "Decent";
      case 4: return "Impressive";
      case 5: return "Amazing";
      default: return "";
    }
  };
  
  const handleSearchClick = () => {
    console.log("Search button clicked, opening dialog");
    setIsSearchDialogOpen(true);
    setSearchResults([]);
    setSearchQuery('');
    setHasPerformedSearch(false);
  };
  
  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search form submitted with query:", searchQuery);
    performSearch(searchQuery);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const baseCard: Omit<CatalogCard, 'id'> = {
        type,
        title: formData.title,
        creator: formData.creator,
        date: formData.date,
        rating: formData.hasRating ? Number(formData.rating) : undefined,
        notes: formData.notes,
        isFavorite: formData.isFavorite,
      };
      
      let card;
      
      if (isFoodCard) {
        card = {
          ...baseCard,
          cuisine: formData.cuisine,
          location: formData.location,
          category: formData.category,
          status: formData.status as FoodStatus,
          visitCount: formData.visitCount,
          url: formData.url,
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
          serviceRating: formData.serviceRating,
        } as Omit<FoodCard, 'id'>;
      } else {
        card = {
          ...baseCard,
          genre: formData.genre,
          medium: formData.medium,
          entertainmentCategory: formData.entertainmentCategory,
          status: formData.status as EntertainmentStatus,
          url: formData.url,
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        } as Omit<EntertainmentCard, 'id'>;
      }
      
      let savedCard;
      
      if (isEditMode && cardId) {
        updateCard({
          ...card,
          id: cardId,
        } as CatalogCard);
        
        toast({
          title: "Card Updated",
          description: `Your ${isFoodCard ? 'bite' : 'blockbuster'} has been updated successfully!`,
        });
        
        savedCard = { id: cardId, ...card };
      } else {
        savedCard = addCard(card);
        
        toast({
          title: isFoodCard ? "Bite Added" : "Blockbuster Added",
          description: `Your ${isFoodCard ? 'bite' : 'blockbuster'} has been added to your collection!`,
        });

        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      }
      
      navigate(isFoodCard ? '/bites' : '/blockbusters');
    } catch (error) {
      console.error('Error processing card:', error);
      toast({
        title: "Error",
        description: "There was an error saving your card. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const defaultEntertainmentCategories = [
    "books", "comedies", "events", "games", "live performances", 
    "movies", "podcasts", "tv shows", "etc."
  ];
  
  const getServiceRatingIcon = (rating: ServiceRating | null) => {
    switch(rating) {
      case 'Had me at hello':
        return <Smile className="w-6 h-6 text-green-500" />;
      case 'Needs more effort':
        return <Meh className="w-6 h-6 text-amber-500" />;
      case 'Disappointed':
        return <Frown className="w-6 h-6 text-red-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit} className="catalog-card max-w-md mx-auto">
        <div className="space-y-4">
          {isFoodCard ? (
            <>
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="title" className="text-base">Name <span className="text-red-500">*</span></Label>
                    <p className="text-xs italic mb-1">Name of Establishment</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSearchClick}
                    className="flex items-center gap-1 border-catalog-softBrown text-catalog-darkBrown"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </Button>
                </div>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="catalog-input"
                  placeholder="Establishment Name"
                />
              </div>
              
              <div>
                <Label htmlFor="creator">Chef/Restauranteur</Label>
                <Input
                  id="creator"
                  name="creator"
                  value={formData.creator}
                  onChange={handleChange}
                  className="catalog-input"
                  placeholder="Chef or Restauranteur name"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category <span className="text-red-500">*</span> <span className="text-xs text-muted-foreground">(Select from menu)</span></Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                  required
                >
                  <SelectTrigger className="catalog-input">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {defaultCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {getCategoryDisplayName(category)}
                      </SelectItem>
                    ))}
                    
                    {customFoodCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {getCategoryDisplayName(category)}
                      </SelectItem>
                    ))}
                    
                    <SelectItem value="add_new_category" className="text-catalog-teal font-semibold">
                      + Add Category
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cuisine">Cuisine</Label>
                <Input
                  id="cuisine"
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleChange}
                  className="catalog-input"
                  placeholder="Italian, Mexican, etc."
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="catalog-input"
                  placeholder="Restaurant Location"
                />
              </div>
              
              <div>
                <Label htmlFor="status">Status <span className="text-xs text-muted-foreground">(Select from menu)</span></Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger className="catalog-input">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Visited: Tried this bite">Visited: Tried this bite</SelectItem>
                    <SelectItem value="Interested: Want a bite">Interested: Want a bite</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.status === 'Visited: Tried this bite' && (
                <div>
                  <Label htmlFor="serviceRating">Service</Label>
                  <Select
                    value={formData.serviceRating || "null"}
                    onValueChange={(value) => handleServiceRatingChange(value === "null" ? null : value)}
                  >
                    <SelectTrigger className="catalog-input">
                      <SelectValue placeholder="How was the service?">
                        {formData.serviceRating ? (
                          <div className="flex items-center space-x-2">
                            {getServiceRatingIcon(formData.serviceRating)}
                            <span>{formData.serviceRating}</span>
                          </div>
                        ) : (
                          <span>How was the service?</span>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Had me at hello">
                        <div className="flex items-center space-x-2">
                          <Smile className="w-5 h-5 text-green-500" />
                          <span>Had me at hello</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Needs more effort">
                        <div className="flex items-center space-x-2">
                          <Meh className="w-5 h-5 text-amber-500" />
                          <span>Needs more effort</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Disappointed">
                        <div className="flex items-center space-x-2">
                          <Frown className="w-5 h-5 text-red-500" />
                          <span>Disappointed</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="null">
                        <span className="text-muted-foreground">No rating</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="date" className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Date Experienced
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="catalog-input flex-1"
                  />
                  <div className="flex items-center border border-catalog-softBrown rounded-md">
                    <Button 
                      type="button" 
                      onClick={decrementVisitCount}
                      variant="ghost"
                      className="px-2 py-1 h-8"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-2">{formData.visitCount}</span>
                    <Button 
                      type="button" 
                      onClick={incrementVisitCount}
                      variant="ghost"
                      className="px-2 py-1 h-8"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Visit count: {formData.visitCount}</p>
              </div>

              <div className="space-y-1">
                {showRating && (
                  <>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="rating" className="flex items-center">
                        <Star className="w-4 h-4 mr-2" />
                        Rating
                      </Label>
                      
                      <RadioGroup 
                        value={formData.hasRating ? "rated" : "not-rated"}
                        onValueChange={(value) => handleRatingToggle(value === "rated")}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="rated" id="rating-yes" />
                          <Label htmlFor="rating-yes" className="text-sm">Rate it</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="not-rated" id="rating-no" />
                          <Label htmlFor="rating-no" className="text-sm">No rating yet</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {formData.hasRating && (
                      <>
                        <div className="flex items-center space-x-2 py-4">
                          <Slider
                            id="rating"
                            min={1}
                            max={5}
                            step={1}
                            value={[formData.rating]}
                            onValueChange={handleRatingChange}
                          />
                          <div className="w-24 text-center">
                            <span className="font-semibold">{formData.rating}</span>
                            <span className="block text-sm">{getRatingLabel(formData.rating)}</span>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>1 - Yikes</span>
                          <span>5 - Amazing</span>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              <div>
                <Label htmlFor="url" className="flex items-center">
                  <Link className="w-4 h-4 mr-2" />
                  URL
                </Label>
                <Input
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  className="catalog-input"
                  placeholder="Website or social media link"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="catalog-input h-20"
                  placeholder="Your thoughts, impressions, and memorable details..."
                />
              </div>

              <div>
                <Label htmlFor="tags" className="flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Tags
                </Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="catalog-input"
                  placeholder="breakfast, sandwiches, coffee, etc. (comma separated)"
                />
                <p className="text-xs text-muted-foreground mt-1">Separate tags with commas</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="title" className="text-base">Title <span className="text-red-500">*</span></Label>
                    <p className="text-xs italic mb-1">Name of show, performance, etc.</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSearchClick}
                    className="flex items-center gap-1 border-catalog-softBrown text-catalog-darkBrown"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </Button>
                </div>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="catalog-input"
                  placeholder="Title of entertainment"
                />
              </div>
              
              <div>
                <Label htmlFor="creator">Creator/Author</Label>
                <Input
                  id="creator"
                  name="creator"
                  value={formData.creator}
                  onChange={handleChange}
                  className="catalog-input"
                  placeholder="Director, Author, Studio, etc."
                />
              </div>
              
              <div>
                <Label htmlFor="entertainmentCategory">Entertainment Category <span className="text-red-500">*</span> <span className="text-xs text-muted-foreground">(Select from menu)</span></Label>
                <Select
                  value={formData.entertainmentCategory}
                  onValueChange={(value) => handleSelectChange('entertainmentCategory', value)}
                  required
                >
                  <SelectTrigger className="catalog-input">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {defaultEntertainmentCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {getCategoryDisplayName(category)}
                      </SelectItem>
                    ))}
                    
                    {customEntertainmentCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {getCategoryDisplayName(category)}
                      </SelectItem>
                    ))}
                    
                    <SelectItem value="add_new_category" className="text-catalog-teal font-semibold">
                      + Add Category
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="genre">Genre</Label>
                <Input
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className="catalog-input"
                  placeholder="Drama, Comedy, etc."
                />
              </div>
              
              <div>
                <Label htmlFor="medium">Medium</Label>
                <Select
                  value={formData.medium}
                  onValueChange={(value) => handleSelectChange('medium', value)}
                >
                  <SelectTrigger className="catalog-input">
                    <SelectValue placeholder="Select a streaming service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Netflix">Netflix</SelectItem>
                    <SelectItem value="Hulu">Hulu</SelectItem>
                    <SelectItem value="Apple TV+">Apple TV+</SelectItem>
                    <SelectItem value="Disney+">Disney+</SelectItem>
                    <SelectItem value="Amazon Prime">Amazon Prime</SelectItem>
                    <SelectItem value="HBO Max">HBO Max</SelectItem>
                    <SelectItem value="Peacock">Peacock</SelectItem>
                    <SelectItem value="Paramount+">Paramount+</SelectItem>
                    <SelectItem value="YouTube">YouTube</SelectItem>
                    <SelectItem value="Theater">Theater</SelectItem>
                    <SelectItem value="Physical Media">Physical Media</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="status">Status <span className="text-xs text-muted-foreground">(Select from menu)</span></Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger className="catalog-input">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Watched">Watched</SelectItem>
                    <SelectItem value="Want to Watch">Want to Watch</SelectItem>
                    <SelectItem value="Currently Watching">Currently Watching</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="date" className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Date Experienced
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="catalog-input"
                />
              </div>

              <div className="space-y-1">
                {showRating && (
                  <>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="rating" className="flex items-center">
                        <Star className="w-4 h-4 mr-2" />
                        Rating
                      </Label>
                      
                      <RadioGroup 
                        value={formData.hasRating ? "rated" : "not-rated"}
                        onValueChange={(value) => handleRatingToggle(value === "rated")}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="rated" id="entertainment-rating-yes" />
                          <Label htmlFor="entertainment-rating-yes" className="text-sm">Rate it</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="not-rated" id="entertainment-rating-no" />
                          <Label htmlFor="entertainment-rating-no" className="text-sm">No rating yet</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {formData.hasRating && (
                      <>
                        <div className="flex items-center space-x-2 py-4">
                          <Slider
                            id="entertainment-rating"
                            min={1}
                            max={5}
                            step={1}
                            value={[formData.rating]}
                            onValueChange={handleRatingChange}
                          />
                          <div className="w-24 text-center">
                            <span className="font-semibold">{formData.rating}</span>
                            <span className="block text-sm">{getRatingLabel(formData.rating)}</span>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>1 - Yikes</span>
                          <span>5 - Amazing</span>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              <div>
                <Label htmlFor="url" className="flex items-center">
                  <Link className="w-4 h-4 mr-2" />
                  URL
                </Label>
                <Input
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  className="catalog-input"
                  placeholder="URL for streaming or information"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="catalog-input h-20"
                  placeholder="Your thoughts, impressions, and memorable details..."
                />
              </div>

              <div>
                <Label htmlFor="tags" className="flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Tags
                </Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="catalog-input"
                  placeholder="action, comedy, classics, etc. (comma separated)"
                />
                <p className="text-xs text-muted-foreground mt-1">Separate tags with commas</p>
              </div>
            </>
          )}
        </div>
        
        <div className="mt-8 flex justify-center">
          <Button 
            type="submit"
            className="bg-catalog-teal hover:bg-catalog-teal/90 text-white px-12 py-6"
          >
            {isEditMode ? 'Save Changes' : isFoodCard ? 'Add Bite' : 'Add Blockbuster'}
          </Button>
        </div>
      </form>

      <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a custom category for your {isFoodCard ? 'bite' : 'blockbuster'}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newCategory">Category Name</Label>
              <Input
                id="newCategory"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddNewCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SearchResultsDialog
        isOpen={isSearchDialogOpen}
        onOpenChange={setIsSearchDialogOpen}
        results={searchResults}
        categoryColors={{}}
        onCardClick={handleSearchItemSelect}
      />

      <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Search for {isFoodCard ? 'Food' : 'Entertainment'}</DialogTitle>
            <DialogDescription>
              Find and add existing {isFoodCard ? 'restaurants and dishes' : 'movies, shows, and more'} to your catalog.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSearchSubmit} className="space-y-4 py-4">
            <div className="flex space-x-2">
              <Input
                value={searchQuery}
                onChange={handleSearchQueryChange}
                placeholder={`Search for ${isFoodCard ? 'restaurants, dishes, etc.' : 'movies, shows, etc.'}`}
                className="flex-grow"
              />
              <Button type="submit" disabled={isSearching}>
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>
            
            {hasPerformedSearch && searchResults.length === 0 && !isSearching && (
              <div className="text-center text-muted-foreground py-4">
                No results found. Try a different search term.
              </div>
            )}
            
            {searchResults.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Results:</h3>
                <div className="max-h-[300px] overflow-y-auto space-y-2">
                  {searchResults.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => handleSearchItemSelect(item)}
                      className="p-3 border rounded-md hover:bg-slate-100 cursor-pointer"
                    >
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {isFoodCard ? `${item.cuisine || 'Various'} • ${getCategoryDisplayName(item.category as string)}` : 
                        `${item.genre || 'Various'} • ${item.medium || 'Unknown'}`}
                      </div>
                      {item.location && <div className="text-xs mt-1">{item.location}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CardForm;
