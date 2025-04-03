
import React from "react";

const HowItWorksTab = () => {
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
      
      <h3 className="text-xl font-typewriter text-catalog-softBrown mb-6 underline">
        Reward System for Adding Content
      </h3>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="bg-vintage-tan rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
            <span className="font-bold">1</span>
          </div>
          <p className="font-typewriter text-lg">Users earn 1 point for every 2 Bite cards added to the library</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-vintage-tan rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
            <span className="font-bold">2</span>
          </div>
          <p className="font-typewriter text-lg">Users earn 1 point for every 2 Blockbuster cards added to the library</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-vintage-tan rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
            <span className="font-bold">3</span>
          </div>
          <p className="font-typewriter text-lg">Bites and Blockbusters are counted separately (adding 1 Bite and 1 Blockbuster = 0 points)</p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksTab;
