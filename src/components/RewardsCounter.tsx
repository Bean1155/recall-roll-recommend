import React, { useEffect, useState, useCallback, useRef } from "react";
import { getUserRewards, getUserRewardTier } from "@/lib/data";
import { useUser } from "@/contexts/UserContext";
import { Award, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

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
  const animateRef = useRef(false);
  const refreshTimeoutRef = useRef<number | null>(null);
  const lastUpdateTimestampRef = useRef<string | null>(null);
  const refreshCountRef = useRef(0);
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/rewards');
    }
  };
  
  const refreshRewards = useCallback(() => {
    if (!currentUser) return;
    
    refreshCountRef.current += 1;
    console.log(`RewardsCounter: Refreshing points (attempt #${refreshCountRef.current}), current count: ${points}`);
    
    try {
      const rewardsData = localStorage.getItem('catalogUserRewards');
      if (rewardsData) {
        try {
          const rewards = JSON.parse(rewardsData);
          const storedPoints = rewards[currentUser.id] || 0;
          
          console.log(`RewardsCounter: Direct localStorage check - User ${currentUser.id} has ${storedPoints} points`);
          
          if (storedPoints !== points || prevUserIdRef.current !== currentUser.id) {
            console.log(`RewardsCounter: POINTS CHANGED: ${points} → ${storedPoints} (direct localStorage check)`);
            setPoints(storedPoints);
            setTier(getUserRewardTier(storedPoints));
            
            if (storedPoints > points && prevUserIdRef.current === currentUser.id) {
              animateRef.current = true;
              setTimeout(() => {
                animateRef.current = false;
              }, 2000);
            }
            
            prevUserIdRef.current = currentUser.id;
            return;
          }
        } catch (e) {
          console.error("Error parsing localStorage rewards:", e);
        }
      } else {
        console.log("RewardsCounter: No rewards data found in localStorage, initializing");
        localStorage.setItem('catalogUserRewards', JSON.stringify({[currentUser.id]: 1}));
        setPoints(1);
        setTier(getUserRewardTier(1));
        prevUserIdRef.current = currentUser.id;
        return;
      }
      
      const userPoints = getUserRewards(currentUser.id);
      
      console.log(`RewardsCounter: API call returned ${userPoints} points for user ${currentUser.id}`);
      
      setPoints(userPoints);
      setTier(getUserRewardTier(userPoints));
      
      if (userPoints > points && prevUserIdRef.current === currentUser.id) {
        animateRef.current = true;
        setTimeout(() => {
          animateRef.current = false;
        }, 2000);
      }
      
      prevUserIdRef.current = currentUser.id;
    } catch (error) {
      console.error("Error refreshing points:", error);
    }
  }, [currentUser, points]);
  
  useEffect(() => {
    if (!currentUser) return;
    
    if (prevUserIdRef.current !== currentUser.id) {
      console.log(`RewardsCounter: User changed from ${prevUserIdRef.current} to ${currentUser.id}`);
    }
    
    refreshRewards();
    
    setTimeout(() => {
      console.log("RewardsCounter: Follow-up refresh after user change");
      refreshRewards();
    }, 500);
    
    prevUserIdRef.current = currentUser.id;
  }, [currentUser, refreshRewards]);
  
  useEffect(() => {
    if (!currentUser) return;
    
    const handleRefreshEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      console.log("RewardsCounter: Refresh event received", customEvent?.detail || '');
      
      refreshRewards();
      
      if (refreshTimeoutRef.current) {
        window.clearTimeout(refreshTimeoutRef.current);
      }
      
      refreshTimeoutRef.current = window.setTimeout(() => {
        console.log("RewardsCounter: Debounced refresh triggered");
        refreshRewards();
        refreshTimeoutRef.current = null;
      }, 300);
      
      setTimeout(() => {
        console.log("RewardsCounter: Additional delayed refresh");
        refreshRewards();
      }, 1000);
    };
    
    window.addEventListener('refreshRewards', handleRefreshEvent, true);
    window.addEventListener('realtime_rewards_update', handleRefreshEvent, true);
    window.addEventListener('card_reward_update', handleRefreshEvent, true);
    window.addEventListener('catalog_action', (e) => {
      const customEvent = e as CustomEvent;
      console.log("RewardsCounter: Received catalog_action event:", customEvent.detail?.action);
      if (customEvent.detail?.action === 'card_added' || 
          customEvent.detail?.action === 'recommendation_added' ||
          customEvent.detail?.action === 'card_shared') {
        handleRefreshEvent(e);
      }
    }, true);
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'catalogUserRewards' || e.key === 'lastRewardUpdate' || 
          e.key === `user_${currentUser.id}_last_reward`) {
        console.log(`RewardsCounter: Storage change detected for ${e.key}`);
        handleRefreshEvent(new Event('storage'));
      }
    };
    
    window.addEventListener('storage', handleStorageChange, true);
    
    const intervalId = setInterval(() => {
      console.log("RewardsCounter: Interval refresh triggered");
      refreshRewards();
    }, 5000);
    
    refreshRewards();
    
    const refreshAttempts = [500, 1000, 2000, 5000];
    refreshAttempts.forEach((delay, index) => {
      setTimeout(() => {
        console.log(`RewardsCounter: Delayed refresh #${index + 1}`);
        refreshRewards();
      }, delay);
    });
    
    return () => {
      window.removeEventListener('refreshRewards', handleRefreshEvent, true);
      window.removeEventListener('realtime_rewards_update', handleRefreshEvent, true);
      window.removeEventListener('card_reward_update', handleRefreshEvent, true);
      window.removeEventListener('catalog_action', handleRefreshEvent, true);
      window.removeEventListener('storage', handleStorageChange, true);
      
      if (refreshTimeoutRef.current) {
        window.clearTimeout(refreshTimeoutRef.current);
      }
      
      clearInterval(intervalId);
    };
  }, [currentUser, refreshRewards]);
  
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
        className={`flex items-center ${className} ${
          animateRef.current 
            ? 'bg-yellow-300 animate-pulse border-2 border-yellow-500' 
            : 'bg-catalog-cream border-2 border-catalog-teal'
        } rounded-full px-3 py-1 shadow-sm cursor-pointer hover:bg-catalog-teal hover:text-white transition-colors`}
        onClick={handleClick}
        data-rewards-display="true"
        data-rewards-points={points}
      >
        <Award className="text-catalog-teal h-5 w-5 mr-1 group-hover:text-white" />
        <span className="font-typewriter text-sm font-bold">{points}</span>
      </div>
    );
  }
  
  return (
    <Card 
      className={`border-catalog-softBrown shadow-md overflow-hidden ${className} ${
        animateRef.current ? 'ring-4 ring-yellow-300 animate-pulse' : ''
      }`}
      data-rewards-display="true"
      data-rewards-points={points}
    >
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
            <span className={`text-xl font-bold ${animateRef.current ? 'text-yellow-600' : ''}`}>{points}</span>
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
