
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
  
  // Use a more visible toast with longer duration
  toast({
    title: `🎉 You earned ${pointsAdded} point${pointsAdded > 1 ? 's' : ''}!`,
    description: `${reason}. You now have ${totalPoints} total points.`,
    className: "bg-catalog-cream border-catalog-teal text-catalog-darkBrown font-medium",
    duration: 5000, // Show for 5 seconds
  });
  
  // Also log to console for debugging
  console.log(`Toast notification sent: +${pointsAdded} points (${reason})`);
};
