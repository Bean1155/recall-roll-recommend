import { CatalogCard, FoodCard, EntertainmentCard, FoodStatus, RecommendationBadge } from './types';

// Mock data
const mockCards: CatalogCard[] = [
  {
    id: '1',
    type: 'food',
    title: 'Amazing Pasta',
    creator: 'Italian Bistro',
    date: '2023-05-15',
    rating: 4,
    notes: 'The pasta was perfectly al dente and the sauce was rich and flavorful.',
    cuisine: 'Italian',
    location: 'Downtown',
    category: 'fine dining',
    status: 'Visited: Tried this bite' as FoodStatus,
    visitCount: 2,
    tags: ['pasta', 'italian', 'date night'],
  } as FoodCard,
  {
    id: '2',
    type: 'entertainment',
    title: 'The Matrix',
    creator: 'Wachowski Sisters',
    date: '2023-06-20',
    rating: 5,
    notes: 'Mind-blowing special effects and a thought-provoking plot.',
    genre: 'Sci-Fi',
    medium: 'Netflix',
    entertainmentCategory: 'movies',
    status: 'Watched',
  } as EntertainmentCard,
  {
    id: '3',
    type: 'food',
    title: 'Spicy Tacos',
    creator: 'Taqueria El Sol',
    date: '2023-04-10',
    rating: 5,
    notes: 'The most authentic tacos I\'ve had outside of Mexico.',
    cuisine: 'Mexican',
    location: 'East Side',
    category: 'food trucks',
    status: 'Visited: Tried this bite' as FoodStatus,
    visitCount: 3,
    tags: ['tacos', 'spicy', 'mexican'],
  } as FoodCard,
  {
    id: '4',
    type: 'entertainment',
    title: 'Stranger Things',
    creator: 'Duffer Brothers',
    date: '2023-07-05',
    rating: 4,
    notes: 'Great nostalgic 80s vibes with compelling characters.',
    genre: 'Sci-Fi/Horror',
    medium: 'Netflix',
    entertainmentCategory: 'tv shows',
    status: 'Watched',
    recommendationBadge: 'Highly Recommend' as RecommendationBadge,
  } as EntertainmentCard,
];

// Get all cards from localStorage or use mock data if none exists
export const getAllCards = (): CatalogCard[] => {
  const storedCards = localStorage.getItem('catalogCards');
  if (storedCards) {
    return JSON.parse(storedCards);
  } else {
    localStorage.setItem('catalogCards', JSON.stringify(mockCards));
    return mockCards;
  }
};

// Get cards by type
export const getCardsByType = (type: 'food' | 'entertainment'): CatalogCard[] => {
  const cards = getAllCards();
  return cards.filter(card => card.type === type);
};

// Get a card by ID
export const getCardById = (id: string): CatalogCard | undefined => {
  const cards = getAllCards();
  return cards.find(card => card.id === id);
};

// Add a new card
export const addCard = (card: Omit<CatalogCard, 'id'>): CatalogCard => {
  const cards = getAllCards();
  const newCard = {
    ...card,
    id: Date.now().toString(),
  };
  
  const updatedCards = [...cards, newCard];
  localStorage.setItem('catalogCards', JSON.stringify(updatedCards));
  
  return newCard;
};

// Update a card
export const updateCard = (card: CatalogCard): void => {
  const cards = getAllCards();
  const updatedCards = cards.map(c => c.id === card.id ? card : c);
  localStorage.setItem('catalogCards', JSON.stringify(updatedCards));
};

// Delete a card
export const deleteCard = (id: string): void => {
  const cards = getAllCards();
  const updatedCards = cards.filter(card => card.id !== id);
  localStorage.setItem('catalogCards', JSON.stringify(updatedCards));
};

// Add a recommendation to a card
export const addRecommendation = (cardId: string, userId: string, badge: string | null = null): void => {
  const cards = getAllCards();
  const cardIndex = cards.findIndex(c => c.id === cardId);
  
  if (cardIndex !== -1) {
    const card = cards[cardIndex];
    // Store user IDs instead of names
    const recommendedToList = card.recommendedTo || [];
    
    // Only add if it doesn't already exist
    if (!recommendedToList.includes(userId)) {
      // Convert the badge string to the proper RecommendationBadge type
      let typedBadge: RecommendationBadge = null;
      if (badge === "Highly Recommend") {
        typedBadge = "Highly Recommend";
      } else if (badge === "Favorite") {
        typedBadge = "Favorite";
      } else if (badge === "none") {
        typedBadge = null;
      }
      
      cards[cardIndex] = {
        ...card,
        recommendedTo: [...recommendedToList, userId],
        recommendationBadge: typedBadge
      };
      
      localStorage.setItem('catalogCards', JSON.stringify(cards));
    }
  }
};

// New function to get users who received a recommendation
export const getRecommendedUsers = (cardId: string): string[] => {
  const card = getCardById(cardId);
  return card?.recommendedTo || [];
};

// New function to check if a user already received a recommendation
export const isRecommendedToUser = (cardId: string, userId: string): boolean => {
  const recommendedUsers = getRecommendedUsers(cardId);
  return recommendedUsers.includes(userId);
};

// Add a new function to share card
export const shareCard = async (card: CatalogCard): Promise<void> => {
  // Create a share text based on the card type and properties
  const title = card.title;
  const creator = card.creator;
  const rating = "★".repeat(card.rating) + "☆".repeat(5 - card.rating);
  
  let shareText = `Check out ${title} by ${creator} (${rating})!`;
  
  if (card.type === 'food') {
    const foodCard = card as FoodCard;
    shareText += ` ${foodCard.cuisine} cuisine at ${foodCard.location}.`;
  } else {
    const entertainmentCard = card as EntertainmentCard;
    shareText += ` ${entertainmentCard.genre} ${entertainmentCard.entertainmentCategory} on ${entertainmentCard.medium}.`;
  }
  
  if (card.notes) {
    shareText += `\n\nNotes: ${card.notes}`;
  }
  
  if (card.recommendationBadge) {
    shareText += `\n\n${card.recommendationBadge}!`;
  }
  
  // Try Web Share API first (modern browsers and mobile)
  if (navigator.share) {
    try {
      await navigator.share({
        title: `${title} by ${creator}`,
        text: shareText,
        // In a real app, this would be a public URL to the card
        url: window.location.origin + `/view/${card.id}`,
      });
      return;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        // If it's not just the user canceling, try fallback
        console.error('Web Share API error:', error);
      } else {
        // User cancelled the share, no need for fallback
        return;
      }
    }
  }

  // Fallback for browsers without Web Share API
  try {
    await navigator.clipboard.writeText(shareText);
    return;
  } catch (error) {
    console.error('Clipboard API error:', error);
    throw new Error('Unable to share - your browser does not support sharing');
  }
};
