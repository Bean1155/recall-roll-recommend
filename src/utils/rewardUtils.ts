import { toast } from "sonner";
import { getUserRewards } from "@/lib/data";

/**
 * Shows a toast notification when a user earns points
 * @param userId The ID of the user who earned points
 * @param pointsAdded Number of points just added
 * @param reason The reason points were awarded
 */
export const showRewardToast = (
  userId: string,
  pointsAdded: number,
  reason: string
): void => {
  if (pointsAdded <= 0 || !userId) return;
  
  // Get the updated total points
  const totalPoints = getUserRewards(userId);
  
  console.log("REWARD TOAST: User earned", pointsAdded, "points for", reason);
  console.log("REWARD TOAST: Total points now", totalPoints);
  
  // Simple timestamp to prevent caching
  const timestamp = Date.now().toString();
  localStorage.setItem('lastRewardUpdate', timestamp);
  localStorage.setItem(`user_${userId}_last_reward`, timestamp);
  
  // CRITICAL FIX: Ensure rewards data exists in localStorage with improved reliability
  try {
    const rewardsData = localStorage.getItem('catalogUserRewards');
    if (rewardsData) {
      const rewards = JSON.parse(rewardsData);
      if (typeof rewards[userId] === 'undefined') {
        rewards[userId] = pointsAdded;
        localStorage.setItem('catalogUserRewards', JSON.stringify(rewards));
        console.log(`REWARD SYSTEM: Initialized user ${userId} with ${pointsAdded} points`);
      } else {
        // Add the points to existing total
        rewards[userId] += pointsAdded;
        localStorage.setItem('catalogUserRewards', JSON.stringify(rewards));
        console.log(`REWARD SYSTEM: Updated user ${userId} to ${rewards[userId]} points`);
      }
    } else {
      // Initialize rewards data if it doesn't exist
      const initialRewards = { [userId]: pointsAdded };
      localStorage.setItem('catalogUserRewards', JSON.stringify(initialRewards));
      console.log(`REWARD SYSTEM: Created new rewards data for user ${userId} with ${pointsAdded} points`);
    }
  } catch (e) {
    console.error("Error ensuring user rewards exist:", e);
  }
  
  // Use a visible toast with reasonable duration
  toast.success(`You earned ${pointsAdded} point${pointsAdded > 1 ? 's' : ''}! ${reason}. You now have ${totalPoints} total points.`, {
    duration: 5000, // Show for 5 seconds
  });
  
  // Dispatch multiple events for real-time updates with different delays
  try {
    // Immediate event
    const realTimeEvent = new CustomEvent('realtime_rewards_update', {
      detail: { 
        userId,
        points: totalPoints,
        added: pointsAdded,
        reason,
        timestamp
      }
    });
    window.dispatchEvent(realTimeEvent);
    console.log("Dispatched realtime_rewards_update event");
    
    // Followed by additional events with delays to ensure UI updates
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('refreshRewards', { 
        detail: { userId, points: totalPoints, timestamp: Date.now().toString() } 
      }));
      console.log("Dispatched delayed refreshRewards event");
    }, 200);
    
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('card_reward_update', { 
        detail: { userId, points: totalPoints, timestamp: Date.now().toString() } 
      }));
      console.log("Dispatched delayed card_reward_update event");
    }, 500);
  } catch (e) {
    console.error("Error dispatching realtime event:", e);
  }
};

/**
 * Force the rewards counter to refresh
 */
export const forceRewardsRefresh = (): void => {
  console.log("Force refresh rewards event triggered");
  
  // Simple timestamp to force refresh
  const timestamp = Date.now().toString();
  localStorage.setItem('lastRewardUpdate', timestamp);
  
  // Get current user and update user-specific timestamp
  try {
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      if (currentUser?.id) {
        localStorage.setItem(`user_${currentUser.id}_last_reward`, timestamp);
        
        // Also make sure the user has rewards initialized
        ensureUserHasRewards(currentUser.id);
      }
    }
  } catch (e) {
    console.error("Error updating user-specific timestamp:", e);
  }
  
  // Dispatch multiple events with different timeouts to ensure updates
  try {
    // Primary refresh event
    const event = new CustomEvent('refreshRewards', { 
      detail: { timestamp: timestamp } 
    });
    window.dispatchEvent(event);
    
    // Secondary events for redundancy
    window.dispatchEvent(new CustomEvent('card_reward_update', { 
      detail: { timestamp: timestamp } 
    }));
    
    window.dispatchEvent(new CustomEvent('realtime_rewards_update', {
      detail: { timestamp: timestamp }
    }));
    
    // Additional delayed events to handle race conditions
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('refreshRewards', { 
        detail: { timestamp: Date.now().toString() } 
      }));
    }, 200);
    
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('realtime_rewards_update', {
        detail: { timestamp: Date.now().toString() }
      }));
    }, 500);
  } catch (error) {
    console.error("Error dispatching reward events:", error);
  }
};

