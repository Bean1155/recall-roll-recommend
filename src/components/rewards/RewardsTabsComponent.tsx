
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HowItWorksTab from "./HowItWorksTab";
import RewardSystemTab from "./RewardSystemTab";

const RewardsTabsComponent = () => {
  const [activeTab, setActiveTab] = useState("howItWorks");

  return (
    <Tabs defaultValue="howItWorks" className="mb-8" onValueChange={setActiveTab}>
      <TabsList className="w-full flex mb-4 bg-catalog-cream border border-catalog-softBrown rounded-sm p-0 h-auto shadow-sm">
        {["howItWorks", "rewardSystem"].map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className="flex-1 py-3 font-typewriter font-bold border-r border-catalog-softBrown last:border-r-0 data-[state=active]:bg-catalog-teal data-[state=active]:text-white"
            style={{
              backgroundColor: activeTab === tab ? "#008080" : "#fffdd0",
              color: activeTab === tab ? "white" : "#9E8979",
              boxShadow: "none",
              borderRadius: 0
            }}
          >
            {tab === "howItWorks" ? "How It Works" : "Reward System"}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <TabsContent value="howItWorks">
        <HowItWorksTab />
      </TabsContent>
      
      <TabsContent value="rewardSystem">
        <RewardSystemTab />
      </TabsContent>
    </Tabs>
  );
};

export default RewardsTabsComponent;
