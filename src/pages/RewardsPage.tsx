
import React from "react";
import GridLayout from "@/components/GridLayout";
import { BarChart4, Gift } from "lucide-react";
import RewardsCounter from "@/components/RewardsCounter";
import RewardsTabsComponent from "@/components/rewards/RewardsTabsComponent";
import RewardsInfoCard from "@/components/rewards/RewardsInfoCard";

const RewardsPage = () => {
  return (
    <GridLayout title="How to Earn Rewards">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <RewardsCounter />
        </div>
        
        <RewardsTabsComponent />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <RewardsInfoCard 
            title="Benefits" 
            icon={Gift} 
            backgroundColor="#E5DEFF"
          >
            <p>Sharing is caring. When you refer and share someone else receives and perhaps a place you've visited receives some more visitors helping to grow that business or a creator receives more viewers. You are spreading the love!</p>
          </RewardsInfoCard>
          
          <RewardsInfoCard 
            title="Track Progress" 
            icon={BarChart4} 
            backgroundColor="#FADADD"
          >
            <p>Keep an eye on your monthly report card to track your referral progress.</p>
            <p>Challenge yourself to reach the next tier in our rating scale!</p>
          </RewardsInfoCard>
        </div>
      </div>
    </GridLayout>
  );
};

export default RewardsPage;
