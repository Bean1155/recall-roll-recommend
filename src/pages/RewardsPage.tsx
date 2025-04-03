
import React from "react";
import GridLayout from "@/components/GridLayout";
import Envelope from "@/components/Envelope";
import { Award, Share2, BarChart4, Gift } from "lucide-react";

const RewardsPage = () => {
  return (
    <GridLayout title="How to Earn Rewards">
      <div className="max-w-3xl mx-auto">
        <div 
          className="bg-white border border-catalog-softBrown rounded-md p-6 mb-8 shadow-md"
          style={{
            backgroundImage: `
              linear-gradient(#9E8979 1px, transparent 1px),
              linear-gradient(90deg, #9E8979 1px, transparent 1px)
            `,
            backgroundSize: '100% 28px, 33.33% 100%',
            backgroundPosition: '0 0',
            backgroundRepeat: 'repeat-y, repeat-x',
            padding: '28px 16px 16px 48px',
          }}
        >
          <h2 className="text-2xl font-bold font-typewriter text-catalog-softBrown mb-6 underline">
            Reward System for Recommendations: How it works for App Users
          </h2>
          
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Envelope label="How Points Work" backgroundColor="#FEF7CD">
            <div className="space-y-4">
              <div className="flex gap-2 items-center">
                <Award className="text-catalog-teal h-6 w-6" />
                <h3 className="font-bold">Earning Points</h3>
              </div>
              <p>Points are earned each time you successfully share a recommendation that's accepted by a friend.</p>
              <p>The more your recommendations spread, the more points you'll collect!</p>
            </div>
          </Envelope>
          
          <Envelope label="Benefits" backgroundColor="#E5DEFF">
            <div className="space-y-4">
              <div className="flex gap-2 items-center">
                <Gift className="text-catalog-teal h-6 w-6" />
                <h3 className="font-bold">Rewards Perks</h3>
              </div>
              <p>Accumulate points to unlock special features and recognition in the app.</p>
              <p>Top recommenders may receive special badges and exclusive content access!</p>
            </div>
          </Envelope>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Envelope label="Share More" backgroundColor="#D3E4FD">
            <div className="space-y-4">
              <div className="flex gap-2 items-center">
                <Share2 className="text-catalog-teal h-6 w-6" />
                <h3 className="font-bold">Sharing Tips</h3>
              </div>
              <p>Share your favorite bites and blockbusters with friends who have similar tastes.</p>
              <p>The more personalized your recommendation, the more likely it will be accepted!</p>
            </div>
          </Envelope>
          
          <Envelope label="Track Progress" backgroundColor="#FADADD">
            <div className="space-y-4">
              <div className="flex gap-2 items-center">
                <BarChart4 className="text-catalog-teal h-6 w-6" />
                <h3 className="font-bold">Monthly Reports</h3>
              </div>
              <p>Keep an eye on your monthly report card to track your referral progress.</p>
              <p>Challenge yourself to reach the next tier in our rating scale!</p>
            </div>
          </Envelope>
        </div>
      </div>
    </GridLayout>
  );
};

export default RewardsPage;
