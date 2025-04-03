
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
  
  // Update localStorage with a timestamp to force refresh on components
  const timestamp = Date.now();
  localStorage.setItem('lastRewardUpdate', timestamp.toString());
  
  // Use a more visible toast with longer duration and higher z-index
  toast({
    title: `🎉 You earned ${pointsAdded} point${pointsAdded > 1 ? 's' : ''}!`,
    description: `${reason}. You now have ${totalPoints} total points.`,
    className: "bg-catalog-cream border-catalog-teal text-catalog-darkBrown font-medium border-4 z-[2000] shadow-lg",
    duration: 10000, // Show for 10 seconds
    variant: "default",
  });
  
  // Force the rewards counter to refresh immediately and repeatedly
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      forceRewardsRefresh();
      console.log(`Toast notification triggered: +${pointsAdded} points (${reason}) - refresh attempt ${i+1}`);
    }, i * 200);
  }
};

/**
 * Force the rewards counter to refresh
 */
export const forceRewardsRefresh = (): void => {
  console.log("Force refresh rewards event triggered");
  
  // Update localStorage with a timestamp to force refresh
  const newTimestamp = Date.now();
  localStorage.setItem('lastRewardUpdate', newTimestamp.toString());
  console.log(`Set lastRewardUpdate to ${newTimestamp}`);
  
  // Dispatch the event multiple times with various delays to ensure it's caught
  const delays = [0, 50, 100, 200, 300, 500, 1000, 2000, 3000];
  
  delays.forEach(delay => {
    setTimeout(() => {
      try {
        const event = new CustomEvent('refreshRewards', { 
          detail: { timestamp: newTimestamp } 
        });
        window.dispatchEvent(event);
        console.log(`Dispatched refreshRewards event with delay: ${delay}ms and timestamp: ${newTimestamp}`);
      } catch (error) {
        console.error("Error dispatching reward refresh event:", error);
      }
    }, delay);
  });
  
  // Also try to directly update any reward displays on the page
  try {
    document.querySelectorAll('[data-rewards-display]').forEach(element => {
      element.setAttribute('data-update', newTimestamp.toString());
      console.log("Updated DOM element with data-rewards-display attribute");
    });
  } catch (e) {
    // Ignore DOM errors, this is just a bonus attempt
    console.error("Error updating DOM elements:", e);
  }
};
