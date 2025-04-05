
import { FoodCard, EntertainmentCard } from "@/lib/types";

// Function to generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Web search API function that simulates a search API call
export async function performWebSearch(query: string, type: 'food' | 'entertainment'): Promise<(FoodCard | EntertainmentCard)[]> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  console.log(`Performing web search for: ${type} - "${query}"`);
  
  let results: any[] = [];
  
  if (type === 'food') {
    // Food search simulation with more realistic data
    if (query.toLowerCase().includes('pizza')) {
      results = [
        {
          id: generateId(),
          type: 'food',
          title: "Domino's Pizza",
          creator: "Domino's Pizza Inc.",
          cuisine: "Pizza, Italian",
          location: "Nationwide",
          category: "restaurant",
          url: "https://www.dominos.com",
          tags: ["pizza", "delivery", "fast food"],
          rating: 3.5,
          visitCount: 1,
          status: "Interested: Want a bite",
          notes: "",
          isFavorite: false
        },
        {
          id: generateId(),
          type: 'food',
          title: "Pizza Hut",
          creator: "Pizza Hut Inc.",
          cuisine: "Pizza, Wings",
          location: "Nationwide",
          category: "restaurant",
          url: "https://www.pizzahut.com",
          tags: ["pizza", "italian", "fast food"],
          rating: 3.7,
          visitCount: 1,
          status: "Interested: Want a bite",
          notes: "",
          isFavorite: false
        },
        {
          id: generateId(),
          type: 'food',
          title: "Mellow Mushroom",
          creator: "Mellow Mushroom Inc.",
          cuisine: "Gourmet Pizza, Craft Beer",
          location: "Multiple locations",
          category: "restaurant",
          url: "https://mellowmushroom.com",
          tags: ["gourmet pizza", "craft beer", "casual dining"],
          rating: 4.2,
          visitCount: 1,
          status: "Interested: Want a bite",
          notes: "",
          isFavorite: false
        }
      ];
    } else if (query.toLowerCase().includes('sushi')) {
      results = [
        {
          id: generateId(),
          type: 'food',
          title: "Nobu",
          creator: "Chef Nobu Matsuhisa",
          cuisine: "Japanese, Sushi",
          location: "Multiple international locations",
          category: "restaurant",
          url: "https://www.noburestaurants.com",
          tags: ["sushi", "japanese", "fine dining"],
          rating: 4.8,
          visitCount: 1,
          status: "Interested: Want a bite",
          notes: "",
          isFavorite: false
        },
        {
          id: generateId(),
          type: 'food',
          title: "Sushi Nakazawa",
          creator: "Chef Daisuke Nakazawa",
          cuisine: "Japanese, Omakase",
          location: "New York, NY",
          category: "restaurant",
          url: "https://www.sushinakazawa.com",
          tags: ["sushi", "omakase", "fine dining"],
          rating: 4.9,
          visitCount: 1,
          status: "Interested: Want a bite",
          notes: "",
          isFavorite: false
        }
      ];
    } else if (query.toLowerCase().includes('burger')) {
      results = [
        {
          id: generateId(),
          type: 'food',
          title: "Shake Shack",
          creator: "Danny Meyer",
          cuisine: "American, Burgers",
          location: "Multiple locations",
          category: "restaurant",
          url: "https://www.shakeshack.com",
          tags: ["burgers", "shakes", "casual dining"],
          rating: 4.4,
          visitCount: 1,
          status: "Interested: Want a bite",
          notes: "",
          isFavorite: false
        },
        {
          id: generateId(),
          type: 'food',
          title: "Five Guys",
          creator: "Murrell Family",
          cuisine: "American, Burgers",
          location: "Nationwide",
          category: "restaurant",
          url: "https://www.fiveguys.com",
          tags: ["burgers", "fries", "fast casual"],
          rating: 4.3,
          visitCount: 1,
          status: "Interested: Want a bite",
          notes: "",
          isFavorite: false
        }
      ];
    } else if (query.toLowerCase().includes('cafe')) {
      results = [
        {
          id: generateId(),
          type: 'food',
          title: "Starbucks",
          creator: "Starbucks Corporation",
          cuisine: "Coffee, Pastries",
          location: "Worldwide",
          category: "cafe",
          url: "https://www.starbucks.com",
          tags: ["coffee", "pastries", "chain"],
          rating: 3.9,
          visitCount: 1,
          status: "Interested: Want a bite",
          notes: "",
          isFavorite: false
        },
        {
          id: generateId(),
          type: 'food',
          title: "Blue Bottle Coffee",
          creator: "James Freeman",
          cuisine: "Specialty Coffee, Light Fare",
          location: "Multiple locations",
          category: "cafe",
          url: "https://bluebottlecoffee.com",
          tags: ["coffee", "specialty", "third wave"],
          rating: 4.5,
          visitCount: 1,
          status: "Interested: Want a bite",
          notes: "",
          isFavorite: false
        }
      ];
    } else {
      // Generic results based on query
      results = [
        {
          id: generateId(),
          type: 'food',
          title: `${query} Restaurant`,
          creator: "Various Chefs",
          cuisine: "Various",
          location: "Results from web search",
          category: "restaurant",
          url: "",
          tags: ["web search", query.toLowerCase()],
          rating: undefined,
          visitCount: 1,
          status: "Interested: Want a bite",
          notes: "",
          isFavorite: false
        }
      ];
    }
  } else {
    // Entertainment search
    if (query.toLowerCase().includes('star wars')) {
      results = [
        {
          id: generateId(),
          type: 'entertainment',
          title: "Star Wars: The Force Awakens",
          creator: "J.J. Abrams",
          genre: "Science Fiction, Action",
          medium: "Disney+",
          entertainmentCategory: "movies",
          url: "https://www.disneyplus.com/movies/star-wars-the-force-awakens/4RLKxpFcZRQK",
          tags: ["sci-fi", "action", "adventure"],
          rating: 4.1,
          status: "Want to Watch",
          notes: "",
          isFavorite: false
        },
        {
          id: generateId(),
          type: 'entertainment',
          title: "Star Wars: The Mandalorian",
          creator: "Jon Favreau",
          genre: "Science Fiction, Western",
          medium: "Disney+",
          entertainmentCategory: "tv shows",
          url: "https://www.disneyplus.com/series/the-mandalorian/3jLIGMDYINqD",
          tags: ["sci-fi", "action", "drama"],
          rating: 4.7,
          status: "Want to Watch",
          notes: "",
          isFavorite: false
        }
      ];
    } else if (query.toLowerCase().includes('netflix') || query.toLowerCase().includes('stranger')) {
      results = [
        {
          id: generateId(),
          type: 'entertainment',
          title: "Stranger Things",
          creator: "The Duffer Brothers",
          genre: "Science Fiction, Horror",
          medium: "Netflix",
          entertainmentCategory: "tv shows",
          url: "https://www.netflix.com/title/80057281",
          tags: ["sci-fi", "horror", "1980s"],
          rating: 4.8,
          status: "Want to Watch",
          notes: "",
          isFavorite: false
        },
        {
          id: generateId(),
          type: 'entertainment',
          title: "The Queen's Gambit",
          creator: "Scott Frank, Allan Scott",
          genre: "Drama",
          medium: "Netflix",
          entertainmentCategory: "tv shows",
          url: "https://www.netflix.com/title/80234304",
          tags: ["drama", "chess", "period"],
          rating: 4.7,
          status: "Want to Watch",
          notes: "",
          isFavorite: false
        }
      ];
    } else if (query.toLowerCase().includes('game of thrones')) {
      results = [
        {
          id: generateId(),
          type: 'entertainment',
          title: "Game of Thrones",
          creator: "David Benioff, D. B. Weiss",
          genre: "Fantasy, Drama",
          medium: "HBO Max",
          entertainmentCategory: "tv shows",
          url: "https://www.hbomax.com/series/urn:hbo:series:GVU2cggagzYNJjhsJATwo",
          tags: ["fantasy", "drama", "medieval"],
          rating: 4.6,
          status: "Want to Watch",
          notes: "",
          isFavorite: false
        },
        {
          id: generateId(),
          type: 'entertainment',
          title: "House of the Dragon",
          creator: "Ryan Condal, George R. R. Martin",
          genre: "Fantasy, Drama",
          medium: "HBO Max",
          entertainmentCategory: "tv shows",
          url: "https://www.hbo.com/house-of-the-dragon",
          tags: ["fantasy", "drama", "prequel"],
          rating: 4.4,
          status: "Want to Watch",
          notes: "",
          isFavorite: false
        }
      ];
    } else {
      // Generic entertainment search results
      results = [
        {
          id: generateId(),
          type: 'entertainment',
          title: query,
          creator: "Various",
          genre: "Mixed",
          medium: "Various Streaming Services",
          entertainmentCategory: "movies",
          url: "",
          tags: ["web search", query.toLowerCase()],
          rating: undefined,
          status: "Want to Watch",
          notes: "",
          isFavorite: false
        }
      ];
    }
  }
  
  return results;
}
