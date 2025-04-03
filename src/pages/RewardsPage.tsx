
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
            <ul className="space-y-2 pl-4 list-decimal">
              <li>Increase of recall of favorite bites & blockbusters</li>
              <li>No more memory blocks, i.e. user can access catalog to find that restaurant tucked away in Portland Maine you loved</li>
              <li>You'll always have an answer to "What shows have you seen that are worth watching"?</li>
              <li>When you share you support businesses and creators</li>
            </ul>
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
