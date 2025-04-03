
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
  if (pointsAdded <= 0) return;
  
  // Get the updated total points
  const totalPoints = getUserRewards(userId);
  
  console.log("REWARD TOAST: User earned", pointsAdded, "points for", reason);
  console.log("REWARD TOAST: Total points now", totalPoints);
  
  // Use a more visible toast with longer duration and z-index
  toast({
    title: `🎉 You earned ${pointsAdded} point${pointsAdded > 1 ? 's' : ''}!`,
    description: `${reason}. You now have ${totalPoints} total points.`,
    className: "bg-catalog-cream border-catalog-teal text-catalog-darkBrown font-medium border-4 z-[2000] shadow-lg",
    duration: 10000, // Show for 10 seconds (increased from 8)
    variant: "default",
  });
  
  // Force the toast to be visible
  setTimeout(() => {
    // Attempt to make sure the toast is shown by refreshing the rewards counter
    const event = new CustomEvent('refreshRewards');
    window.dispatchEvent(event);
    
    // Also log to console for debugging
    console.log(`Toast notification triggered: +${pointsAdded} points (${reason})`);
  }, 100);
};