// Function to directly set reward points to ensure they're properly initialized
export const ensureUserHasRewards = (userId: string): void => {
  if (!userId) return;
  
  try {
    const rewardsData = localStorage.getItem('catalogUserRewards');
    let rewards = rewardsData ? JSON.parse(rewardsData) : {};
    
    // If user doesn't have rewards, initialize with 0
    if (typeof rewards[userId] === 'undefined') {
      rewards[userId] = 0;
      localStorage.setItem('catalogUserRewards', JSON.stringify(rewards));
      console.log(`Initialized rewards for user ${userId}`);
    }
  } catch (e) {
    console.error("Error ensuring user rewards exist:", e);
  }
}

// Direct function to add points for card creation - SUPER CRITICAL FIX
export const addPointsForCardCreation = (userId: string, cardType: string): void => {
  if (!userId) {
    console.error("Cannot add points: userId is empty");
    return;
  }
  
  console.log(`REWARD SYSTEM: Adding points for ${cardType} card creation to user ${userId}`);
  
  // Remove tracking to make this more reliable - always add points when called
  const now = Date.now();
  
  try {
    // Directly manipulate localStorage for maximum reliability
    const rewardsData = localStorage.getItem('catalogUserRewards');
    let rewards = rewardsData ? JSON.parse(rewardsData) : {};
    
    // Initialize or update user rewards
    if (typeof rewards[userId] === 'undefined') {
      rewards[userId] = 1;
      console.log(`REWARD SYSTEM: Initialized user ${userId} with 1 point`);
    } else {
      // Add exactly 1 point per card creation
      rewards[userId] += 1;
      console.log(`REWARD SYSTEM: Added 1 point to user ${userId}. Now has ${rewards[userId]} points`);
    }
    
    // Save back to localStorage with timestamp tracking
    localStorage.setItem('catalogUserRewards', JSON.stringify(rewards));
    localStorage.setItem('lastRewardUpdate', now.toString());
    localStorage.setItem(`user_${userId}_last_reward`, now.toString());
    
    console.log(`Added 1 point to user ${userId} for creating a ${cardType} card. Total: ${rewards[userId]}`);
    
    // Show toast notification - this will also trigger events
    showRewardToast(userId, 1, `Creating a new ${cardType === 'food' ? 'bite' : 'blockbuster'}`);
    
    // Multiple refreshes with different timing for reliability
    forceRewardsRefresh();
    setTimeout(() => forceRewardsRefresh(), 300);
    setTimeout(() => forceRewardsRefresh(), 1200);
    
    // Dispatch a direct event
    try {
      const event = new CustomEvent('card_reward_update', {
        detail: { 
          userId, 
          action: 'card_added', 
          cardType,
          timestamp: now
        }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error("Error dispatching event:", error);
    }
  } catch (e) {
    console.error("Error adding points for card creation:", e);
    
    // Fallback method - try to add points via toast directly if the above fails
    showRewardToast(userId, 1, `Creating a new ${cardType === 'food' ? 'bite' : 'blockbuster'}`);
  }
}

// New function to add points for sharing a card
export const addPointsForSharing = (userId: string, recipientId: string = null): void => {
  if (!userId) return;
  
  // Track this share to prevent duplicates
  const trackingKey = recipientId 
    ? `last_share_to_${recipientId}_by_${userId}` 
    : `last_external_share_by_${userId}`;
  const lastShared = localStorage.getItem(trackingKey);
  const now = Date.now();
  
  if (lastShared) {
    const timeSinceLastShare = now - Number(lastShared);
    // Only allow one point per recipient per 5 minutes
    if (timeSinceLastShare < 300000) { // 5 minutes
      console.log(`Skipping duplicate share points for ${userId} - already shared recently`);
      return;
    }
  }
  
  try {
    // Get rewards data
    const rewardsData = localStorage.getItem('catalogUserRewards');
    let rewards = rewardsData ? JSON.parse(rewardsData) : {};
    
    // Add points to sharing user
    if (typeof rewards[userId] === 'undefined') {
      rewards[userId] = 1;
    } else {
      rewards[userId] += 1;
    }
    
    // Save tracking timestamp
    localStorage.setItem(trackingKey, now.toString());
    
    // Add points to recipient if internal share
    if (recipientId) {
      if (typeof rewards[recipientId] === 'undefined') {
        rewards[recipientId] = 1;
      } else {
        rewards[recipientId] += 1;
      }
      
      // Show toast for recipient points (which they'll see next time they log in)
      showRewardToast(recipientId, 1, 'Receiving a shared card');
    }
    
    // Save rewards data
    localStorage.setItem('catalogUserRewards', JSON.stringify(rewards));
    
    // Show toast for sharer
    const reason = recipientId 
      ? 'Sharing a card with a friend' 
      : 'Sharing a card externally';
    showRewardToast(userId, 1, reason);
    
    // Force refresh with multiple attempts to ensure UI updates
    forceRewardsRefresh();
    setTimeout(() => forceRewardsRefresh(), 200);
    setTimeout(() => forceRewardsRefresh(), 1000);
    
    console.log(`Added 1 point to user ${userId} for sharing. Total: ${rewards[userId]}`);
  } catch (e) {
    console.error("Error adding points for sharing:", e);
  }
}
