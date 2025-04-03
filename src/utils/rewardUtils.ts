
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
  
  // Use a more visible toast with longer duration and higher z-index
  toast({
    title: `🎉 You earned ${pointsAdded} point${pointsAdded > 1 ? 's' : ''}!`,
    description: `${reason}. You now have ${totalPoints} total points.`,
    className: "bg-catalog-cream border-catalog-teal text-catalog-darkBrown font-medium border-4 z-[2000] shadow-lg",
    duration: 10000, // Show for 10 seconds
    variant: "default",
  });
  
  // Force the rewards counter to refresh immediately and repeatedly
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      forceRewardsRefresh();
      console.log(`Toast notification triggered: +${pointsAdded} points (${reason}) - refresh attempt ${i+1}`);
    }, i * 150);
  }
  
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
  
  // Dispatch the event multiple times with various delays to ensure it's caught
  const delays = [0, 50, 100, 200, 300, 500, 1000, 2000];
  
  delays.forEach(delay => {
    setTimeout(() => {
      try {
        const event = new CustomEvent('refreshRewards', { 
          detail: { timestamp: newTimestamp, forced: true } 
        });
        window.dispatchEvent(event);
        console.log(`Dispatched refreshRewards event with delay: ${delay}ms and timestamp: ${newTimestamp}`);
        
        // Also directly trigger DOM update
        document.querySelectorAll('[data-rewards-display]').forEach(element => {
          element.setAttribute('data-update', newTimestamp);
        });
      } catch (error) {
        console.error("Error dispatching reward refresh event:", error);
      }
    }, delay);
  });
  
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
