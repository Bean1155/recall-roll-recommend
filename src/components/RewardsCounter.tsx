
import React, { useEffect, useState } from "react";
import { getUserRewards, getUserRewardTier } from "@/lib/data";
import { useUser } from "@/contexts/UserContext";
import { Award, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

interface RewardsCounterProps {
  variant?: "compact" | "detailed";
  className?: string;
  onClick?: () => void;
}

const RewardsCounter = ({ variant = "detailed", className = "", onClick }: RewardsCounterProps) => {
  const { currentUser } = useUser();
  const [points, setPoints] = useState(0);
  const [tier, setTier] = useState("");
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/rewards');
    }
  };
  
  // Function to refresh rewards display
  const refreshRewards = () => {
    if (currentUser) {
      const userPoints = getUserRewards(currentUser.id);
      setPoints(userPoints);
      setTier(getUserRewardTier(userPoints));
      console.log("RewardsCounter: Points refreshed to", userPoints);
    }
  };
  
  // Initial load of points
  useEffect(() => {
    refreshRewards();
  }, [currentUser]);
  
  // Listen for refreshRewards events
  useEffect(() => {
    const handleRefreshEvent = () => {
      console.log("RewardsCounter: Refresh event received");
      refreshRewards();
    };
    
    window.addEventListener('refreshRewards', handleRefreshEvent);
    
    // Update the points every 2 seconds to catch any changes
    const intervalId = setInterval(refreshRewards, 2000);
    
    return () => {
      window.removeEventListener('refreshRewards', handleRefreshEvent);
      clearInterval(intervalId);
    };
  }, [currentUser]);
  
  // Function to get background color based on tier
  const getTierColor = () => {
    switch(tier) {
      case "Needs Improvement": return "bg-orange-100 text-orange-800";
      case "Fair": return "bg-yellow-100 text-yellow-800";
      case "Satisfactory": return "bg-blue-100 text-blue-800";
      case "Good": return "bg-green-100 text-green-800";
      case "Excellent": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  if (variant === "compact") {
    return (
      <div 
        className={`flex items-center ${className} bg-catalog-cream rounded-full px-3 py-1 shadow-sm border-2 border-catalog-teal cursor-pointer hover:bg-catalog-teal hover:text-white transition-colors`}
        onClick={handleClick}
      >
        <Award className="text-catalog-teal h-5 w-5 mr-1 group-hover:text-white" />
        <span className="font-typewriter text-sm font-bold">{points}</span>
      </div>
    );
  }
  
  return (
    <Card className={`border-catalog-softBrown shadow-md overflow-hidden ${className}`}>
      <div className="bg-catalog-teal text-white font-typewriter font-bold py-2 px-4 flex items-center">
        <Trophy className="h-5 w-5 mr-2" />
        Your Rewards Status
      </div>
      <CardContent className="p-4" style={{
        backgroundImage: `linear-gradient(#ACC8E5 1px, transparent 1px)`,
        backgroundSize: '100% 28px',
        backgroundRepeat: 'repeat-y',
        backgroundColor: '#FEF7CD'
      }}>
        <div className="space-y-4 pt-2">
          <div className="flex justify-between items-center">
            <span className="font-typewriter text-sm font-bold">Total Points:</span>
            <span className="text-xl font-bold">{points}</span>
          </div>
          
          <Separator className="bg-catalog-softBrown/20" />
          
          <div className="flex justify-between items-center">
            <span className="font-typewriter text-sm font-bold">Current Tier:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor()}`}>
              {tier}
            </span>
          </div>
          
          <div className="text-sm mt-2">
            <p className="font-typewriter">
              {points === 0 
                ? "Start tracking and sharing recommendations to avoid forgetting!" 
                : `You've earned ${points} points so far. Keep sharing!`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardsCounter;
