
import { useState } from "react";
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
import { CardType, CatalogCard, FoodCard, EntertainmentCard, FoodCategory, FoodStatus } from "@/lib/types";
import { addCard } from "@/lib/data";
import { toast } from "@/components/ui/use-toast";
import { Plus, Minus, Calendar, Link } from "lucide-react";

interface CardFormProps {
  type: CardType;
}

const CardForm = ({ type }: CardFormProps) => {
  const navigate = useNavigate();
  const isFoodCard = type === 'food';
  
  const [formData, setFormData] = useState({
    title: '',
    creator: '',
    date: new Date().toISOString().split('T')[0],
    rating: 3,
    notes: '',
    // Food specific fields
    cuisine: '',
    location: '',
    category: 'cafe' as FoodCategory,
    status: 'Visited: Tried this bite' as FoodStatus,
    visitCount: 1,
    url: '',
    tags: '',
    // Entertainment specific fields
    genre: '',
    medium: 'Netflix',
    entertainmentCategory: 'movies',
    status: isFoodCard ? 'Visited: Tried this bite' : 'Watched',
    releaseYear: new Date().getFullYear().toString(),
  });
  
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
          status: formData.status,
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
          status: formData.status,
        } as Omit<EntertainmentCard, 'id'>;
      }
      
      addCard(card);
      
      toast({
        title: "Card Created",
        description: "Your catalog card has been created successfully!",
      });
      
      navigate(isFoodCard ? '/bites' : '/blockbusters');
    } catch (error) {
      console.error('Error creating card:', error);
      toast({
        title: "Error",
        description: "There was an error creating your card. Please try again.",
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
              <Label htmlFor="title" className="text-base">Name</Label>
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
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
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
                required
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
                required
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
                  required
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
              <Label htmlFor="title" className="text-base">Title</Label>
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
              <Label htmlFor="entertainmentCategory">Entertainment Category</Label>
              <Select
                value={formData.entertainmentCategory}
                onValueChange={(value) => handleSelectChange('entertainmentCategory', value)}
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
                required
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
          </>
        )}
        
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
            required
            className="catalog-input"
          />
        </div>
        
        <div>
          <Label htmlFor="creator">{isFoodCard ? 'Chef/Restaurant' : 'Creator/Studio'}</Label>
          <Input
            id="creator"
            name="creator"
            value={formData.creator}
            onChange={handleChange}
            required
            className="catalog-input"
            placeholder={isFoodCard ? "Chef or Restaurant name" : "Director, Author, Studio, etc."}
          />
        </div>
        
        <div>
          <Label htmlFor="rating">Rating (1-5)</Label>
          <Input
            id="rating"
            name="rating"
            type="number"
            min="1"
            max="5"
            value={formData.rating}
            onChange={handleChange}
            required
            className="catalog-input"
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

        {isFoodCard && (
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="catalog-input"
              placeholder="comfort food, spicy, vegan, etc. (comma separated)"
            />
            <p className="text-xs text-muted-foreground mt-1">Separate tags with commas</p>
          </div>
        )}
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            className="bg-white border-catalog-softBrown"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-catalog-teal hover:bg-catalog-darkTeal"
          >
            Create Card
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CardForm;
