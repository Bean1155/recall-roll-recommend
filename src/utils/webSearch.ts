
import { FoodCard, EntertainmentCard } from "@/lib/types";

// Function to generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Function to perform web search using DuckDuckGo
export async function performWebSearch(query: string, type: 'food' | 'entertainment'): Promise<(FoodCard | EntertainmentCard)[]> {
  console.log(`Performing web search for: ${type} - "${query}"`);
  
  // Ensure query is not empty
  if (!query.trim()) {
    return [];
  }
  
  // Append relevant keywords to enhance search results
  let searchQuery = query;
  if (type === 'food') {
    searchQuery += ' restaurant food';
  } else {
    searchQuery += ' movie tv show entertainment';
  }
  
  try {
    // Use DuckDuckGo's search engine through a proxy or directly
    // Note: This uses the HTML scraping approach since DDG doesn't have an official API
    const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(searchQuery)}&format=json&pretty=1&no_html=1&skip_disambig=1`);
    
    if (!response.ok) {
      console.error('DuckDuckGo search failed:', response.status);
      throw new Error(`Search failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('DuckDuckGo response:', data);
    
    // DuckDuckGo results structure varies, but we'll process what we can
    const results: (FoodCard | EntertainmentCard)[] = [];
    
    // Process AbstractTopics (typically higher quality results)
    if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
      for (const topic of data.RelatedTopics.slice(0, 5)) {  // Limit to 5 results
        if (topic.Result && topic.Text) {
          const resultObj = createCardFromDDGResult(topic, type);
          if (resultObj) results.push(resultObj);
        }
      }
    }
    
    // If we have entity information, use it
    if (data.Entity && data.Abstract) {
      results.unshift(
        createCardFromEntityInfo(data, type)
      );
    }
    
    // If still not enough results, add generic placeholder based on the query
    if (results.length === 0) {
      results.push(createGenericCard(query, type));
    }
    
    console.log(`Web search completed. Found ${results.length} results`);
    return results;
  } catch (error) {
    console.error("Search API error:", error);
    // If API fails, return at least one generic result based on the query
    return [createGenericCard(query, type)];
  }
}

// Helper to create a card from DuckDuckGo RelatedTopics result
function createCardFromDDGResult(topic: any, type: 'food' | 'entertainment'): FoodCard | EntertainmentCard {
  // Extract info from the result text
  const title = topic.Text.split(' - ')[0] || topic.Text;
  
  if (type === 'food') {
    return {
      id: generateId(),
      type: 'food',
      title: title,
      creator: topic.Text.includes(' - ') ? topic.Text.split(' - ')[1] : '',
      cuisine: extractCuisineFromText(topic.Text),
      location: extractLocationFromText(topic.Text),
      category: determineFoodCategory(topic),
      url: topic.FirstURL || '',
      tags: extractTagsFromText(topic.Text),
      rating: Math.floor(Math.random() * 5) + 1, // Random rating 1-5
      visitCount: 1,
      status: 'Interested: Want a bite',
      notes: '',
      isFavorite: false,
      date: new Date().toISOString().split('T')[0],
      serviceRating: null
    };
  } else {
    return {
      id: generateId(),
      type: 'entertainment',
      title: title,
      creator: topic.Text.includes(' - ') ? topic.Text.split(' - ')[1] : '',
      genre: extractGenreFromText(topic.Text),
      medium: determineEntertainmentMedium(topic),
      entertainmentCategory: determineEntertainmentCategory(topic),
      url: topic.FirstURL || '',
      tags: extractTagsFromText(topic.Text),
      rating: Math.floor(Math.random() * 5) + 1, // Random rating 1-5
      status: 'Want to Watch',
      notes: '',
      isFavorite: false,
      date: new Date().toISOString().split('T')[0]
    };
  }
}

