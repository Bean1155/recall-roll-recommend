
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
            <p>The user will increase their recall of favorite bites and blockbusters. If a user has a memory block, they will be able to access that fabulous restaurant tucked away in Portland or that scary movie they saw on Apple TV+. Our catalog is designed to help you recall, track and reward your connections. Now when a friend says, "what shows have you seen that are worth watching?" You will know!</p>
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
