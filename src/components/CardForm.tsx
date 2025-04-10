import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FoodCard, EntertainmentCard, FoodStatus, EntertainmentStatus, ServiceRating, CardType } from "@/lib/types";
import { addCard, getCardById } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Star, PlusCircle, Film } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import AddCategoryDialog from "@/components/bites/AddCategoryDialog";
import { getAllEntertainmentCategories, getAllCategories } from "@/utils/categoryUtils";

interface CardFormProps {
  type: CardType;
  initialData?: FoodCard | EntertainmentCard;
  onSubmit?: (data: FoodCard | EntertainmentCard) => void;
  isEdit?: boolean;
  cardId?: string;
  onSubmitSuccess?: (cardId: string) => void;
  initialCategory?: string;
}

const CardForm = ({ 
  type, 
  initialData, 
  onSubmit, 
  isEdit = false, 
  cardId, 
  onSubmitSuccess,
  initialCategory = "" 
}: CardFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FoodCard | EntertainmentCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);

  useEffect(() => {
    const loadCardData = () => {
      if (cardId) {
        const card = getCardById(cardId);
        if (card) {
          setFormData(card as FoodCard | EntertainmentCard);
          
          setTitle(card.title || "");
          setCreator(card.creator || "");
          setNotes(card.notes || "");
          setRating(card.rating?.toString() || "");
          setIsFavorite(card.isFavorite || false);
          setTags(card.tags?.join(", ") || "");
          setDate(card.date ? new Date(card.date) : new Date());
          
          if (card.type === 'food') {
            const foodCard = card as FoodCard;
            setCategory(foodCard.category || "");
            setCuisine(foodCard.cuisine || "");
            setLocation(foodCard.location || "");
            setVisitCount((foodCard.visitCount || 0).toString());
            setServiceRating(foodCard.serviceRating || "");
            setStatus(foodCard.status || "");
          } else if (card.type === 'entertainment') {
            const entertainmentCard = card as EntertainmentCard;
            setCategory(entertainmentCard.entertainmentType || "");
            setGenre(entertainmentCard.genre || "");
            setMedium(entertainmentCard.medium || "");
            setStatus(entertainmentCard.status || "");
          }
        } else {
          toast({
            title: "Error",
            description: "Card not found",
            variant: "destructive",
          });
        }
      } else if (initialData) {
        setFormData(initialData);
      }
      
      setLoading(false);
    };

    loadCardData();
  }, [cardId, initialData]);

  const [title, setTitle] = useState("");
  const [creator, setCreator] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [cuisine, setCuisine] = useState("");
  const [location, setLocation] = useState("");
  const [serviceRating, setServiceRating] = useState<string>("");
  
  const [genre, setGenre] = useState("");
  const [medium, setMedium] = useState("");
  
  const [tags, setTags] = useState("");
  const [rating, setRating] = useState("");
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [date, setDate] = useState(new Date());
  const [visitCount, setVisitCount] = useState("0");
  
  const [entertainmentCategories, setEntertainmentCategories] = useState<string[]>([]);
  const [foodCategories, setFoodCategories] = useState<string[]>([]);
  const [entertainmentTypes] = useState<string[]>([
    "movies", "tv shows", "books", "games", "music", "podcasts", "other"
  ]);
  
  useEffect(() => {
    if (type === 'entertainment') {
      setEntertainmentCategories(getAllEntertainmentCategories());
    } else {
      setFoodCategories(getAllCategories());
    }
  }, [type, showAddCategoryDialog]);

  const formatDate = useCallback((date: Date): string => {
    return format(date, "yyyy-MM-dd");
  }, []);

  const handleAddNewCategory = () => {
    setShowAddCategoryDialog(true);
  };
  
  const handleCategoryAdded = (newCategory: string) => {
    setCategory(newCategory);
    if (type === 'entertainment') {
      setEntertainmentCategories(getAllEntertainmentCategories());
    } else {
      setFoodCategories(getAllCategories());
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value === "add_new") {
      setShowAddCategoryDialog(true);
    } else {
      setCategory(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cardData: FoodCard | EntertainmentCard = type === "food" ? {
      type: "food",
      title,
      creator,
      category: category as FoodCard["category"],
      cuisine,
      location,
      tags: tags.split(",").map((tag) => tag.trim()).filter(tag => tag !== ""),
      rating: parseFloat(rating) || 0,
      status: status as FoodStatus,
      notes,
      isFavorite,
      date: formatDate(date),
      serviceRating: serviceRating as ServiceRating || null,
      visitCount: parseInt(visitCount) || 0,
      id: formData?.id || initialData?.id || String(Math.random()),
    } : {
      type: "entertainment",
      title,
      creator,
      entertainmentCategory: category,
      entertainmentType: category, // Use the category value as the entertainment type
      genre,
      medium,
      tags: tags.split(",").map((tag) => tag.trim()).filter(tag => tag !== ""),
      rating: parseFloat(rating) || 0,
      status: status as EntertainmentStatus,
      notes,
      isFavorite,
      date: formatDate(date),
      id: formData?.id || initialData?.id || String(Math.random()),
    };

    if (!onSubmit) {
      try {
        console.log('CardForm: Saving card directly:', cardData);
        const savedCard = addCard(cardData);
        
        if (onSubmitSuccess) {
          onSubmitSuccess(savedCard.id);
        } else {
          toast({
            title: `${type === "food" ? "Bite" : "Blockbuster"} ${isEdit ? "Updated" : "Created"}!`,
            description: `Your ${type === "food" ? "bite" : "blockbuster"} has been ${isEdit ? "updated" : "created"}.`,
          });
          navigate(`/${type === "food" ? "bites" : "blockbusters"}`);
        }
      } catch (error) {
        console.error('Error saving card:', error);
        toast({
          title: "Error",
          description: `There was an error saving your ${type === "food" ? "bite" : "blockbuster"}.`,
          variant: "destructive",
        });
      }
    } else {
      onSubmit(cardData);
      
      if (onSubmitSuccess) {
        onSubmitSuccess(cardData.id);
      }
    }
  };

  if (loading) {
    return <div className="w-full text-center py-8">Loading card data...</div>;
  }
  
  if (type === "food") {
    return (
      <div className="w-full max-w-3xl mx-auto p-4 space-y-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-teal-700 mb-6">{isEdit ? 'Edit Bite' : 'Add Bite'}</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-gray-700 font-medium">Name*</Label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Name of establishment"
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="creator" className="text-gray-700 font-medium">Chef/Restauranteur</Label>
            <Input
              type="text"
              id="creator"
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
              placeholder="Chef or Restauranteur name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-gray-700 font-medium">Category*</Label>
            <Select value={category} onValueChange={handleCategoryChange} required>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {foodCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </SelectItem>
                ))}
                <SelectItem value="add_new" className="text-teal-700 font-medium">
                  <div className="flex items-center">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Category
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="cuisine" className="text-gray-700 font-medium">Cuisine</Label>
            <Input
              type="text"
              id="cuisine"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              placeholder="Italian, Mexican, etc."
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="location" className="text-gray-700 font-medium">Location</Label>
            <Input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Establishment location"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="status" className="text-gray-700 font-medium">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Visited: Tried this bite">Tried this bite</SelectItem>
                <SelectItem value="Interested: Want a bite">Interested in this bite</SelectItem>
                <SelectItem value="Returning: Returning to this bite">Returning to this bite</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex space-x-4">
            <div className="w-1/2">
              <Label htmlFor="date" className="text-gray-700 font-medium">Date experienced</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full mt-1 justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? formatDate(date) : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => selectedDate && setDate(selectedDate)}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="w-1/2">
              <Label htmlFor="visitCount" className="text-gray-700 font-medium">Visit count</Label>
              <Input
                type="number"
                id="visitCount"
                value={visitCount}
                onChange={(e) => setVisitCount(e.target.value)}
                min="0"
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rating" className="text-gray-700 font-medium">Establishment Rating (1-5)</Label>
              <div className="flex items-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star.toString())}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        parseInt(rating) >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="serviceRating" className="text-gray-700 font-medium">Service Rating</Label>
              <Select value={serviceRating} onValueChange={setServiceRating}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Rate the service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Had me at hello">Had me at hello</SelectItem>
                  <SelectItem value="Needs more effort">Needs more effort</SelectItem>
                  <SelectItem value="Disappointed">Disappointed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes" className="text-gray-700 font-medium">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Your thoughts, impressions, favorite dish and server, memorable details"
              className="mt-1"
              rows={4}
            />
          </div>
          
          <div>
            <Label htmlFor="tags" className="text-gray-700 font-medium">Tags</Label>
            <Input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags separated by commas"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label className="flex items-center space-x-2 text-gray-700 font-medium">
              <Input
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                className="w-5 h-5"
              />
              <span>Mark as favorite</span>
            </Label>
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit"
              className="bg-teal-700 hover:bg-teal-800 text-white w-full md:w-auto"
            >
              {isEdit ? "Update Bite" : "Add Bite"}
            </Button>
          </div>
        </form>
        
        <AddCategoryDialog 
          open={showAddCategoryDialog}
          onOpenChange={setShowAddCategoryDialog}
          onCategoryAdded={handleCategoryAdded}
          type="food"
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-teal-700 mb-6">{isEdit ? 'Edit Blockbuster' : 'Add Blockbuster'}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-gray-700 font-medium">Title*</Label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Name of Entertainment"
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="creator" className="text-gray-700 font-medium">Creator/Author</Label>
          <Input
            type="text"
            id="creator"
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
            placeholder="Name of Developer"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="category" className="text-gray-700 font-medium">Category*</Label>
          <Select value={category} onValueChange={handleCategoryChange} required>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select entertainment type" />
            </SelectTrigger>
            <SelectContent>
              {entertainmentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </SelectItem>
              ))}
              <SelectItem value="add_new" className="text-teal-700 font-medium">
                <div className="flex items-center">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Category
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="genre" className="text-gray-700 font-medium">Genre</Label>
          <Input
            type="text"
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="Action, Drama, Comedy, etc."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="medium" className="text-gray-700 font-medium">Platform/Medium</Label>
          <Select value={medium} onValueChange={setMedium}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Streaming services" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Netflix">Netflix</SelectItem>
              <SelectItem value="Hulu">Hulu</SelectItem>
              <SelectItem value="Amazon Prime">Amazon Prime</SelectItem>
              <SelectItem value="Disney+">Disney+</SelectItem>
              <SelectItem value="Apple TV+">Apple TV+</SelectItem>
              <SelectItem value="HBO Max">HBO Max</SelectItem>
              <SelectItem value="Paramount+">Paramount+</SelectItem>
              <SelectItem value="Peacock">Peacock</SelectItem>
              <SelectItem value="YouTube">YouTube</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="tags" className="text-gray-700 font-medium">Tags (comma separated)</Label>
          <Input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="thriller, sci-fi, favorite"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="rating" className="text-gray-700 font-medium">Rating (1-5)</Label>
          <div className="flex items-center mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star.toString())}
                className="p-1 focus:outline-none"
              >
                <Star
                  className={`h-6 w-6 ${
                    parseInt(rating) >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <Label htmlFor="status" className="text-gray-700 font-medium">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Watched">Watched/Completed</SelectItem>
              <SelectItem value="Want to Watch">Want to Watch/Play/Read</SelectItem>
              <SelectItem value="Currently Watching">Currently Watching/Playing/Reading</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="notes" className="text-gray-700 font-medium">Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Your thoughts, impressions, memorable details"
            className="mt-1"
            rows={4}
          />
        </div>
        
        <div>
          <Label className="flex items-center space-x-2 text-gray-700 font-medium">
            <Input
              type="checkbox"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
              className="w-5 h-5"
            />
            <span>Mark as favorite</span>
          </Label>
        </div>
        
        <div>
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal mt-1",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? formatDate(date) : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center" side="bottom">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => selectedDate && setDate(selectedDate)}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="pt-4">
          <Button 
            type="submit"
            className="bg-teal-700 hover:bg-teal-800 text-white w-full md:w-auto"
          >
            {isEdit ? "Update Blockbuster" : "Add Blockbuster"}
          </Button>
        </div>
      </form>
      
      <AddCategoryDialog 
        open={showAddCategoryDialog}
        onOpenChange={setShowAddCategoryDialog}
        onCategoryAdded={handleCategoryAdded}
        type="entertainment"
      />
    </div>
  );
};

export default CardForm;
