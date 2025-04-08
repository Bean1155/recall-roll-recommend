
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
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/rewards');
    }
  };
  
  // Function to refresh rewards display with improved reliability
  const refreshRewards = useCallback(() => {
    if (!currentUser) return;
    
    console.log(`RewardsCounter: Refreshing points, current count: ${points}`);
    
    try {
      // CRITICAL FIX: First try to get direct from localStorage for maximum reliability
      const rewardsData = localStorage.getItem('catalogUserRewards');
      if (rewardsData) {
        try {
          const rewards = JSON.parse(rewardsData);
          const storedPoints = rewards[currentUser.id] || 0;
          
          console.log(`RewardsCounter: Direct localStorage check - User ${currentUser.id} has ${storedPoints} points`);
          
          // Only update if points changed or this is the initial load
          if (points !== storedPoints || prevUserIdRef.current !== currentUser.id) {
            console.log(`RewardsCounter: POINTS CHANGED: ${points} → ${storedPoints} (direct localStorage check)`);
            setPoints(storedPoints);
            setTier(getUserRewardTier(storedPoints));
            
            // Animate if points increased and not the initial load
            if (storedPoints > points && prevUserIdRef.current === currentUser.id) {
              animateRef.current = true;
              setTimeout(() => {
                animateRef.current = false;
              }, 2000);
            }
            
            return; // Exit early if we updated via localStorage
          }
        } catch (e) {
          console.error("Error parsing localStorage rewards:", e);
        }
      } else {
        console.log("RewardsCounter: No rewards data found in localStorage, initializing");
        // Initialize empty rewards if none exist
        localStorage.setItem('catalogUserRewards', JSON.stringify({[currentUser.id]: 1})); // Start with 1 point
      }
      
      // Fallback to API call if no localStorage update
      const userPoints = getUserRewards(currentUser.id);
      
      // Ensure we always have the latest value
      console.log(`RewardsCounter: API call returned ${userPoints} points for user ${currentUser.id}`);
      
      // Only update if points changed or this is initial load
      if (points !== userPoints || prevUserIdRef.current !== currentUser.id) {
        console.log(`RewardsCounter: Points refreshed to ${userPoints} (from ${points}) for user ${currentUser.id}`);
        
        // Animate if points increased and not the initial load
        if (userPoints > points && prevUserIdRef.current === currentUser.id) {
          animateRef.current = true;
          setTimeout(() => {
            animateRef.current = false;
          }, 2000);
        }
        
        // Update state with new values
        setPoints(userPoints);
        setTier(getUserRewardTier(userPoints));
      }
      
      // Update the previous user ID
      prevUserIdRef.current = currentUser.id;
    } catch (error) {
      console.error("Error refreshing points:", error);
    }
  }, [currentUser, points]);
  
  // Initial load of points and whenever currentUser changes
  useEffect(() => {
    if (!currentUser) return;
    
    // Log when user changes
    if (prevUserIdRef.current !== currentUser.id) {
      console.log(`RewardsCounter: User changed from ${prevUserIdRef.current} to ${currentUser.id}`);
    }
    
    // Initial refresh
    refreshRewards();
    
    // Follow up with additional refresh after a delay
    setTimeout(() => {
      console.log("RewardsCounter: Follow-up refresh after user change");
      refreshRewards();
    }, 500);
    
    prevUserIdRef.current = currentUser.id;
  }, [currentUser, refreshRewards]);
  
  // Set up event listeners for points updates with debouncing
  useEffect(() => {
    if (!currentUser) return;
    
    const handleRefreshEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      console.log("RewardsCounter: Refresh event received", customEvent?.detail || '');
      
      // Debounce refresh calls
      if (refreshTimeoutRef.current) {
        window.clearTimeout(refreshTimeoutRef.current);
      }
      
      // Immediate refresh for better responsiveness
      refreshRewards();
      
      // Follow up with a debounced refresh
      refreshTimeoutRef.current = window.setTimeout(() => {
        console.log("RewardsCounter: Debounced refresh triggered");
        refreshRewards();
        refreshTimeoutRef.current = null;
      }, 300); // 300ms debounce
    };
    
    // Add listeners for all relevant events
    window.addEventListener('refreshRewards', handleRefreshEvent);
    window.addEventListener('realtime_rewards_update', handleRefreshEvent);
    window.addEventListener('card_reward_update', handleRefreshEvent);
    window.addEventListener('catalog_action', (e) => {
      const customEvent = e as CustomEvent;
      console.log("RewardsCounter: Received catalog_action event:", customEvent.detail?.action);
      if (customEvent.detail?.action === 'card_added' || 
          customEvent.detail?.action === 'recommendation_added' ||
          customEvent.detail?.action === 'card_shared') {
        handleRefreshEvent(e);
      }
    });
    
    // Check for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'catalogUserRewards' || e.key === 'lastRewardUpdate' || 
          e.key === `user_${currentUser.id}_last_reward`) {
        console.log(`RewardsCounter: Storage change detected for ${e.key}`);
        handleRefreshEvent(new Event('storage'));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Refresh on a less frequent interval
    const intervalId = setInterval(() => {
      console.log("RewardsCounter: Interval refresh triggered");
      refreshRewards();
    }, 5000);
    
    // Force immediate refresh when component mounts
    refreshRewards();
    
    // Additional refresh after a short delay for reliability
    setTimeout(() => refreshRewards(), 1000);
    
    return () => {
      window.removeEventListener('refreshRewards', handleRefreshEvent);
      window.removeEventListener('realtime_rewards_update', handleRefreshEvent);
      window.removeEventListener('card_reward_update', handleRefreshEvent);
      window.removeEventListener('catalog_action', handleRefreshEvent);
      window.removeEventListener('storage', handleStorageChange);
      
      if (refreshTimeoutRef.current) {
        window.clearTimeout(refreshTimeoutRef.current);
      }
      
      clearInterval(intervalId);
    };
  }, [currentUser, refreshRewards]);
  
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