// Helper to create a card from DuckDuckGo Entity information
function createCardFromEntityInfo(data: any, type: 'food' | 'entertainment'): FoodCard | EntertainmentCard {
  if (type === 'food') {
    return {
      id: generateId(),
      type: 'food',
      title: data.Heading || data.Entity,
      creator: extractCreatorFromAbstract(data.Abstract),
      cuisine: extractCuisineFromText(data.Abstract),
      location: data.AbstractSource || '',
      category: extractCategoryFromText(data.Abstract, 'food'),
      url: data.AbstractURL || '',
      tags: extractTagsFromText(data.Abstract),
      rating: Math.floor(Math.random() * 5) + 1, // Random rating 1-5
      visitCount: 1,
      status: 'Interested: Want a bite',
      notes: data.Abstract ? data.Abstract.substring(0, 100) : '',
      isFavorite: false,
      date: new Date().toISOString().split('T')[0],
      serviceRating: null
    };
  } else {
    return {
      id: generateId(),
      type: 'entertainment',
      title: data.Heading || data.Entity,
      creator: extractCreatorFromAbstract(data.Abstract),
      genre: extractGenreFromText(data.Abstract),
      medium: data.AbstractSource || 'Various',
      entertainmentCategory: extractCategoryFromText(data.Abstract, 'entertainment'),
      url: data.AbstractURL || '',
      tags: extractTagsFromText(data.Abstract),
      rating: Math.floor(Math.random() * 5) + 1, // Random rating 1-5
      status: 'Want to Watch',
      notes: data.Abstract ? data.Abstract.substring(0, 100) : '',
      isFavorite: false,
      date: new Date().toISOString().split('T')[0]
    };
  }
}

// Helper to create a generic card when no results are found
function createGenericCard(query: string, type: 'food' | 'entertainment'): FoodCard | EntertainmentCard {
  if (type === 'food') {
    return {
      id: generateId(),
      type: 'food',
      title: `${query} Restaurant`,
      creator: "Local Restaurant Group",
      cuisine: "Various",
      location: "123 Main Street, Anytown",
      category: "restaurant",
      url: `https://www.google.com/search?q=${encodeURIComponent(query)}+restaurant`,
      tags: ["local", query.toLowerCase()],
      rating: 4,
      visitCount: 1,
      status: "Interested: Want a bite",
      notes: "",
      isFavorite: false,
      date: new Date().toISOString().split('T')[0],
      serviceRating: null
    };
  } else {
    return {
      id: generateId(),
      type: 'entertainment',
      title: query,
      creator: "Various",
      genre: "Mixed",
      medium: "Various Streaming Services",
      entertainmentCategory: "movies",
      url: `https://www.google.com/search?q=${encodeURIComponent(query)}+movie+show`,
      tags: ["entertainment", query.toLowerCase()],
      rating: 4,
      status: "Want to Watch",
      notes: "",
      isFavorite: false,
      date: new Date().toISOString().split('T')[0]
    };
  }
}

// Helper functions for information extraction
function extractCuisineFromText(text: string): string {
  const lowerText = text.toLowerCase();
  const cuisines = [
    'italian', 'mexican', 'chinese', 'japanese', 'thai', 'indian', 
    'mediterranean', 'french', 'greek', 'spanish', 'korean', 
    'vietnamese', 'american', 'middle eastern', 'caribbean'
  ];
  
  for (const cuisine of cuisines) {
    if (lowerText.includes(cuisine)) {
      return cuisine.charAt(0).toUpperCase() + cuisine.slice(1);
    }
  }
  
  return '';
}

function extractLocationFromText(text: string): string {
  // Simple detection of location pattern like "in City" or "at Location"
  const locationMatches = text.match(/(?:in|at|located in|located at|from) ([A-Za-z\s,]+)/i);
  return locationMatches ? locationMatches[1].trim() : '';
}

