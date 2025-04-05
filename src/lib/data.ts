import { CatalogCard, FoodCard, EntertainmentCard, FoodStatus, RecommendationBadge, UserNote, AgreementStatus } from './types';
import { appUsers } from '@/contexts/UserContext';
import { showRewardToast, forceRewardsRefresh } from '@/utils/rewardUtils';

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
    isFavorite: false,
    recommendedTo: ['user2', 'user3'],
    recommendedBy: 'Alex',
    userNotes: [
      {
        userId: 'user2',
        userName: 'Sarah',
        notes: 'I agree this pasta is amazing! I would add that the truffle oil they use is exceptional.',
        date: '2023-06-10',
        userRating: 5,
        agreementStatus: 'Agree',
        tags: ['truffle', 'authentic']
      },
      {
        userId: 'user3',
        userName: 'Mike',
        notes: 'The pasta was good but I found it a bit too salty for my taste.',
        date: '2023-06-15',
        userRating: 3,
        agreementStatus: 'Neutral',
        tags: ['salty'],
        url: 'foodblog.com/italian-bistro'
      }
    ]
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
    isFavorite: true,
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
    category: 'food truck',
    status: 'Visited: Tried this bite' as FoodStatus,
    visitCount: 3,
    tags: ['tacos', 'spicy', 'mexican'],
    isFavorite: false,
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
    isFavorite: false,
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
  
  // Get the current user from local storage directly
  const currentUserStr = localStorage.getItem('currentUser');
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
  
  // Track this card addition for rewards - ONLY on explicit save
  if (card.type && currentUser?.id) {
    console.log(`User ${currentUser.id} added a ${card.type} card - tracked for rewards`);
    
    // Store timestamp to prevent duplicate rewards
    const trackingKey = `last_${card.type}_added_${currentUser.id}`;
    localStorage.setItem(trackingKey, Date.now().toString());
    
    // Dispatch a single event to notify other components
    const event = new CustomEvent('catalog_action', { 
      detail: { 
        action: 'card_added', 
        cardType: card.type, 
        cardId: newCard.id,
        timestamp: Date.now() 
      } 
    });
    window.dispatchEvent(event);
    console.log(`Dispatched card_added event for ${card.type} with ID ${newCard.id}`);
  }
  
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

// Function to get user reward points
export const getUserRewards = (userId: string): number => {
  if (!userId) return 0;
  
  try {
    const rewardsData = localStorage.getItem('catalogUserRewards');
    if (rewardsData) {
      const rewards = JSON.parse(rewardsData);
      // Make sure we return at least 1 if the user exists
      if (rewards[userId] === undefined) {
        rewards[userId] = 1;  // Initialize with 1 point if missing
        localStorage.setItem('catalogUserRewards', JSON.stringify(rewards));
        return 1;
      }
      return rewards[userId] || 0;
    } else {
      // Initialize rewards data if completely missing
      const initialRewards = { [userId]: 1 };
      localStorage.setItem('catalogUserRewards', JSON.stringify(initialRewards));
      return 1;
    }
  } catch (error) {
    console.error("Error getting user rewards:", error);
  }
  return 1; // Return 1 as a default minimum
};

// Function to add reward points to a user - IMPROVED
export const addUserRewardPoints = (userId: string, points: number = 1, reason: string = 'Activity'): number => {
  console.log(`REWARD TRACKING: Adding ${points} points to user ${userId} for ${reason}`);
  
  if (!userId) {
    console.error("Cannot add points: userId is empty");
    return 0;
  }
  
  try {
    const rewardsData = localStorage.getItem('catalogUserRewards');
    let rewards = rewardsData ? JSON.parse(rewardsData) : {};
    
    // Initialize user rewards if not present
    if (rewards[userId] === undefined) {
      rewards[userId] = 0;
    }
    
    // Add points
    rewards[userId] += points;
    
    // Create a unique timestamp
    const timestamp = Date.now().toString();
    
    // Save back to localStorage
    localStorage.setItem('catalogUserRewards', JSON.stringify(rewards));
    localStorage.setItem('lastRewardUpdate', timestamp);
    localStorage.setItem(`user_${userId}_last_reward`, timestamp);
    
    console.log(`REWARD TRACKING: User ${userId} now has ${rewards[userId]} points`);
    
    // Show toast notification for reward
    if (typeof showRewardToast === 'function') {
      showRewardToast(userId, points, reason);
    }
    
    // Trigger a single refresh event
    forceRewardsRefresh();
    
    return rewards[userId];
  } catch (error) {
    console.error("Error adding user reward points:", error);
    return 0;
  }
};

