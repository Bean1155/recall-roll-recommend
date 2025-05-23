
import React, { useEffect, useState } from "react";
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
  // State to control each drawer's open/closed state
  const [openSections, setOpenSections] = useState({
    leaderboard: true,
    howItWorks: false,
    rewardSystem: false,
    benefits: false,
    trackProgress: false
  });
  
  // Simplified refresh logic when page loads
  useEffect(() => {
    if (!currentUser) return;
    
    console.log("RewardsPage: Component mounted, forcing rewards refresh");
    
    // Single initial refresh is sufficient
    forceRewardsRefresh();
    
    // Less frequent refresh interval
    const intervalId = setInterval(() => {
      forceRewardsRefresh();
    }, 30000); // 30 seconds - much less frequent
    
    return () => {
      clearInterval(intervalId);
    };
  }, [currentUser]);
  
  // Manual refresh function
  const triggerManualRefresh = () => {
    if (!currentUser) return;
    console.log("RewardsPage: Manual refresh triggered by user action");
    forceRewardsRefresh();
  };
  
  // Toggle function to handle opening and closing drawers
  const toggleSection = (section: keyof typeof openSections) => {
    console.log(`RewardsPage: Toggling section ${section}`);
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  return (
    <GridLayout title={
      <>
        {/* Rewards Status centered */}
        <div className="mb-8 w-full flex justify-center">
          <RewardsCounter />
        </div>
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
      
        {/* Live Leaderboard section */}
        <div className="mb-8">
          <CatalogCollapsible 
            label="Live Leaderboard" 
            backgroundColor="#FFD700" 
            textColor="#603913"
            open={openSections.leaderboard}
            onOpenChange={() => toggleSection('leaderboard')}
          >
            <LeaderboardTab />
          </CatalogCollapsible>
        </div>
        
        {/* How It Works section */}
        <div className="mb-8">
          <CatalogCollapsible 
            label="How It Works" 
            backgroundColor="#ACC8E5" 
            textColor="#603913"
            open={openSections.howItWorks}
            onOpenChange={() => toggleSection('howItWorks')}
          >
            <HowItWorksTab />
          </CatalogCollapsible>
        </div>
        
        {/* Reward System section */}
        <div className="mb-8">
          <CatalogCollapsible 
            label="Reward System" 
            backgroundColor="#d2b48c" 
            textColor="#603913"
            open={openSections.rewardSystem}
            onOpenChange={() => toggleSection('rewardSystem')}
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
            open={openSections.benefits}
            onOpenChange={() => toggleSection('benefits')}
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
            open={openSections.trackProgress}
            onOpenChange={() => toggleSection('trackProgress')}
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