function extractTagsFromText(text: string): string[] {
  // Extract key terms as tags
  const words = text.toLowerCase().split(/\s+/);
  const commonWords = new Set(['and', 'the', 'a', 'an', 'in', 'on', 'at', 'of', 'for', 'with', 'by', 'to', 'from']);
  const tags = words
    .filter(word => word.length > 3 && !commonWords.has(word))
    .map(word => word.replace(/[^a-z0-9]/g, ''))
    .filter(word => word.length > 3)
    .slice(0, 3); // Keep only 3 most significant tags
  
  return Array.from(new Set(tags)); // Remove duplicates
}

function extractGenreFromText(text: string): string {
  const lowerText = text.toLowerCase();
  const genres = [
    'action', 'adventure', 'comedy', 'drama', 'horror', 'sci-fi', 'science fiction',
    'fantasy', 'thriller', 'romance', 'mystery', 'documentary', 'animation', 
    'superhero', 'crime', 'historical', 'musical', 'western'
  ];
  
  for (const genre of genres) {
    if (lowerText.includes(genre)) {
      return genre.charAt(0).toUpperCase() + genre.slice(1);
    }
  }
  
  return 'General';
}

function extractCreatorFromAbstract(abstract: string): string {
  if (!abstract) return '';
  
  // Common patterns for director/creator mention
  const directorMatch = abstract.match(/directed by ([A-Za-z\s]+)/i) || 
                       abstract.match(/director ([A-Za-z\s]+)/i);
  
  const creatorMatch = abstract.match(/created by ([A-Za-z\s]+)/i) || 
                       abstract.match(/from ([A-Za-z\s]+)/i) ||
                       abstract.match(/by ([A-Za-z\s]+)/i);
  
  if (directorMatch) return directorMatch[1].trim();
  if (creatorMatch) return creatorMatch[1].trim();
  
  return '';
}

function extractCategoryFromText(text: string, type: 'food' | 'entertainment'): any {
  if (type === 'food') {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('cafe') || lowerText.includes('coffee')) return 'cafe';
    if (lowerText.includes('bakery') || lowerText.includes('pastry')) return 'bakery';
    if (lowerText.includes('bar') || lowerText.includes('pub')) return 'bar';
    if (lowerText.includes('food truck')) return 'food truck';
    
    return 'restaurant'; // Default category
  } else {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('movie') || lowerText.includes('film')) return 'movies';
    if (lowerText.includes('tv') || lowerText.includes('television') || lowerText.includes('series')) return 'tv shows';
    if (lowerText.includes('book')) return 'books';
    if (lowerText.includes('game')) return 'games';
    if (lowerText.includes('podcast')) return 'podcasts';
    
    return 'movies'; // Default category
  }
}

// In a real implementation, these helper functions would analyze search results
// to determine appropriate categories
function determineFoodCategory(item: any): string {
  const text = item.Text || '';
  const keywords = text.toLowerCase();
  
  if (keywords.includes('cafe') || keywords.includes('coffee')) return 'cafe';
  if (keywords.includes('restaurant')) return 'restaurant';
  if (keywords.includes('bakery')) return 'bakery';
  if (keywords.includes('bar')) return 'bar';
  if (keywords.includes('food truck')) return 'food truck';
  
  return 'restaurant'; // Default
}

function determineEntertainmentCategory(item: any): string {
  const text = item.Text || '';
  const keywords = text.toLowerCase();
  
  if (keywords.includes('movie')) return 'movies';
  if (keywords.includes('tv') || keywords.includes('series') || keywords.includes('show')) return 'tv shows';
  if (keywords.includes('book')) return 'books';
  if (keywords.includes('game')) return 'games';
  if (keywords.includes('podcast')) return 'podcasts';
  
  return 'movies'; // Default
}

