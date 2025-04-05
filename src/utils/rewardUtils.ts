
import { toast } from "@/hooks/use-toast";
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
  
  // Ensure rewards data exists for this user
  try {
    const rewardsData = localStorage.getItem('catalogUserRewards');
    if (rewardsData) {
      const rewards = JSON.parse(rewardsData);
      if (!rewards[userId]) {
        rewards[userId] = pointsAdded;
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
  toast({
    title: `🎉 You earned ${pointsAdded} point${pointsAdded > 1 ? 's' : ''}!`,
    description: `${reason}. You now have ${totalPoints} total points.`,
    className: "bg-catalog-cream border-catalog-teal text-catalog-darkBrown font-medium border-4 z-[2000] shadow-lg",
    duration: 5000, // Show for 5 seconds
    variant: "default",
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
 * Force the rewards counter to refresh - SIMPLIFIED
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
        
        // CRITICAL FIX: Directly increment the user's points in localStorage
        const rewardsData = localStorage.getItem('catalogUserRewards');
        let rewards = {};
        
        if (rewardsData) {
          rewards = JSON.parse(rewardsData);
          // If the user doesn't have any rewards yet, initialize with 1
          if (typeof rewards[currentUser.id] === 'undefined') {
            rewards[currentUser.id] = 1; 
          }
        } else {
          // Initialize rewards data if it doesn't exist
          rewards = { [currentUser.id]: 1 };
        }
        
        localStorage.setItem('catalogUserRewards', JSON.stringify(rewards));
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
    
    // If user doesn't have rewards, initialize with 1
    if (typeof rewards[userId] === 'undefined') {
      rewards[userId] = 1;
      localStorage.setItem('catalogUserRewards', JSON.stringify(rewards));
      console.log(`Initialized rewards for user ${userId} with 1 point`);
    }
  } catch (e) {
    console.error("Error ensuring user rewards exist:", e);
  }
}

// Direct function to add points for card creation - modified to only add points after form submission
export const addPointsForCardCreation = (userId: string, cardType: string): void => {
  if (!userId) return;
  
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
    console.log(`Added 1 point to user ${userId} for creating a ${cardType} card. Total: ${rewards[userId]}`);
    
    // Show toast notification
    showRewardToast(userId, 1, `Creating a new ${cardType === 'food' ? 'bite' : 'blockbuster'}`);
    
    // Trigger a refresh
    forceRewardsRefresh();
  } catch (e) {
    console.error("Error adding points for card creation:", e);
  }
}

// Add points for using search feature - but don't automatically trigger form submission
export const addPointsForSearch = (userId: string, type: string): void => {
  if (!userId) return;
  
  try {
    const rewardsData = localStorage.getItem('catalogUserRewards');
    let rewards = rewardsData ? JSON.parse(rewardsData) : {};
    
    // Initialize or update user rewards
    if (typeof rewards[userId] === 'undefined') {
      rewards[userId] = 1;
    } else {
      rewards[userId] += 1;
    }
    
    // Save back to localStorage
    localStorage.setItem('catalogUserRewards', JSON.stringify(rewards));
    
    // Show toast notification
    showRewardToast(userId, 1, `Using search for ${type === 'food' ? 'bite' : 'blockbuster'} information`);
    
    // Trigger a refresh
    forceRewardsRefresh();
  } catch (e) {
    console.error("Error adding points for search:", e);
  }
}
