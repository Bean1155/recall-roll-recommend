import { useState, useEffect } from "react";
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
import { CardType, CatalogCard, FoodCard, EntertainmentCard, FoodCategory, FoodStatus, EntertainmentStatus } from "@/lib/types";
import { addCard, updateCard, getCardById } from "@/lib/data";
import { toast } from "@/components/ui/use-toast";
import { Plus, Minus, Calendar, Link, Tag, Star } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface CardFormProps {
  type: CardType;
  cardId?: string;
}

const CardForm = ({ type, cardId }: CardFormProps) => {
  const navigate = useNavigate();
  const isFoodCard = type === 'food';
  const isEditMode = !!cardId;
  
  const [formData, setFormData] = useState({
    title: '',
    creator: '',
    date: new Date().toISOString().split('T')[0],
    rating: 3,
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
  });

  useEffect(() => {
    if (isEditMode && cardId) {
      const card = getCardById(cardId);
      if (card) {
        const initialData = {
          title: card.title,
          creator: card.creator,
          date: card.date,
          rating: card.rating,
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
        } else {
          const entertainmentCard = card as EntertainmentCard;
          initialData.genre = entertainmentCard.genre;
          initialData.medium = entertainmentCard.medium;
          initialData.entertainmentCategory = entertainmentCard.entertainmentCategory;
          initialData.status = entertainmentCard.status;
          initialData.url = entertainmentCard.url || '';
          initialData.tags = entertainmentCard.tags ? entertainmentCard.tags.join(', ') : '';
        }
        
        setFormData(initialData);
      }
    }
  }, [cardId, isEditMode, isFoodCard]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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
    setFormData(prev => ({ ...prev, rating: value[0] }));
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const baseCard: Omit<CatalogCard, 'id'> = {
        type,
        title: formData.title,
        creator: formData.creator,
        date: formData.date,
        rating: Number(formData.rating),
        notes: formData.notes,
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
      
      if (isEditMode && cardId) {
        updateCard({
          ...card,
          id: cardId,
        } as CatalogCard);
        
        toast({
          title: "Card Updated",
          description: "Your catalog card has been updated successfully!",
        });
      } else {
        addCard(card);
        
        toast({
          title: "Card Created",
          description: "Your catalog card has been created successfully!",
        });
      }
      
      navigate(isFoodCard ? '/bites' : '/blockbusters');
    } catch (error) {
      console.error('Error processing card:', error);
      toast({
        title: "Error",
        description: "There was an error processing your card. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="catalog-card max-w-md mx-auto">
      <div className="space-y-4">
        {isFoodCard ? (
          <>
            <div>
              <Label htmlFor="title" className="text-base">Name <span className="text-red-500">*</span></Label>
              <p className="text-xs italic mb-1">Name of Establishment</p>
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
              <Label htmlFor="creator">Chef/Restaurant</Label>
              <Input
                id="creator"
                name="creator"
                value={formData.creator}
                onChange={handleChange}
                className="catalog-input"
                placeholder="Chef or Restaurant name"
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
                required
              >
                <SelectTrigger className="catalog-input">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cafe">Cafe</SelectItem>
                  <SelectItem value="diner">Diner</SelectItem>
                  <SelectItem value="specialty foods">Specialty Foods</SelectItem>
                  <SelectItem value="fine dining">Fine Dining</SelectItem>
                  <SelectItem value="take out">Take Out</SelectItem>
                  <SelectItem value="bakeries">Bakeries</SelectItem>
                  <SelectItem value="bars">Bars</SelectItem>
                  <SelectItem value="food trucks">Food Trucks</SelectItem>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
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

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger className="catalog-input">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Visited: Tried this bite">Visited: Tried this bite</SelectItem>
                  <SelectItem value="Interested: Want a bite">Interested: Want a bite</SelectItem>
                  <SelectItem value="Highly Recommend">Highly Recommend</SelectItem>
                  <SelectItem value="Favorite">Favorite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="rating" className="flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Rating
              </Label>
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
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="title" className="text-base">Title <span className="text-red-500">*</span></Label>
              <p className="text-xs italic mb-1">Name of show, performance, etc.</p>
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
              <Label htmlFor="entertainmentCategory">Entertainment Category <span className="text-red-500">*</span></Label>
              <Select
                value={formData.entertainmentCategory}
                onValueChange={(value) => handleSelectChange('entertainmentCategory', value)}
                required
              >
                <SelectTrigger className="catalog-input">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="movies">Movies</SelectItem>
                  <SelectItem value="tv shows">TV Shows</SelectItem>
                  <SelectItem value="comedies">Comedies</SelectItem>
                  <SelectItem value="live performances">Live Performances</SelectItem>
                  <SelectItem value="podcasts">Podcasts</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="games">Games</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
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
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger className="catalog-input">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Watched">Watched</SelectItem>
                  <SelectItem value="Want to Watch">Want to Watch</SelectItem>
                  <SelectItem value="Currently Watching">Currently Watching</SelectItem>
                  <SelectItem value="Highly Recommend">Highly Recommend</SelectItem>
                  <SelectItem value="Favorite">Favorite</SelectItem>
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
              <Label htmlFor="rating" className="flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Rating
              </Label>
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
                placeholder="Website or streaming link"
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
                placeholder="comedy, sci-fi, 90s, etc. (comma separated)"
              />
              <p className="text-xs text-muted-foreground mt-1">Separate tags with commas</p>
            </div>
          </>
        )}
        
        {isFoodCard && (
          <>
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
        )}

        <div className="pt-4">
          <Button 
            type="submit"
            className="w-full bg-catalog-softBrown hover:bg-catalog-darkBrown text-white"
          >
            {isEditMode 
              ? (isFoodCard ? 'Update Bite' : 'Update Blockbuster') 
              : (isFoodCard ? 'Save Bite' : 'Save Blockbuster')}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CardForm;
