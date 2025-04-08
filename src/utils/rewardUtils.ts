
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
  
  // Ensure rewards data exists in localStorage (critical fix)
  try {
    const rewardsData = localStorage.getItem('catalogUserRewards');
    if (rewardsData) {
      const rewards = JSON.parse(rewardsData);
      if (typeof rewards[userId] === 'undefined') {
        rewards[userId] = pointsAdded;
        localStorage.setItem('catalogUserRewards', JSON.stringify(rewards));
      } else {
        // Add the points to existing total
        rewards[userId] += pointsAdded;
        localStorage.setItem('catalogUserRewards', JSON.stringify(rewards));
      }
    } else {
      // Initialize rewards data if it doesn't exist
      const initialRewards = { [userId]: pointsAdded };
      localStorage.setItem('catalogUserRewards', JSON.stringify(initialRewards));
    }
  } catch (e) {
    console.error("Error ensuring user rewards exist:", e);
  }
  
  // Use a visible toast with reasonable duration
  toast.success(`You earned ${pointsAdded} point${pointsAdded > 1 ? 's' : ''}! ${reason}. You now have ${totalPoints} total points.`, {
    duration: 5000, // Show for 5 seconds
  });
  
  // Dispatch one event for real-time updates
  try {
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
      }
    }
  } catch (e) {
    console.error("Error updating user-specific timestamp:", e);
  }
  
  // Dispatch events just once
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

// Direct function to add points for card creation
export const addPointsForCardCreation = (userId: string, cardType: string): void => {
  if (!userId) return;
  
  // Check if we've already added points for this exact card creation action
  const trackingKey = `last_${cardType}_added_${userId}`;
  const lastAdded = localStorage.getItem(trackingKey);
  const now = Date.now();
  
  if (lastAdded) {
    const timeSinceLastAdd = now - Number(lastAdded);
    // If we've added points in the last 5 seconds, don't add more
    if (timeSinceLastAdd < 5000) {
      console.log(`Skipping duplicate points for ${userId} - already added recently`);
      return;
    }
  }
  
  try {
    const rewardsData = localStorage.getItem('catalogUserRewards');
    let rewards = rewardsData ? JSON.parse(rewardsData) : {};
    
    // Initialize or update user rewards
    if (typeof rewards[userId] === 'undefined') {
      rewards[userId] = 1;
    } else {
      // Add exactly 1 point per card creation
      rewards[userId] += 1;
    }
    
    // Save back to localStorage
    localStorage.setItem('catalogUserRewards', JSON.stringify(rewards));
    localStorage.setItem(trackingKey, now.toString());
    
    console.log(`Added 1 point to user ${userId} for creating a ${cardType} card. Total: ${rewards[userId]}`);
    
    // Show toast notification
    showRewardToast(userId, 1, `Creating a new ${cardType === 'food' ? 'bite' : 'blockbuster'}`);
    
    // Trigger a refresh
    forceRewardsRefresh();
  } catch (e) {
    console.error("Error adding points for card creation:", e);
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
    
    // Force refresh to update UI
    forceRewardsRefresh();
    
    console.log(`Added 1 point to user ${userId} for sharing. Total: ${rewards[userId]}`);
  } catch (e) {
    console.error("Error adding points for sharing:", e);
  }
}