// Track cards added by users for rewards
export const trackUserCardAdditions = (userId: string, cardType: 'food' | 'entertainment'): void => {
  console.log(`REWARD TRACKING: User ${userId} added a ${cardType} card`);
  
  if (!userId) {
    console.error("Cannot track card addition: userId is empty");
    return;
  }
  
  try {
    // Log the action to localStorage for tracking
    const actionKey = `catalog_${userId}_last_${cardType}`;
    const now = Date.now();
    localStorage.setItem(actionKey, now.toString());
    
    // Update the timestamp to force refreshes
    localStorage.setItem('lastRewardUpdate', now.toString());
    
    // Directly dispatch a custom event for this action
    const event = new CustomEvent('user_activity', {
      detail: { 
        action: 'add_card', 
        userId, 
        cardType,
        timestamp: now
      }
    });
    window.dispatchEvent(event);
    
    // Award points with a clear reason message
    const reason = `Adding a new ${cardType === 'food' ? 'bite' : 'blockbuster'}`;
    addUserRewardPoints(userId, 10, reason);
  } catch (error) {
    console.error("Error tracking user card addition:", error);
  }
};

// Get current user from localStorage or context
const getCurrentUser = () => {
  const storedUser = localStorage.getItem('currentUser');
  return storedUser ? JSON.parse(storedUser) : null;
};

// Reference to the current user for use in functions
const currentUser = getCurrentUser();

// Function to get all user rewards for leaderboard
export const getAllUserRewards = (): Record<string, number> => {
  const rewardsData = localStorage.getItem('catalogUserRewards');
  return rewardsData ? JSON.parse(rewardsData) : {};
};

// Function to get user reward tier based on number of points
export const getUserRewardTier = (points: number): string => {
  if (points <= 50) return "Needs Improvement";
  if (points <= 100) return "Fair";
  if (points <= 150) return "Satisfactory";
  if (points <= 200) return "Good";
  return "Excellent";
};

// Updated function to add recommendation and track rewards
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
      
      // Get the current user from local storage directly
      const currentUserStr = localStorage.getItem('currentUser');
      const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
      
      // Add reward point for the recommender (current user)
      if (currentUser?.id) {
        const reason = `Recommending "${card.title}" to a friend`;
        // Using higher points for referrals (15) to make it more noticeable
        addUserRewardPoints(currentUser.id, 15, reason);
      }
      
      // Add reward point for the receiver
      const receiverReason = `Receiving a recommendation for "${card.title}"`;
      addUserRewardPoints(userId, 15, receiverReason);
      
      // Dispatch event
      try {
        const event = new CustomEvent('catalog_action', {
          detail: { action: 'recommendation_added', cardId, userId }
        });
        window.dispatchEvent(event);
      } catch (e) {
        console.error("Error dispatching recommendation event:", e);
      }
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

