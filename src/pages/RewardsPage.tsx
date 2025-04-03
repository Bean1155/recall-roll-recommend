
import React, { useState } from "react";
import GridLayout from "@/components/GridLayout";
import { Award, Share2, BarChart4, Gift } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import RewardsCounter from "@/components/RewardsCounter";

const RewardsPage = () => {
  const [activeTab, setActiveTab] = useState("howItWorks");

  return (
    <GridLayout title="How to Earn Rewards">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <RewardsCounter />
        </div>
        
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
            <div 
              className="bg-white border border-catalog-softBrown rounded-md p-6 mb-8 shadow-md"
              style={{
                backgroundImage: `
                  linear-gradient(#ACC8E5 1px, transparent 1px),
                  linear-gradient(90deg, #ACC8E5 1px, transparent 1px)
                `,
                backgroundSize: '100% 28px, 33.33% 100%',
                backgroundPosition: '0 0',
                backgroundRepeat: 'repeat-y, repeat-x',
                padding: '28px 16px 16px 48px',
              }}
            >
              <h2 className="text-2xl font-bold font-typewriter text-catalog-softBrown mb-2 underline">
                Reward System for Recommendations
              </h2>
              <h3 className="text-xl font-typewriter text-catalog-softBrown mb-6">
                How it works for App Users
              </h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex gap-4">
                  <div className="bg-vintage-tan rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="font-bold">1</span>
                  </div>
                  <p className="font-typewriter text-lg">User (User A) recommends a bite or blockbuster to a friend (User B).</p>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-vintage-tan rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="font-bold">2</span>
                  </div>
                  <p className="font-typewriter text-lg">Recommendation is logged into the app</p>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-vintage-tan rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="font-bold">3</span>
                  </div>
                  <p className="font-typewriter text-lg">User A receives a point for a successful recommendation</p>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-vintage-tan rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="font-bold">4</span>
                  </div>
                  <p className="font-typewriter text-lg">User B receives a point for accepting recommendation</p>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-vintage-tan rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="font-bold">5</span>
                  </div>
                  <p className="font-typewriter text-lg">Both users receive points if that recommendation is then forwarded to the next user, i.e. I told two friends; they told two friends and so we get more points</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="rewardSystem">
            <div 
              className="bg-white border border-catalog-softBrown rounded-md p-6 mb-8 shadow-md"
              style={{
                backgroundImage: `
                  linear-gradient(#ACC8E5 1px, transparent 1px),
                  linear-gradient(90deg, #ACC8E5 1px, transparent 1px)
                `,
                backgroundSize: '100% 28px, 33.33% 100%',
                backgroundPosition: '0 0',
                backgroundRepeat: 'repeat-y, repeat-x',
                padding: '28px 16px 16px 48px',
              }}
            >
              <h2 className="text-2xl font-bold font-typewriter text-catalog-softBrown mb-6 underline">
                Reward System
              </h2>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="bg-vintage-tan rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="font-bold">1</span>
                  </div>
                  <p className="font-typewriter text-lg">Users receive 1 point/per referral</p>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-vintage-tan rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="font-bold">2</span>
                  </div>
                  <p className="font-typewriter text-lg">The more points you accumulate, the more share your favorite bites and blockbusters.</p>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-vintage-tan rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="font-bold">3</span>
                  </div>
                  <p className="font-typewriter text-lg">The more you share, the happier you will be</p>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-vintage-tan rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="font-bold">4</span>
                  </div>
                  <p className="font-typewriter text-lg">User will receive a monthly report card detailing the number of referrals shared and the number of referrals received</p>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-vintage-tan rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="font-bold">5</span>
                  </div>
                  <div className="font-typewriter text-lg">
                    <p className="mb-2">Rating scale for referrals is as follows:</p>
                    <ul className="space-y-2 pl-6">
                      <li className="flex items-center gap-2">
                        <span className="w-32">1-25 Referrals</span>
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">Needs Improvement</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-32">26-50 Referrals</span>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Fair</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-32">51-75 Referrals</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Satisfactory</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-32">76-100 Referrals</span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Good</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-32">Over 101+ Referrals</span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Excellent</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white shadow-md overflow-hidden border-catalog-softBrown">
            <div className="py-2 px-4 bg-catalog-teal text-white font-typewriter font-bold">
              How Points Work
            </div>
            <CardContent className="p-4" style={{
              backgroundImage: `linear-gradient(#ACC8E5 1px, transparent 1px)`,
              backgroundSize: '100% 28px',
              backgroundRepeat: 'repeat-y',
              backgroundColor: '#FEF7CD'
            }}>
              <div className="space-y-4 pt-2">
                <div className="flex gap-2 items-center">
                  <Award className="text-catalog-teal h-6 w-6" />
                  <h3 className="font-bold">Earning Points</h3>
                </div>
                <p>Points are earned each time you successfully share a recommendation that's accepted by a friend.</p>
                <p>The more your recommendations spread, the more points you'll collect!</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md overflow-hidden border-catalog-softBrown">
            <div className="py-2 px-4 bg-catalog-teal text-white font-typewriter font-bold">
              Benefits
            </div>
            <CardContent className="p-4" style={{
              backgroundImage: `linear-gradient(#ACC8E5 1px, transparent 1px)`,
              backgroundSize: '100% 28px',
              backgroundRepeat: 'repeat-y',
              backgroundColor: '#E5DEFF'
            }}>
              <div className="space-y-4 pt-2">
                <div className="flex gap-2 items-center">
                  <Gift className="text-catalog-teal h-6 w-6" />
                  <h3 className="font-bold">Rewards Perks</h3>
                </div>
                <p>Sharing is caring. When you refer and share someone else receives and perhaps a place you've visited receives some more visitors helping to grow that business or a creator receives more viewers. You are spreading the love!</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white shadow-md overflow-hidden border-catalog-softBrown">
            <div className="py-2 px-4 bg-catalog-teal text-white font-typewriter font-bold">
              Share More
            </div>
            <CardContent className="p-4" style={{
              backgroundImage: `linear-gradient(#ACC8E5 1px, transparent 1px)`,
              backgroundSize: '100% 28px',
              backgroundRepeat: 'repeat-y',
              backgroundColor: '#D3E4FD'
            }}>
              <div className="space-y-4 pt-2">
                <div className="flex gap-2 items-center">
                  <Share2 className="text-catalog-teal h-6 w-6" />
                  <h3 className="font-bold">Sharing Tips</h3>
                </div>
                <p>Share your favorite bites and blockbusters with friends who have similar tastes.</p>
                <p>The more personalized your recommendation, the more likely it will be accepted!</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md overflow-hidden border-catalog-softBrown">
            <div className="py-2 px-4 bg-catalog-teal text-white font-typewriter font-bold">
              Track Progress
            </div>
            <CardContent className="p-4" style={{
              backgroundImage: `linear-gradient(#ACC8E5 1px, transparent 1px)`,
              backgroundSize: '100% 28px',
              backgroundRepeat: 'repeat-y',
              backgroundColor: '#FADADD'
            }}>
              <div className="space-y-4 pt-2">
                <div className="flex gap-2 items-center">
                  <BarChart4 className="text-catalog-teal h-6 w-6" />
                  <h3 className="font-bold">Monthly Reports</h3>
                </div>
                <p>Keep an eye on your monthly report card to track your referral progress.</p>
                <p>Challenge yourself to reach the next tier in our rating scale!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </GridLayout>
  );
};

export default RewardsPage;
