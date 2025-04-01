
import { CatalogCard, FoodCard, EntertainmentCard } from './types';

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
    status: 'Highly Recommend',
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
    status: 'Favorite',
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
    status: 'Highly Recommend',
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
export const addRecommendation = (cardId: string, recommendedTo: string): void => {
  const cards = getAllCards();
  const cardIndex = cards.findIndex(c => c.id === cardId);
  
  if (cardIndex !== -1) {
    const card = cards[cardIndex];
    const recommendedToList = card.recommendedTo || [];
    
    // Only add if it doesn't already exist
    if (!recommendedToList.includes(recommendedTo)) {
      cards[cardIndex] = {
        ...card,
        recommendedTo: [...recommendedToList, recommendedTo]
      };
      
      localStorage.setItem('catalogCards', JSON.stringify(cards));
    }
  }
};
