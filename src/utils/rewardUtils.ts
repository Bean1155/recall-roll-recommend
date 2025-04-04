
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
  
  // Use a timestamp with a random suffix to prevent caching
  const timestamp = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  localStorage.setItem('lastRewardUpdate', timestamp);
  
  // CRITICAL: Also directly update a user-specific timestamp to force refresh
  localStorage.setItem(`user_${userId}_last_reward`, timestamp);
  
  // Directly update the rewards in localStorage as a backup mechanism
  try {
    const rewardsData = localStorage.getItem('catalogUserRewards');
    if (rewardsData) {
      const rewards = JSON.parse(rewardsData);
      console.log("Direct rewards data check:", rewards);
      // Ensure this user's rewards are set correctly
      if (rewards[userId] !== totalPoints) {
        console.log(`Correcting rewards discrepancy: localStorage has ${rewards[userId]}, should be ${totalPoints}`);
        rewards[userId] = totalPoints;
        localStorage.setItem('catalogUserRewards', JSON.stringify(rewards));
      }
    }
  } catch (e) {
    console.error("Error directly updating rewards:", e);
  }
  
  // Use a more visible toast with longer duration and higher z-index
  toast({
    title: `🎉 You earned ${pointsAdded} point${pointsAdded > 1 ? 's' : ''}!`,
    description: `${reason}. You now have ${totalPoints} total points.`,
    className: "bg-catalog-cream border-catalog-teal text-catalog-darkBrown font-medium border-4 z-[2000] shadow-lg",
    duration: 10000, // Show for 10 seconds
    variant: "default",
  });
  
  // Force the rewards counter to refresh immediately - only once, not repeatedly
  forceRewardsRefresh();
  
  // Also update any DOM elements directly if possible
  try {
    document.querySelectorAll('[data-rewards-display]').forEach(element => {
      element.setAttribute('data-rewards-points', totalPoints.toString());
      element.setAttribute('data-update', timestamp);
      console.log("Updated DOM element directly with new points:", totalPoints);
    });
  } catch (e) {
    console.error("Error updating DOM elements:", e);
  }
  
  // Dispatch a single custom event for real-time updates
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
  
  // Update localStorage with a unique timestamp to force refresh
  const newTimestamp = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  localStorage.setItem('lastRewardUpdate', newTimestamp);
  console.log(`Set lastRewardUpdate to ${newTimestamp}`);
  
  // CRITICAL: Get current user ID and update user-specific timestamp 
  try {
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      if (currentUser?.id) {
        localStorage.setItem(`user_${currentUser.id}_last_reward`, newTimestamp);
        console.log(`Updated user-specific timestamp for user ${currentUser.id}`);
        
        // Ensure rewards are correctly set in localStorage
        const rewardsData = localStorage.getItem('catalogUserRewards');
        if (rewardsData) {
          const rewards = JSON.parse(rewardsData);
          const currentPoints = rewards[currentUser.id] || 0;
          console.log(`Current points for user ${currentUser.id}: ${currentPoints}`);
          
          // Ensure user has an entry in rewards data
          if (typeof rewards[currentUser.id] === 'undefined') {
            console.log(`Creating rewards entry for user ${currentUser.id}`);
            rewards[currentUser.id] = 0;
            localStorage.setItem('catalogUserRewards', JSON.stringify(rewards));
          }
          
          // Update any DOM elements with this information
          document.querySelectorAll('[data-rewards-display]').forEach(element => {
            element.setAttribute('data-rewards-points', String(currentPoints));
            element.setAttribute('data-update', newTimestamp);
          });
        } else {
          // If no rewards data exists yet, initialize it
          console.log("No rewards data found, initializing");
          const initialRewards = { [currentUser.id]: 0 };
          localStorage.setItem('catalogUserRewards', JSON.stringify(initialRewards));
        }
      }
    }
  } catch (e) {
    console.error("Error updating user-specific timestamp:", e);
  }
  
  // Dispatch events once, not repeatedly
  try {
    const event = new CustomEvent('refreshRewards', { 
      detail: { timestamp: newTimestamp, forced: true } 
    });
    window.dispatchEvent(event);
    console.log(`Dispatched refreshRewards event with timestamp: ${newTimestamp}`);
    
    // Also directly trigger DOM update
    document.querySelectorAll('[data-rewards-display]').forEach(element => {
      element.setAttribute('data-update', newTimestamp);
    });
  } catch (error) {
    console.error("Error dispatching reward refresh event:", error);
  }
  
  // Dispatch card reward update event once
  try {
    const cardAddedEvent = new CustomEvent('card_reward_update', { 
      detail: { timestamp: newTimestamp, forced: true } 
    });
    window.dispatchEvent(cardAddedEvent);
    console.log("Dispatched special card_reward_update event");
  } catch (error) {
    console.error("Error dispatching card reward update event:", error);
  }
  
  // Add event for real-time updates 
  try {
    const realTimeEvent = new CustomEvent('realtime_rewards_update', {
      detail: { timestamp: newTimestamp, forced: true }
    });
    window.dispatchEvent(realTimeEvent);
    console.log("Dispatched realtime_rewards_update event");
  } catch (error) {
    console.error("Error dispatching realtime event:", error);
  }
  
  // Ensure any reward displays are updated by manually checking localStorage
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser?.id) {
      const rewardsData = localStorage.getItem('catalogUserRewards');
      if (rewardsData) {
        const rewards = JSON.parse(rewardsData);
        const points = rewards[currentUser.id] || 0;
        
        document.querySelectorAll('[data-rewards-display]').forEach(element => {
          element.setAttribute('data-rewards-points', String(points));
          element.setAttribute('data-update', newTimestamp);
          console.log(`Directly updated DOM with ${points} points for user ${currentUser.id}`);
        });
      }
    }
  } catch (e) {
    console.error("Error directly updating reward displays:", e);
  }
};
