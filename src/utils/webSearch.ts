
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
    // Enhanced food search simulation with complete data and multiple results for all searches
    const lowerQuery = query.toLowerCase();
    
    // Always return at least 3 results for any food search
    results = [
      {
        id: generateId(),
        type: 'food',
        title: `${query} Restaurant`,
        creator: "Local Restaurant Group",
        cuisine: "Various",
        location: "123 Main Street, Anytown",
        category: "restaurant",
        url: `https://www.${query.toLowerCase().replace(/\s+/g, '')}-restaurant.com`,
        tags: ["local", "trendy", query.toLowerCase()],
        rating: 4.2,
        visitCount: 1,
        status: "Interested: Want a bite",
        notes: "",
        isFavorite: false,
        date: new Date().toISOString().split('T')[0],
      }
    ];
    
    // Add popular restaurant chains based on common keywords
    if (lowerQuery.includes('pizza') || lowerQuery.includes('italian')) {
      results = [
        {
          id: generateId(),
          type: 'food',
          title: "Domino's Pizza",
          creator: "Domino's Pizza Inc.",
          cuisine: "Pizza, Italian",
          location: "Multiple locations nationwide",
          category: "restaurant",
          url: "https://www.dominos.com",
          tags: ["pizza", "delivery", "fast food"],
          rating: 3.5,
          visitCount: 1,
          status: "Interested: Want a bite",
          notes: "",
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
        },
        {
          id: generateId(),
          type: 'food',
          title: "Pizza Hut",
          creator: "Pizza Hut Inc.",
          cuisine: "Pizza, Wings",
          location: "Nationwide chain restaurants",
          category: "restaurant",
          url: "https://www.pizzahut.com",
          tags: ["pizza", "italian", "fast food"],
          rating: 3.7,
          visitCount: 1,
          status: "Interested: Want a bite",
          notes: "",
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
        },
        {
          id: generateId(),
          type: 'food',
          title: "Mellow Mushroom",
          creator: "Mellow Mushroom Inc.",
          cuisine: "Gourmet Pizza, Craft Beer",
          location: "Multiple locations across the US",
          category: "restaurant",
          url: "https://mellowmushroom.com",
          tags: ["gourmet pizza", "craft beer", "casual dining"],
          rating: 4.2,
          visitCount: 1,
          status: "Interested: Want a bite",
          notes: "",
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
        }
      ];
    } else if (lowerQuery.includes('sushi') || lowerQuery.includes('japanese')) {
      results = [
        {
          id: generateId(),
          type: 'food',
          title: "Nobu",
          creator: "Chef Nobu Matsuhisa",
          cuisine: "Japanese, Sushi, Asian Fusion",
          location: "Multiple international locations",
          category: "restaurant",
          url: "https://www.noburestaurants.com",
          tags: ["sushi", "japanese", "fine dining"],
          rating: 4.8,
          visitCount: 1,
          status: "Interested: Want a bite",
          notes: "",
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
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
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
        },
        {
          id: generateId(),
          type: 'food',
          title: "Wasabi",
          creator: "Wasabi Group",
          cuisine: "Japanese, Sushi, Ramen",
          location: "Multiple urban locations",
          category: "restaurant",
          url: "https://www.wasabi.uk.com",
          tags: ["sushi", "ramen", "casual dining"],
          rating: 3.9,
          visitCount: 1,
          status: "Interested: Want a bite",
          notes: "",
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
        }
      ];
    } else if (lowerQuery.includes('burger') || lowerQuery.includes('american')) {
      results = [
        {
          id: generateId(),
          type: 'food',
          title: "Shake Shack",
          creator: "Danny Meyer",
          cuisine: "American, Burgers",
          location: "Multiple locations nationwide",
          category: "restaurant",
          url: "https://www.shakeshack.com",
          tags: ["burgers", "shakes", "casual dining"],
          rating: 4.4,
          visitCount: 1,
          status: "Interested: Want a bite",
          notes: "",
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
        },
        {
          id: generateId(),
          type: 'food',
          title: "Five Guys",
          creator: "Murrell Family",
          cuisine: "American, Burgers",
          location: "Nationwide locations",
          category: "restaurant",
          url: "https://www.fiveguys.com",
          tags: ["burgers", "fries", "fast casual"],
          rating: 4.3,
          visitCount: 1,
          status: "Interested: Want a bite",
          notes: "",
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
        },
        {
          id: generateId(),
          type: 'food',
          title: "In-N-Out Burger",
          creator: "In-N-Out Inc.",
          cuisine: "American, Burgers",
          location: "West Coast, USA",
          category: "restaurant",
          url: "https://www.in-n-out.com",
          tags: ["burgers", "fast food", "cult favorite"],
          rating: 4.6,
          visitCount: 1,
          status: "Interested: Want a bite",
          notes: "",
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
        }
      ];
    } else if (lowerQuery.includes('cafe') || lowerQuery.includes('coffee')) {
      results = [
        {
          id: generateId(),
          type: 'food',
          title: "Starbucks",
          creator: "Starbucks Corporation",
          cuisine: "Coffee, Pastries",
          location: "Worldwide locations",
          category: "cafe",
          url: "https://www.starbucks.com",
          tags: ["coffee", "pastries", "chain"],
          rating: 3.9,
          visitCount: 1,
          status: "Interested: Want a bite",
          notes: "",
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
        },
        {
          id: generateId(),
          type: 'food',
          title: "Blue Bottle Coffee",
          creator: "James Freeman",
          cuisine: "Specialty Coffee, Light Fare",
          location: "Select urban locations",
          category: "cafe",
          url: "https://bluebottlecoffee.com",
          tags: ["coffee", "specialty", "third wave"],
          rating: 4.5,
          visitCount: 1,
          status: "Interested: Want a bite",
          notes: "",
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
        },
        {
          id: generateId(),
          type: 'food',
          title: "Peet's Coffee",
          creator: "Alfred Peet",
          cuisine: "Coffee, Bakery",
          location: "Multiple US locations",
          category: "cafe",
          url: "https://www.peets.com",
          tags: ["coffee", "bakery", "beans"],
          rating: 4.1,
          visitCount: 1,
          status: "Interested: Want a bite",
          notes: "",
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
        }
      ];
    } else if (lowerQuery.includes('mexican') || lowerQuery.includes('taco')) {
      results = [
        {
          id: generateId(),
          type: 'food',
          title: "Chipotle Mexican Grill",
          creator: "Steve Ells",
          cuisine: "Mexican, Tex-Mex",
          location: "Nationwide locations",
          category: "restaurant",
          url: "https://www.chipotle.com",
          tags: ["mexican", "fast casual", "burritos"],
          rating: 4.0,
          visitCount: 1,
          status: "Interested: Want a bite",
          notes: "",
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
        },
        {
          id: generateId(),
          type: 'food',
          title: "Taco Bell",
          creator: "Glen Bell",
          cuisine: "Mexican-inspired",
          location: "Worldwide locations",
          category: "restaurant",
          url: "https://www.tacobell.com",
          tags: ["tacos", "fast food", "mexican"],
          rating: 3.5,
          visitCount: 1,
          status: "Interested: Want a bite",
          notes: "",
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
        },
        {
          id: generateId(),
          type: 'food',
          title: "Qdoba",
          creator: "Qdoba Restaurant Corporation",
          cuisine: "Mexican, Tex-Mex",
          location: "Multiple US locations",
          category: "restaurant",
          url: "https://www.qdoba.com",
          tags: ["mexican", "fast casual", "burritos"],
          rating: 3.8,
          visitCount: 1,
          status: "Interested: Want a bite",
          notes: "",
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
        }
      ];
    }
    
    // Add the generic match to ensure we always have at least one restaurant named after the query
    if (results.length < 3) {
      results.push({
        id: generateId(),
        type: 'food',
        title: `${query} Restaurant`,
        creator: "Local Restaurant Group",
        cuisine: "Various",
        location: "123 Main Street, Anytown",
        category: "restaurant",
        url: `https://www.${query.toLowerCase().replace(/\s+/g, '')}-restaurant.com`,
        tags: ["local", "trendy", query.toLowerCase()],
        rating: 4.2,
        visitCount: 1,
        status: "Interested: Want a bite",
        notes: "",
        isFavorite: false,
        date: new Date().toISOString().split('T')[0],
      });
      
      // Add a second generic result with slightly different details
      results.push({
        id: generateId(),
        type: 'food',
        title: `${query} Bistro`,
        creator: "Chef " + query.split(' ')[0],
        cuisine: "Fusion",
        location: "456 Oak Avenue, Somewhere",
        category: "restaurant",
        url: `https://www.${query.toLowerCase().replace(/\s+/g, '')}-bistro.com`,
        tags: ["bistro", "fusion", query.toLowerCase()],
        rating: 4.0,
        visitCount: 1,
        status: "Interested: Want a bite",
        notes: "",
        isFavorite: false,
        date: new Date().toISOString().split('T')[0],
      });
    }
  } else {
    // Entertainment search - enhanced with API-like data
    const lowerQuery = query.toLowerCase();
    
    // Default generic entertainment result
    results = [
      {
        id: generateId(),
        type: 'entertainment',
        title: query,
        creator: "Various",
        genre: "Mixed",
        medium: "Various Streaming Services",
        entertainmentCategory: "movies",
        url: `https://www.imdb.com/find?q=${encodeURIComponent(query)}`,
        tags: ["search result", query.toLowerCase()],
        rating: 3.8,
        status: "Want to Watch",
        notes: "",
        isFavorite: false,
        date: new Date().toISOString().split('T')[0],
      }
    ];
    
    if (lowerQuery.includes('star wars') || lowerQuery.includes('star trek') || lowerQuery.includes('sci-fi')) {
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
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
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
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
        },
        {
          id: generateId(),
          type: 'entertainment',
          title: "Star Trek: Strange New Worlds",
          creator: "Akiva Goldsman, Alex Kurtzman",
          genre: "Science Fiction, Adventure",
          medium: "Paramount+",
          entertainmentCategory: "tv shows",
          url: "https://www.paramountplus.com/shows/star-trek-strange-new-worlds/",
          tags: ["sci-fi", "space", "adventure"],
          rating: 4.8,
          status: "Want to Watch",
          notes: "",
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
        }
      ];
    } else if (lowerQuery.includes('netflix') || lowerQuery.includes('stranger')) {
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
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
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
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
        },
        {
          id: generateId(),
          type: 'entertainment',
          title: "Squid Game",
          creator: "Hwang Dong-hyuk",
          genre: "Thriller, Drama",
          medium: "Netflix",
          entertainmentCategory: "tv shows",
          url: "https://www.netflix.com/title/81040344",
          tags: ["thriller", "korean", "drama"],
          rating: 4.6,
          status: "Want to Watch",
          notes: "",
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
        }
      ];
    } else if (lowerQuery.includes('game of thrones') || lowerQuery.includes('house of the dragon')) {
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
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
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
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
        },
        {
          id: generateId(),
          type: 'entertainment',
          title: "Westworld",
          creator: "Jonathan Nolan, Lisa Joy",
          genre: "Science Fiction, Western",
          medium: "HBO Max",
          entertainmentCategory: "tv shows",
          url: "https://www.hbo.com/westworld",
          tags: ["sci-fi", "western", "AI"],
          rating: 4.2,
          status: "Want to Watch",
          notes: "",
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
        }
      ];
    } else if (lowerQuery.includes('marvel') || lowerQuery.includes('avengers')) {
      results = [
        {
          id: generateId(),
          type: 'entertainment',
          title: "Avengers: Endgame",
          creator: "Anthony & Joe Russo",
          genre: "Action, Superhero",
          medium: "Disney+",
          entertainmentCategory: "movies",
          url: "https://www.disneyplus.com/movies/marvel-studios-avengers-endgame/aRbVJUb2h2Rf",
          tags: ["marvel", "superhero", "action"],
          rating: 4.8,
          status: "Want to Watch",
          notes: "",
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
        },
        {
          id: generateId(),
          type: 'entertainment',
          title: "WandaVision",
          creator: "Jac Schaeffer",
          genre: "Superhero, Drama",
          medium: "Disney+",
          entertainmentCategory: "tv shows",
          url: "https://www.disneyplus.com/series/wandavision/4SrN28ZjDLwH",
          tags: ["marvel", "superhero", "sitcom"],
          rating: 4.5,
          status: "Want to Watch",
          notes: "",
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
        },
        {
          id: generateId(),
          type: 'entertainment',
          title: "Loki",
          creator: "Michael Waldron",
          genre: "Superhero, Sci-Fi",
          medium: "Disney+",
          entertainmentCategory: "tv shows",
          url: "https://www.disneyplus.com/series/loki/6pARMvILBGzF",
          tags: ["marvel", "superhero", "time travel"],
          rating: 4.6,
          status: "Want to Watch",
          notes: "",
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
        }
      ];
    }
    
    // If we don't have enough results, add generic ones based on the query
    if (results.length < 3) {
      results.push({
        id: generateId(),
        type: 'entertainment',
        title: `${query} - The Movie`,
        creator: "Various Directors",
        genre: "Mixed",
        medium: "Prime Video",
        entertainmentCategory: "movies",
        url: `https://www.amazon.com/s?k=${encodeURIComponent(query)}`,
        tags: ["new release", query.toLowerCase()],
        rating: 3.9,
        status: "Want to Watch",
        notes: "",
        isFavorite: false,
        date: new Date().toISOString().split('T')[0],
      });
      
      results.push({
        id: generateId(),
        type: 'entertainment',
        title: `${query} - The Series`,
        creator: "Various Creators",
        genre: "Drama",
        medium: "Netflix",
        entertainmentCategory: "tv shows",
        url: `https://www.netflix.com/search?q=${encodeURIComponent(query)}`,
        tags: ["binge-worthy", query.toLowerCase()],
        rating: 4.0,
        status: "Want to Watch",
        notes: "",
        isFavorite: false,
        date: new Date().toISOString().split('T')[0],
      });
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
