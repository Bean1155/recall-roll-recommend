
import React, { useEffect } from "react";
import GridLayout from "@/components/GridLayout";
import { BarChart4, Gift } from "lucide-react";
import RewardsCounter from "@/components/RewardsCounter";
import { CatalogCollapsible } from "@/components/ui/collapsible";
import HowItWorksTab from "@/components/rewards/HowItWorksTab";
import RewardSystemTab from "@/components/rewards/RewardSystemTab";
import { forceRewardsRefresh } from "@/utils/rewardUtils";
import { useUser } from "@/contexts/UserContext";

const RewardsPage = () => {
  const { currentUser } = useUser();
  
  // Force rewards refresh when this page is loaded
  useEffect(() => {
    if (!currentUser) return;
    
    console.log("RewardsPage: Component mounted, forcing rewards refresh");
    
    // Immediately check localStorage
    try {
      const rewardsData = localStorage.getItem('catalogUserRewards');
      if (rewardsData) {
        const rewards = JSON.parse(rewardsData);
        console.log(`RewardsPage: Direct check shows user ${currentUser.id} has ${rewards[currentUser.id] || 0} points`);
      } else {
        console.log("RewardsPage: No rewards data found in localStorage");
      }
    } catch (e) {
      console.error("Error checking localStorage:", e);
    }
    
    // Multiple refreshes to ensure it's caught
    const delays = [0, 100, 200, 500, 1000, 2000, 5000];
    
    delays.forEach(delay => {
      setTimeout(() => {
        forceRewardsRefresh();
        console.log(`RewardsPage: Forced refresh with delay ${delay}ms`);
      }, delay);
    });
    
    // Set up a regular interval for this page
    const intervalId = setInterval(() => {
      forceRewardsRefresh();
    }, 2000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [currentUser]);
  
  return (
    <GridLayout title={
      <>
        {/* Rewards Status above the title */}
        <div className="mb-8">
          <RewardsCounter />
        </div>
        
        <div>How to Earn Rewards</div>
      </>
    }>
      <div className="max-w-3xl mx-auto">
        {/* Collapsible How It Works section (now first) */}
        <div className="mb-8">
          <CatalogCollapsible 
            label="How It Works" 
            backgroundColor="#ACC8E5" 
            textColor="#603913"
          >
            <HowItWorksTab />
          </CatalogCollapsible>
        </div>
        
        {/* Collapsible Reward System section (now second) */}
        <div className="mb-8">
          <CatalogCollapsible 
            label="Reward System" 
            backgroundColor="#d2b48c" 
            textColor="#603913"
          >
            <RewardSystemTab />
          </CatalogCollapsible>
        </div>
        
        {/* Benefits section (now third) */}
        <div className="mb-8">
          <CatalogCollapsible 
            label="Benefits" 
            backgroundColor="#E5DEFF" 
            textColor="#603913"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-4">
                <Gift className="text-catalog-teal h-6 w-6" />
                <h3 className="font-bold">Benefits</h3>
              </div>
              <ul className="space-y-2 pl-4 list-decimal">
                <li>Increase of recall of favorite bites & blockbusters</li>
                <li>No more memory blocks, i.e. user can access catalog to find that restaurant tucked away in Portland Maine you loved</li>
                <li>You'll always have an answer to "What shows have you seen that are worth watching"?</li>
                <li>When you share you support businesses and creators</li>
              </ul>
            </div>
          </CatalogCollapsible>
        </div>
        
        {/* Track Progress section (now fourth) */}
        <div className="mb-8">
          <CatalogCollapsible 
            label="Track Progress" 
            backgroundColor="#FADADD" 
            textColor="#603913"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-4">
                <BarChart4 className="text-catalog-teal h-6 w-6" />
                <h3 className="font-bold">Track Progress</h3>
              </div>
              <p>Keep an eye on your monthly report card to track your referral progress.</p>
              <p>Challenge yourself to reach the next tier in our rating scale!</p>
            </div>
          </CatalogCollapsible>
        </div>
      </div>
    </GridLayout>
  );
};

export default RewardsPage;
