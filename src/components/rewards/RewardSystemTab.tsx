
import React from "react";

const RewardSystemTab = () => {
  return (
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
          <p className="font-typewriter text-lg">Users receive 1 point for every 2 cards added to each library (Bites and Blockbusters counted separately)</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-vintage-tan rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
            <span className="font-bold">3</span>
          </div>
          <p className="font-typewriter text-lg">The more points you accumulate, the more share your favorite bites and blockbusters.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-vintage-tan rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
            <span className="font-bold">4</span>
          </div>
          <p className="font-typewriter text-lg">The more you share, the happier you will be</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-vintage-tan rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
            <span className="font-bold">5</span>
          </div>
          <p className="font-typewriter text-lg">User will receive a monthly report card detailing the number of referrals shared and the number of referrals received</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-vintage-tan rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
            <span className="font-bold">6</span>
          </div>
          <div className="font-typewriter text-lg">
            <p className="mb-2">Rating scale for referrals is as follows:</p>
            <ul className="space-y-2 pl-6">
              <li className="flex items-center gap-2">
                <span className="w-32">1-50 Points</span>
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">Needs Improvement</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-32">51-100 Points</span>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Fair</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-32">101-150 Points</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Satisfactory</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-32">151-200 Points</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Good</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-32">201+ Points</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Excellent</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardSystemTab;
