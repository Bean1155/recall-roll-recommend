
import React, { useEffect, useState, useCallback, useRef } from "react";
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
  const prevUserIdRef = useRef<string | null>(null);
  const refreshCountRef = useRef(0);
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/rewards');
    }
  };
  
  // Function to refresh rewards display
  const refreshRewards = useCallback(() => {
    if (currentUser) {
      const userPoints = getUserRewards(currentUser.id);
      
      // Only log if points changed or every 10th refresh
      const shouldLog = points !== userPoints || refreshCountRef.current % 10 === 0;
      
      if (shouldLog) {
        console.log(`RewardsCounter: Points refreshed to ${userPoints} (from ${points}) for user ${currentUser.id}`);
        refreshCountRef.current = 0;
      }
      
      refreshCountRef.current++;
      
      setPoints(userPoints);
      setTier(getUserRewardTier(userPoints));
      
      // Update the previous user ID
      prevUserIdRef.current = currentUser.id;
    }
  }, [currentUser, points]);
  
  // Initial load of points and whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      // Log when user changes
      if (prevUserIdRef.current !== currentUser.id) {
        console.log(`RewardsCounter: User changed from ${prevUserIdRef.current} to ${currentUser.id}`);
      }
      
      refreshRewards();
      
      // Force multiple refreshes on user change
      for (let i = 0; i < 3; i++) {
        setTimeout(refreshRewards, (i + 1) * 500);
      }
    }
  }, [currentUser, refreshRewards]);
  
  // Set up event listeners for points updates
  useEffect(() => {
    const handleRefreshEvent = () => {
      console.log("RewardsCounter: Refresh event received");
      refreshRewards();
    };
    
    window.addEventListener('refreshRewards', handleRefreshEvent);
    
    // Refresh on regular intervals, more frequently initially
    const immediateIntervalId = setInterval(refreshRewards, 500);
    
    // After 10 seconds, switch to a less frequent refresh
    const timeoutId = setTimeout(() => {
      clearInterval(immediateIntervalId);
      const regularIntervalId = setInterval(refreshRewards, 3000);
      
      return () => {
        clearInterval(regularIntervalId);
      };
    }, 10000);
    
    return () => {
      window.removeEventListener('refreshRewards', handleRefreshEvent);
      clearInterval(immediateIntervalId);
      clearTimeout(timeoutId);
    };
  }, [refreshRewards]);
  
  // Additional interval to periodically force a refresh from localStorage
  useEffect(() => {
    const forcedRefreshInterval = setInterval(() => {
      if (currentUser) {
        // Direct check from localStorage
        const rewardsData = localStorage.getItem('catalogUserRewards');
        if (rewardsData) {
          const rewards = JSON.parse(rewardsData);
          const storedPoints = rewards[currentUser.id] || 0;
          
          if (storedPoints !== points) {
            console.log(`RewardsCounter: Forced refresh detected change: ${points} → ${storedPoints}`);
            setPoints(storedPoints);
            setTier(getUserRewardTier(storedPoints));
          }
        }
      }
    }, 2000);
    
    return () => clearInterval(forcedRefreshInterval);
  }, [currentUser, points]);
  
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