function determineEntertainmentMedium(item: any): string {
  const text = item.Text || '';
  const keywords = text.toLowerCase();
  
  if (keywords.includes('netflix')) return 'Netflix';
  if (keywords.includes('hulu')) return 'Hulu';
  if (keywords.includes('disney+') || keywords.includes('disney plus')) return 'Disney+';
  if (keywords.includes('amazon') || keywords.includes('prime')) return 'Amazon Prime';
  if (keywords.includes('hbo')) return 'HBO Max';
  
  return 'Other'; // Default
}

// Fallback to simulated search in case the DuckDuckGo API fails or is blocked
// This code can be removed in a production environment with proper API setup
export async function simulateWebSearch(query: string, type: 'food' | 'entertainment'): Promise<(FoodCard | EntertainmentCard)[]> {
  console.log(`Simulating web search API call for: ${type} - "${query}"`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  let results: any[] = [];
  const lowerQuery = query.toLowerCase();
  
  if (type === 'food') {
    // Enhanced food search simulation with complete data
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
          serviceRating: null
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
          serviceRating: null
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
          serviceRating: null
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
          serviceRating: null
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
          serviceRating: null
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
          serviceRating: null
        }
      ];
    } else {
      // Generic match for any other query
      results = [
        {
          id: generateId(),
          type: 'food',
          title: `${query} Restaurant`,
          creator: "Local Restaurant Group",
          cuisine: "Various",
          location: "123 Main Street, Anytown",
          category: "restaurant",
          url: `https://www.google.com/search?q=${encodeURIComponent(query)}+restaurant`,
          tags: ["local", "trendy", query.toLowerCase()],
          rating: 4.2,
          visitCount: 1,
          status: "Interested: Want a bite",
          notes: "",
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
          serviceRating: null
        },
        {
          id: generateId(),
          type: 'food',
          title: `${query} Bistro`,
          creator: "Chef " + query.split(' ')[0],
          cuisine: "Fusion",
          location: "456 Oak Avenue, Somewhere",
          category: "restaurant",
          url: `https://www.google.com/search?q=${encodeURIComponent(query)}+bistro`,
          tags: ["bistro", "fusion", query.toLowerCase()],
          rating: 4.0,
          visitCount: 1,
          status: "Interested: Want a bite",
          notes: "",
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
          serviceRating: null
        },
        {
          id: generateId(),
          type: 'food',
          title: `${query} Café`,
          creator: "Local Coffee Roasters",
          cuisine: "Coffee, Breakfast",
          location: "789 Pine Street, Elsewhere",
          category: "cafe",
          url: `https://www.google.com/search?q=${encodeURIComponent(query)}+cafe`,
          tags: ["coffee", "breakfast", query.toLowerCase()],
          rating: 4.1,
          visitCount: 1,
          status: "Interested: Want a bite",
          notes: "",
          isFavorite: false,
          date: new Date().toISOString().split('T')[0],
          serviceRating: null
        }
      ];
    }
  } else {
    // Entertainment search results
    if (lowerQuery.includes('star wars') || lowerQuery.includes('star trek')) {
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
          date: new Date().toISOString().split('T')[0]
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
          date: new Date().toISOString().split('T')[0]
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
          date: new Date().toISOString().split('T')[0]
        }
      ];
    } else {
      // Generic entertainment results for other queries
      results = [
        {
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
          date: new Date().toISOString().split('T')[0]
        },
        {
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
          date: new Date().toISOString().split('T')[0]
        },
        {
          id: generateId(),
          type: 'entertainment',
          title: `${query} Documentary`,
          creator: "Documentary Films Inc.",
          genre: "Documentary",
          medium: "HBO Max",
          entertainmentCategory: "movies",
          url: `https://www.hbomax.com/search?query=${encodeURIComponent(query)}`,
          tags: ["documentary", "informative", query.toLowerCase()],
          rating: 4.3,
          status: "Want to Watch",
          notes: "",
          isFavorite: false,
          date: new Date().toISOString().split('T')[0]
        }
      ];
    }
  }
  
  console.log(`Simulated search completed. Found ${results.length} results`);
  return results;
}
