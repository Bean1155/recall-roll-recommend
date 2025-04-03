
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
  
  // Use a more visible toast with longer duration and higher z-index
  toast({
    title: `🎉 You earned ${pointsAdded} point${pointsAdded > 1 ? 's' : ''}!`,
    description: `${reason}. You now have ${totalPoints} total points.`,
    className: "bg-catalog-cream border-catalog-teal text-catalog-darkBrown font-medium border-4 z-[2000] shadow-lg",
    duration: 10000, // Show for 10 seconds
    variant: "default",
  });
  
  // Force the rewards counter to refresh immediately
  setTimeout(() => {
    forceRewardsRefresh();
    console.log(`Toast notification triggered: +${pointsAdded} points (${reason})`);
  }, 100);
};

/**
 * Force the rewards counter to refresh
 */
export const forceRewardsRefresh = (): void => {
  console.log("Force refresh rewards event triggered");
  // Dispatch the event multiple times with small delays to ensure it's caught
  setTimeout(() => {
    const event = new CustomEvent('refreshRewards');
    window.dispatchEvent(event);
  }, 0);
  
  setTimeout(() => {
    const event = new CustomEvent('refreshRewards');
    window.dispatchEvent(event);
  }, 300);
  
  setTimeout(() => {
    const event = new CustomEvent('refreshRewards');
    window.dispatchEvent(event);
  }, 1000);
};
