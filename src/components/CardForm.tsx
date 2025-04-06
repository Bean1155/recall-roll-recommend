
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FoodCard, EntertainmentCard, FoodStatus, EntertainmentStatus } from "@/lib/types";
import { getCardById } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface CardFormProps {
  type: "food" | "entertainment";
  initialData?: FoodCard | EntertainmentCard;
  onSubmit?: (data: FoodCard | EntertainmentCard) => void;
  isEdit?: boolean;
  cardId?: string;
  onSubmitSuccess?: (cardId: string) => void;
}

const CardForm = ({ type, initialData, onSubmit, isEdit = false, cardId, onSubmitSuccess }: CardFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FoodCard | EntertainmentCard | null>(null);

  useEffect(() => {
    if (cardId) {
      const card = getCardById(cardId);
      if (card) {
        setFormData(card as FoodCard | EntertainmentCard);
      }
    } else if (initialData) {
      setFormData(initialData);
    }
  }, [cardId, initialData]);

  const [title, setTitle] = useState(formData?.title || initialData?.title || "");
  const [creator, setCreator] = useState(formData?.creator || initialData?.creator || "");
  const [category, setCategory] = useState((formData as FoodCard)?.category || (formData as EntertainmentCard)?.entertainmentCategory || (initialData as FoodCard)?.category || (initialData as EntertainmentCard)?.entertainmentCategory || "");
  const [cuisine, setCuisine] = useState((formData as FoodCard)?.cuisine || (initialData as FoodCard)?.cuisine || "");
  const [location, setLocation] = useState((formData as FoodCard)?.location || (initialData as FoodCard)?.location || "");
  const [genre, setGenre] = useState((formData as EntertainmentCard)?.genre || (initialData as EntertainmentCard)?.genre || "");
  const [medium, setMedium] = useState((formData as EntertainmentCard)?.medium || (initialData as EntertainmentCard)?.medium || "");
  const [url, setUrl] = useState(formData?.url || initialData?.url || "");
  const [tags, setTags] = useState(formData?.tags?.join(", ") || initialData?.tags?.join(", ") || "");
  const [rating, setRating] = useState(formData?.rating?.toString() || initialData?.rating?.toString() || "");
  const [status, setStatus] = useState(formData?.status || initialData?.status || "");
  const [notes, setNotes] = useState(formData?.notes || initialData?.notes || "");
  const [isFavorite, setIsFavorite] = useState(formData?.isFavorite || initialData?.isFavorite || false);
  const [date, setDate] = useState(formData?.date ? new Date(formData.date) : initialData?.date ? new Date(initialData.date) : new Date());
  const [serviceRating, setServiceRating] = useState((formData as FoodCard)?.serviceRating?.toString() || (initialData as FoodCard)?.serviceRating?.toString() || "");

  const formatDate = useCallback((date: Date): string => {
    return format(date, "yyyy-MM-dd");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cardData: FoodCard | EntertainmentCard = type === "food" ? {
      type: "food",
      title,
      creator,
      category: category as FoodCard["category"],
      cuisine,
      location,
      url,
      tags: tags.split(",").map((tag) => tag.trim()),
      rating: parseFloat(rating) || 0,
      status: status as FoodStatus,
      notes,
      isFavorite,
      date: formatDate(date),
      serviceRating: serviceRating ? (serviceRating as unknown as FoodCard["serviceRating"]) : null,
      visitCount: (formData as FoodCard)?.visitCount || 0,
      id: formData?.id || initialData?.id || String(Math.random()),
    } : {
      type: "entertainment",
      title,
      creator,
      entertainmentCategory: category,
      genre,
      medium,
      url,
      tags: tags.split(",").map((tag) => tag.trim()),
      rating: parseFloat(rating) || 0,
      status: status as EntertainmentStatus,
      notes,
      isFavorite,
      date: formatDate(date),
      id: formData?.id || initialData?.id || String(Math.random()),
    };

    if (onSubmit) {
      onSubmit(cardData);
    }
    
    if (onSubmitSuccess) {
      onSubmitSuccess(cardData.id);
    } else {
      toast({
        title: `${type === "food" ? "Bite" : "Blockbuster"} ${isEdit ? "Updated" : "Created"}!`,
        description: `Your ${type === "food" ? "bite" : "blockbuster"} has been ${isEdit ? "updated" : "created"}.`,
      });
      navigate(`/${type === "food" ? "bites" : "blockbusters"}`);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="creator">Creator</Label>
          <Input
            type="text"
            id="creator"
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
          />
        </div>

        {type === "food" ? (
          <>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                  <SelectItem value="cafe">Cafe</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                  <SelectItem value="food truck">Food Truck</SelectItem>
                  <SelectItem value="bakery">Bakery</SelectItem>
                  <SelectItem value="diner">Diner</SelectItem>
                  <SelectItem value="fine dining">Fine Dining</SelectItem>
                  <SelectItem value="specialty">Specialty</SelectItem>
                  <SelectItem value="take out">Take Out</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cuisine">Cuisine</Label>
              <Input
                type="text"
                id="cuisine"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="serviceRating">Service Rating</Label>
              <Select value={serviceRating} onValueChange={setServiceRating}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Had me at hello">Had me at hello</SelectItem>
                  <SelectItem value="Needs more effort">Needs more effort</SelectItem>
                  <SelectItem value="Disappointed">Disappointed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="movies">Movies</SelectItem>
                  <SelectItem value="tv shows">TV Shows</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="games">Games</SelectItem>
                  <SelectItem value="podcasts">Podcasts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="genre">Genre</Label>
              <Input
                type="text"
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="medium">Medium</Label>
              <Input
                type="text"
                id="medium"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
              />
            </div>
          </>
        )}

        <div>
          <Label htmlFor="url">URL</Label>
          <Input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="rating">Rating (1-5)</Label>
          <Input
            type="number"
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="5"
            required
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {type === "food" ? (
                <>
                  <SelectItem value="Visited: Tried this bite">Visited: Tried this bite</SelectItem>
                  <SelectItem value="Interested: Want a bite">Interested: Want a bite</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="Watched">Watched</SelectItem>
                  <SelectItem value="Want to Watch">Want to Watch</SelectItem>
                  <SelectItem value="Currently Watching">Currently Watching</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="isFavorite" className="inline-flex items-center">
            <Input
              type="checkbox"
              id="isFavorite"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
              className="mr-2"
            />
            <span>Is Favorite</span>
          </Label>
        </div>
        <div>
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
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
                disabled={(date) =>
                  date > new Date()
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button type="submit">{isEdit ? "Update" : "Create"}</Button>
      </form>
    </div>
  );
};

export default CardForm;
