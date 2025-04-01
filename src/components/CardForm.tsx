
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CardType, CatalogCard, FoodCard, EntertainmentCard } from "@/lib/types";
import { addCard } from "@/lib/data";
import { toast } from "@/components/ui/use-toast";

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
    dish: '',
    // Entertainment specific fields
    genre: '',
    medium: '',
    releaseYear: new Date().getFullYear().toString(),
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
          dish: formData.dish,
        } as Omit<FoodCard, 'id'>;
      } else {
        card = {
          ...baseCard,
          genre: formData.genre,
          medium: formData.medium,
          releaseYear: formData.releaseYear,
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
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="catalog-input"
            placeholder={isFoodCard ? "Dish Name or Restaurant" : "Movie/Show/Book Title"}
          />
        </div>
        
        <div>
          <Label htmlFor="creator">
            {isFoodCard ? "Chef/Restaurant" : "Director/Studio/Author"}
          </Label>
          <Input
            id="creator"
            name="creator"
            value={formData.creator}
            onChange={handleChange}
            required
            className="catalog-input"
            placeholder={isFoodCard ? "Chef or Restaurant Name" : "Creator Name"}
          />
        </div>
        
        {isFoodCard ? (
          <>
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
            <div>
              <Label htmlFor="dish">Dish</Label>
              <Input
                id="dish"
                name="dish"
                value={formData.dish}
                onChange={handleChange}
                required
                className="catalog-input"
                placeholder="Specific Dish Name"
              />
            </div>
          </>
        ) : (
          <>
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
              <Input
                id="medium"
                name="medium"
                value={formData.medium}
                onChange={handleChange}
                required
                className="catalog-input"
                placeholder="Movie, TV Show, Book, etc."
              />
            </div>
            <div>
              <Label htmlFor="releaseYear">Release Year</Label>
              <Input
                id="releaseYear"
                name="releaseYear"
                value={formData.releaseYear}
                onChange={handleChange}
                required
                className="catalog-input"
                placeholder="Year of Release"
              />
            </div>
          </>
        )}
        
        <div>
          <Label htmlFor="date">Date Experienced</Label>
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
