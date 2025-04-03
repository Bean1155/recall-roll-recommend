
import React from "react";
import GridLayout from "@/components/GridLayout";
import { BarChart4, Gift } from "lucide-react";
import RewardsCounter from "@/components/RewardsCounter";
import RewardsInfoCard from "@/components/rewards/RewardsInfoCard";
import { CatalogCollapsible } from "@/components/ui/collapsible";
import HowItWorksTab from "@/components/rewards/HowItWorksTab";
import RewardSystemTab from "@/components/rewards/RewardSystemTab";

const RewardsPage = () => {
  return (
    <GridLayout title="How to Earn Rewards">
      <div className="max-w-3xl mx-auto">
        {/* Benefits and Track Progress cards side by side at the top */}
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
        
        {/* Rewards Status at the bottom */}
        <div className="mb-6">
          <RewardsCounter />
        </div>
      </div>
    </GridLayout>
  );
};

export default RewardsPage;
