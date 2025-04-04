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
  const refreshCountRef = useRef(0);
  const lastUpdateRef = useRef<string | null>(null);
  const componentMountedRef = useRef(false);
  const animateRef = useRef(false);
  
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
      // First try to get direct from localStorage for maximum reliability
      const rewardsData = localStorage.getItem('catalogUserRewards');
      if (rewardsData) {
        try {
          const rewards = JSON.parse(rewardsData);
          const storedPoints = rewards[currentUser.id] || 0;
          
          // Only log if points changed
          if (points !== storedPoints) {
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
      }
      
      // Fallback to API call if no localStorage update
      const userPoints = getUserRewards(currentUser.id);
      const lastUpdateTime = localStorage.getItem('lastRewardUpdate');
      
      // Also check user-specific timestamp for more granular updates
      const userSpecificTimestamp = localStorage.getItem(`user_${currentUser.id}_last_reward`);
      
      // Check if there's been an update since last refresh
      const hasUpdate = lastUpdateTime !== lastUpdateRef.current || 
                        userSpecificTimestamp !== lastUpdateRef.current;
      
      // Only log if points changed or there's been an update
      const shouldLog = points !== userPoints || hasUpdate;
      
      if (shouldLog) {
        console.log(`RewardsCounter: Points refreshed to ${userPoints} (from ${points}) for user ${currentUser.id}`);
        console.log(`RewardsCounter: Update triggered by ${hasUpdate ? 'localStorage update' : 'regular check'}`);
        refreshCountRef.current = 0;
        lastUpdateRef.current = lastUpdateTime;
        
        // Animate if points increased and not the initial load
        if (userPoints > points && prevUserIdRef.current === currentUser.id) {
          animateRef.current = true;
          setTimeout(() => {
            animateRef.current = false;
          }, 2000);
        }
      }
      
      refreshCountRef.current++;
      
      // Always update the points to ensure UI is synchronized
      setPoints(userPoints);
      setTier(getUserRewardTier(userPoints));
      
      // Update the previous user ID
      prevUserIdRef.current = currentUser.id;
    } catch (error) {
      console.error("Error refreshing points:", error);
    }
  }, [currentUser, points]);
  
  // Initial load of points and whenever currentUser changes
  useEffect(() => {
    if (!currentUser) return;
    
    componentMountedRef.current = true;
    
    // Log when user changes
    if (prevUserIdRef.current !== currentUser.id) {
      console.log(`RewardsCounter: User changed from ${prevUserIdRef.current} to ${currentUser.id}`);
    }
    
    // Initial refresh
    refreshRewards();
    
    // Force multiple refreshes on user change
    for (let i = 0; i < 5; i++) {
      setTimeout(refreshRewards, (i + 1) * 100); // Faster initial refreshes
    }
    
    return () => {
      componentMountedRef.current = false;
    };
  }, [currentUser, refreshRewards]);
  
  // Set up event listeners for points updates
  useEffect(() => {
    if (!currentUser) return;
    
    const handleRefreshEvent = (event: Event) => {
      console.log("RewardsCounter: Refresh event received", event);
      
      if (!componentMountedRef.current) return;
      
      const customEvent = event as CustomEvent;
      // If the event was forced, refresh multiple times
      if (customEvent.detail?.forced) {
        for (let i = 0; i < 5; i++) {
          setTimeout(refreshRewards, i * 50); // Faster refresh intervals
        }
      } else {
        refreshRewards();
      }
    };
    
    // Add listener for the new real-time event
    const handleRealTimeUpdate = (event: Event) => {
      console.log("RewardsCounter: Real-time update event received", event);
      
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.userId === currentUser.id) {
        console.log("RewardsCounter: Real-time update for current user");
        
        if (customEvent.detail?.points !== undefined) {
          const newPoints = customEvent.detail.points;
          console.log(`RewardsCounter: Setting points directly to ${newPoints} from real-time event`);
          setPoints(newPoints);
          setTier(getUserRewardTier(newPoints));
          
          // Animate if this was a points increase
          if (newPoints > points) {
            animateRef.current = true;
            setTimeout(() => {
              animateRef.current = false;
            }, 2000);
          }
        } else {
          // If no points provided, force multiple refreshes
          for (let i = 0; i < 5; i++) {
            setTimeout(refreshRewards, i * 50);
          }
        }
      }
    };
    
    // Listen for the custom events
    window.addEventListener('refreshRewards', handleRefreshEvent);
    window.addEventListener('realtime_rewards_update', handleRealTimeUpdate);
    
    // For catalog actions (card added, etc) - high priority
    const handleCatalogAction = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.action === 'card_added') {
        console.log("RewardsCounter: Card added event detected, refreshing...");
        
        // Refresh multiple times with faster timing
        for (let i = 0; i < 15; i++) {
          setTimeout(refreshRewards, i * 100);
        }
      }
    };
    
    window.addEventListener('catalog_action', handleCatalogAction);
    window.addEventListener('card_reward_update', handleRefreshEvent);
    
    // Also listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'catalogUserRewards' || e.key === 'lastRewardUpdate' || 
          e.key === `user_${currentUser.id}_last_reward`) {
        console.log("RewardsCounter: Storage event detected for rewards", e);
        refreshRewards();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Refresh on regular intervals, more frequently initially
    const immediateIntervalId = setInterval(refreshRewards, 150); // Much faster initial refresh
    
    // After 10 seconds, switch to a less frequent refresh
    const timeoutId = setTimeout(() => {
      clearInterval(immediateIntervalId);
      const regularIntervalId = setInterval(refreshRewards, 1500); // Faster ongoing refresh
      
      return () => {
        clearInterval(regularIntervalId);
      };
    }, 10000);
    
    return () => {
      window.removeEventListener('refreshRewards', handleRefreshEvent);
      window.removeEventListener('realtime_rewards_update', handleRealTimeUpdate);
      window.removeEventListener('catalog_action', handleCatalogAction);
      window.removeEventListener('card_reward_update', handleRefreshEvent);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(immediateIntervalId);
      clearTimeout(timeoutId);
    };
  }, [currentUser, refreshRewards, points]);
  
  // Additional interval to periodically force a refresh from localStorage
  useEffect(() => {
    if (!currentUser) return;
    
    const checkStorageChanges = () => {
      const lastUpdateTime = localStorage.getItem('lastRewardUpdate');
      const userSpecificTimestamp = localStorage.getItem(`user_${currentUser.id}_last_reward`);
      
      // If there's been an update since our last check
      if (lastUpdateTime !== lastUpdateRef.current || 
          userSpecificTimestamp !== lastUpdateRef.current) {
        console.log(`RewardsCounter: Detected localStorage update, refreshing`);
        lastUpdateRef.current = lastUpdateTime;
        
        // Direct check from localStorage
        const rewardsData = localStorage.getItem('catalogUserRewards');
        if (rewardsData) {
          try {
            const rewards = JSON.parse(rewardsData);
            const storedPoints = rewards[currentUser.id] || 0;
            
            if (storedPoints !== points) {
              console.log(`RewardsCounter: Storage check detected change: ${points} → ${storedPoints}`);
              setPoints(storedPoints);
              setTier(getUserRewardTier(storedPoints));
              
              // Animate if points increased
              if (storedPoints > points) {
                animateRef.current = true;
                setTimeout(() => {
                  animateRef.current = false;
                }, 2000);
              }
            }
          } catch (error) {
            console.error("Error parsing rewards data:", error);
          }
        }
      }
    };
    
    // Check for storage changes more frequently for better responsiveness
    const storageCheckInterval = setInterval(checkStorageChanges, 150);
    
    return () => clearInterval(storageCheckInterval);
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
