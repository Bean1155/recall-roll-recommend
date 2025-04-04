
import React, { useEffect, useState } from "react";
import { getAllUserRewards, getUserRewardTier } from "@/lib/data";
import { appUsers } from "@/contexts/UserContext";
import { Separator } from "@/components/ui/separator";
import { Trophy, Medal, Award, RefreshCw } from "lucide-react";
import { forceRewardsRefresh } from "@/utils/rewardUtils";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

const LeaderboardTab = () => {
  const [rewardsData, setRewardsData] = useState<Record<string, number>>({});
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());
  const { currentUser } = useUser();
  const [loading, setLoading] = useState(false);

  // Function to refresh leaderboard data
  const refreshLeaderboard = () => {
    console.log("LeaderboardTab: Refreshing leaderboard data");
    
    // Show loading state
    setLoading(true);
    
    // Direct check from localStorage for maximum reliability
    try {
      const rewardsDataStr = localStorage.getItem('catalogUserRewards');
      if (rewardsDataStr) {
        const rewards = JSON.parse(rewardsDataStr);
        console.log("LeaderboardTab: Direct localStorage check:", rewards);
        setRewardsData(rewards);
      } else {
        console.log("LeaderboardTab: No rewards data in localStorage, using API");
        const rewards = getAllUserRewards();
        setRewardsData(rewards);
      }
    } catch (e) {
      console.error("Error parsing localStorage rewards:", e);
      // Fallback to API
      const rewards = getAllUserRewards();
      setRewardsData(rewards);
    }
    
    setLastUpdated(new Date().toLocaleTimeString());
    setLoading(false);
    
    // Display current user points in console for debugging
    if (currentUser) {
      const userPoints = rewardsData[currentUser.id] || 0;
      console.log(`LeaderboardTab: Current user (${currentUser.id}) has ${userPoints} points`);
    }
  };

  // Initial load and set up refresh interval
  useEffect(() => {
    // Initial refresh
    refreshLeaderboard();
    forceRewardsRefresh();
    
    // Set up listeners for reward updates with debouncing
    let refreshTimeout: number | null = null;
    
    const handleRewardUpdate = () => {
      console.log("LeaderboardTab: Detected reward update event");
      
      // Clear any existing timeout
      if (refreshTimeout) {
        window.clearTimeout(refreshTimeout);
      }
      
      // Set a new timeout to debounce rapid updates
      refreshTimeout = window.setTimeout(() => {
        refreshLeaderboard();
      }, 300);
    };
    
    // Listen for ALL possible reward-related events
    window.addEventListener('refreshRewards', handleRewardUpdate);
    window.addEventListener('card_reward_update', handleRewardUpdate);
    window.addEventListener('realtime_rewards_update', handleRewardUpdate);
    window.addEventListener('catalog_action', (e) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.action === 'card_added' || 
          customEvent.detail?.action === 'recommendation_added') {
        console.log(`LeaderboardTab: Detected ${customEvent.detail.action} event`);
        handleRewardUpdate();
      }
    });
    
    // Also refresh on storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'catalogUserRewards' || e.key === 'lastRewardUpdate' ||
          e.key?.startsWith('user_') && e.key?.endsWith('_last_reward')) {
        console.log("LeaderboardTab: Storage event detected for rewards");
        handleRewardUpdate();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Regular interval refresh with longer timeout
    const intervalId = setInterval(refreshLeaderboard, 10000); // Reduced from 2000ms to 10000ms
    
    return () => {
      window.removeEventListener('refreshRewards', handleRewardUpdate);
      window.removeEventListener('card_reward_update', handleRewardUpdate);
      window.removeEventListener('realtime_rewards_update', handleRewardUpdate);
      window.removeEventListener('catalog_action', handleRewardUpdate);
      window.removeEventListener('storage', handleStorageChange);
      if (refreshTimeout) {
        window.clearTimeout(refreshTimeout);
      }
      clearInterval(intervalId);
    };
  }, []);

  // Create sorted leaderboard data
  const leaderboardEntries = Object.entries(rewardsData)
    .map(([userId, points]) => {
      const user = appUsers.find(user => user.id === userId);
      return {
        userId,
        userName: user?.name || 'Unknown User',
        points,
        tier: getUserRewardTier(points),
        isCurrentUser: currentUser?.id === userId
      };
    })
    .sort((a, b) => b.points - a.points);
    
  // Force a manual refresh with visual feedback
  const handleManualRefresh = () => {
    setLoading(true);
    toast({
      title: "Refreshing leaderboard...",
      description: "Getting the latest points data",
    });
    
    // Force multiple refreshes
    forceRewardsRefresh();
    
    setTimeout(() => {
      refreshLeaderboard();
      setLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-500 h-5 w-5" />
          <h3 className="font-bold">Live Leaderboard</h3>
        </div>
        <button 
          onClick={handleManualRefresh}
          className={`text-xs bg-catalog-cream px-2 py-1 rounded hover:bg-catalog-teal hover:text-white transition-colors flex items-center gap-1 ${loading ? 'opacity-70' : ''}`}
          disabled={loading}
        >
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          Refresh Now
        </button>
      </div>
      
      <p className="text-xs text-catalog-softBrown">Last updated: {lastUpdated}</p>
      
      <div className="bg-white rounded-md shadow p-3">
        {leaderboardEntries.length > 0 ? (
          <div className="space-y-3">
            {leaderboardEntries.map((entry, index) => (
              <div 
                key={entry.userId} 
                className={`flex items-center justify-between p-2 ${
                  entry.isCurrentUser 
                    ? 'bg-yellow-50 border border-yellow-200 rounded-md' 
                    : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  {index === 0 && <Medal className="text-yellow-500 h-5 w-5" />}
                  {index === 1 && <Medal className="text-gray-400 h-5 w-5" />}
                  {index === 2 && <Medal className="text-amber-700 h-5 w-5" />}
                  {index > 2 && <span className="w-5 text-center text-xs">{index + 1}</span>}
                  <span className={`font-medium ${entry.isCurrentUser ? 'font-bold' : ''}`}>
                    {entry.isCurrentUser ? `${entry.userName} (You)` : entry.userName}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm bg-catalog-cream px-2 py-0.5 rounded">{entry.tier}</span>
                  <span className={`font-bold ${entry.isCurrentUser ? 'text-yellow-600' : ''}`}>
                    {entry.points}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-catalog-softBrown">
            No rewards data available yet. Try adding cards or making recommendations!
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-2 border-t border-catalog-softBrown/20">
        <p className="text-sm text-center font-typewriter">
          <Award className="inline h-4 w-4 mr-1" />
          Add more cards and share recommendations to earn points!
        </p>
      </div>
    </div>
  );
};

export default LeaderboardTab;
