
import React, { useEffect } from "react";
import GridLayout from "@/components/GridLayout";
import { BarChart4, Gift } from "lucide-react";
import RewardsCounter from "@/components/RewardsCounter";
import { CatalogCollapsible } from "@/components/ui/collapsible";
import HowItWorksTab from "@/components/rewards/HowItWorksTab";
import RewardSystemTab from "@/components/rewards/RewardSystemTab";
import { forceRewardsRefresh } from "@/utils/rewardUtils";
import { useUser } from "@/contexts/UserContext";
import LeaderboardTab from "@/components/rewards/LeaderboardTab";

const RewardsPage = () => {
  const { currentUser } = useUser();
  
  // Force rewards refresh when this page is loaded - critical for real-time updates
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
    
    // CRITICAL ADDITION: Listen specifically for card creation reward events
    const handleCardRewardUpdate = () => {
      console.log("RewardsPage: Received card_reward_update event");
      // Run multiple refreshes with increasing delays
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          forceRewardsRefresh();
          console.log(`RewardsPage: Card reward update refresh attempt ${i+1}`);
        }, i * 200);
      }
    };
    
    window.addEventListener('card_reward_update', handleCardRewardUpdate);
    window.addEventListener('catalog_action', (e) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.action === 'card_added') {
        console.log("RewardsPage: Detected card_added event, triggering refresh");
        handleCardRewardUpdate();
      }
    });
    
    // Set up a regular interval for this page
    const intervalId = setInterval(() => {
      forceRewardsRefresh();
    }, 2000);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('card_reward_update', handleCardRewardUpdate);
      window.removeEventListener('catalog_action', handleCardRewardUpdate);
    };
  }, [currentUser]);
  
  // Manual refresh function (useful for debugging)
  const triggerManualRefresh = () => {
    if (!currentUser) return;
    console.log("RewardsPage: Manual refresh triggered by user action");
    forceRewardsRefresh();
  };
  
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
        {/* Clickable area to force refresh */}
        <div 
          className="mb-4 p-2 text-center cursor-pointer bg-catalog-cream hover:bg-catalog-teal hover:text-white rounded-md transition-colors"
          onClick={triggerManualRefresh}
        >
          <span className="text-sm font-medium">Click to refresh your points</span>
        </div>
      
        {/* Live Leaderboard section (new addition) */}
        <div className="mb-8">
          <CatalogCollapsible 
            label="Live Leaderboard" 
            backgroundColor="#FFD700" 
            textColor="#603913"
            defaultOpen={true}
          >
            <LeaderboardTab />
          </CatalogCollapsible>
        </div>
        
        {/* Collapsible How It Works section */}
        <div className="mb-8">
          <CatalogCollapsible 
            label="How It Works" 
            backgroundColor="#ACC8E5" 
            textColor="#603913"
          >
            <HowItWorksTab />
          </CatalogCollapsible>
        </div>
        
        {/* Collapsible Reward System section */}
        <div className="mb-8">
          <CatalogCollapsible 
            label="Reward System" 
            backgroundColor="#d2b48c" 
            textColor="#603913"
          >
            <RewardSystemTab />
          </CatalogCollapsible>
        </div>
        
        {/* Benefits section */}
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
        
        {/* Track Progress section */}
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
