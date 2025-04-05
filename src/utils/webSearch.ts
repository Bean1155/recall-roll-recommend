import { FoodCard, EntertainmentCard } from "@/lib/types";

// Function to generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Simulated API call for search - in a real application, this would connect to an actual search API
// Such as Google Custom Search API, Bing Search API, or DuckDuckGo API
export async function performWebSearch(query: string, type: 'food' | 'entertainment'): Promise<(FoodCard | EntertainmentCard)[]> {
  console.log(`Performing web search API call for: ${type} - "${query}"`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  let results: any[] = [];
  
  // This is where you would typically make a fetch call to a search API
  // Example with a theoretical search API:
  /*
  try {
    const response = await fetch(`https://api.example-search.com/search?q=${encodeURIComponent(query)}&type=${type}`, {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Search API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform API results to our card format
    results = data.items.map(item => ({
      id: generateId(),
      type: type,
      title: item.title,
      creator: item.author || '',
      ...(type === 'food' ? {
        cuisine: item.cuisine || '',
        location: item.location || '',
        category: determineFoodCategory(item),
      } : {
        genre: item.genre || '',
        medium: determineEntertainmentMedium(item),
        entertainmentCategory: determineEntertainmentCategory(item),
      }),
      url: item.url || '',
      tags: item.keywords ? item.keywords.split(',').map(k => k.trim()) : [],
      rating: item.rating ? parseFloat(item.rating) : undefined,
      visitCount: 1,
      status: type === 'food' ? 'Interested: Want a bite' : 'Want to Watch',
      notes: '',
      isFavorite: false
    }));
  } catch (error) {
    console.error("Search API error:", error);
    // Return empty results on error
    return [];
  }
  */
  
  // For demonstration, we'll use the mock data below instead of actual API calls
  
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
      // Generic results based on query - now enhanced with more details
      results = [
        {
          id: generateId(),
          type: 'food',
          title: `${query} Restaurant`,
          creator: "Various Chefs",
          cuisine: "Various",
          location: "Results from web search API",
          category: "restaurant",
          url: "",
          tags: ["web search API", query.toLowerCase()],
          rating: undefined,
          visitCount: 1,
          status: "Interested: Want a bite",
          notes: "",
          isFavorite: false
        }
      ];
    }
  } else {
    // Entertainment search - enhanced with API-like data
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
          tags: ["web search API", query.toLowerCase()],
          rating: undefined,
          status: "Want to Watch",
          notes: "",
          isFavorite: false
        }
      ];
    }
  }
  
  console.log(`API search completed. Found ${results.length} results`);
  return results;
}

// In a real implementation, these helper functions would analyze search results
// to determine appropriate categories
function determineFoodCategory(item: any): string {
  const keywords = [item.title, item.description].join(' ').toLowerCase();
  
  if (keywords.includes('cafe') || keywords.includes('coffee')) return 'cafe';
  if (keywords.includes('restaurant')) return 'restaurant';
  if (keywords.includes('bakery')) return 'bakery';
  if (keywords.includes('bar')) return 'bar';
  if (keywords.includes('food truck')) return 'food truck';
  
  return 'restaurant'; // Default
}

function determineEntertainmentCategory(item: any): string {
  const keywords = [item.title, item.description].join(' ').toLowerCase();
  
  if (keywords.includes('movie')) return 'movies';
  if (keywords.includes('tv') || keywords.includes('series') || keywords.includes('show')) return 'tv shows';
  if (keywords.includes('book')) return 'books';
  if (keywords.includes('game')) return 'games';
  if (keywords.includes('podcast')) return 'podcasts';
  
  return 'movies'; // Default
}

function determineEntertainmentMedium(item: any): string {
  const keywords = [item.title, item.description].join(' ').toLowerCase();
  
  if (keywords.includes('netflix')) return 'Netflix';
  if (keywords.includes('hulu')) return 'Hulu';
  if (keywords.includes('disney+') || keywords.includes('disney plus')) return 'Disney+';
  if (keywords.includes('amazon') || keywords.includes('prime')) return 'Amazon Prime';
  if (keywords.includes('hbo')) return 'HBO Max';
  
  return 'Other'; // Default
}