// Updated function to add user notes and preferences to a card
export const addUserNotesToCard = (
  cardId: string, 
  userId: string, 
  data: {
    notes?: string,
    userRating?: number,
    agreementStatus?: AgreementStatus,
    tags?: string[],
    url?: string,
    addNotesToOriginal?: boolean
  }
): boolean => {
  // Check users' sharing settings from local storage
  const sharingSettingsJson = localStorage.getItem('catalogSharingSettings');
  let autoReceiveNotes = true; // Default to true if settings not found
  
  if (sharingSettingsJson) {
    const sharingSettings = JSON.parse(sharingSettingsJson);
    autoReceiveNotes = sharingSettings.autoReceiveNotes;
  }
  
  // If manual note updates aren't allowed and auto-receive is disabled, return false
  if (!data.addNotesToOriginal && !autoReceiveNotes) return false;
  
  const cards = getAllCards();
  const cardIndex = cards.findIndex(c => c.id === cardId);
  
  if (cardIndex !== -1) {
    const card = cards[cardIndex];
    
    // Only allow updates if the card has been shared with this user
    if (card.recommendedTo && card.recommendedTo.includes(userId)) {
      // Get existing user notes or create new array
      const userNotes = card.userNotes || [];
      
      // Check if this user already has a note
      const existingNoteIndex = userNotes.findIndex(note => note.userId === userId);
      const userName = appUsers.find(user => user.id === userId)?.name || 'User';
      
      // Create a new note or update existing
      const noteContent = data.notes ? data.notes.trim() : '';
      const newUserNote: UserNote = {
        userId,
        userName,
        notes: noteContent,
        date: new Date().toISOString(),
        userRating: data.userRating,
        agreementStatus: data.agreementStatus,
        tags: data.tags,
        url: data.url
      };
      
      // If user already had a note, update it; otherwise add new note
      if (existingNoteIndex >= 0) {
        userNotes[existingNoteIndex] = {
          ...userNotes[existingNoteIndex],
          ...newUserNote,
          // Keep original date but add updated timestamp
          date: userNotes[existingNoteIndex].date,
          updatedDate: new Date().toISOString()
        };
      } else {
        userNotes.push(newUserNote);
      }
      
      // Update the card with new user notes
      cards[cardIndex] = {
        ...card,
        userNotes
      };
      
      // If addNotesToOriginal is true, also add the notes to the original card notes
      if (data.addNotesToOriginal || autoReceiveNotes) {
        if (noteContent) {
          const existingNotes = card.notes || '';
          const updatedNotes = existingNotes 
            ? `${existingNotes}\n\n--- Notes from ${userName} ---\n${noteContent}`
            : `Notes from ${userName}:\n${noteContent}`;
            
          cards[cardIndex].notes = updatedNotes;
        }
        
        // Merge tags if provided
        if (data.tags && data.tags.length > 0) {
          const existingTags = card.tags || [];
          const uniqueTags = [...new Set([...existingTags, ...data.tags])];
          cards[cardIndex].tags = uniqueTags;
        }
        
        // Add URL if provided
        if (data.url) {
          cards[cardIndex].url = data.url;
        }
      }
      
      localStorage.setItem('catalogCards', JSON.stringify(cards));
      return true;
    }
  }
  
  return false;
};

// Function to get recommended users with their notes
export const getRecommendedUsersWithNotes = (cardId: string): Array<{userId: string, userName: string, hasNotes: boolean}> => {
  const card = getCardById(cardId);
  if (!card || !card.recommendedTo) return [];
  
  return card.recommendedTo.map(userId => {
    const user = appUsers.find(u => u.id === userId);
    const userNote = card.userNotes?.find(note => note.userId === userId);
    
    return {
      userId,
      userName: user?.name || 'Unknown User',
      hasNotes: !!userNote
    };
  });
};

// Add a new function to share card
export const shareCard = async (card: CatalogCard, mode: 'internal' | 'external' = 'internal'): Promise<void> => {
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
  
  // Add notes only for internal sharing
  if (mode === 'internal' && card.notes) {
    shareText += `\n\nNotes: ${card.notes}`;
  }
  
  if (card.recommendationBadge) {
    shareText += `\n\n${card.recommendationBadge}!`;
  }
  
  // For external sharing, add a prompt to download the app
  if (mode === 'external') {
    shareText += '\n\nDownload our app to see full details and more recommendations!';
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
