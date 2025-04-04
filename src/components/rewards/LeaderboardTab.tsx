
import React, { useEffect, useState } from "react";
import { getAllUserRewards, getUserRewardTier } from "@/lib/data";
import { appUsers } from "@/contexts/UserContext";
import { Separator } from "@/components/ui/separator";
import { Trophy, Medal, Award } from "lucide-react";
import { forceRewardsRefresh } from "@/utils/rewardUtils";

const LeaderboardTab = () => {
  const [rewardsData, setRewardsData] = useState<Record<string, number>>({});
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());

  // Function to refresh leaderboard data
  const refreshLeaderboard = () => {
    console.log("LeaderboardTab: Refreshing leaderboard data");
    const rewards = getAllUserRewards();
    setRewardsData(rewards);
    setLastUpdated(new Date().toLocaleTimeString());
    
    // This will help debug if we're getting data
    console.log("LeaderboardTab: Current rewards data:", rewards);
  };

  // Initial load and set up refresh interval
  useEffect(() => {
    // Initial refresh
    refreshLeaderboard();
    forceRewardsRefresh();
    
    // Aggressive initial refreshing
    const delays = [100, 300, 500, 1000, 2000, 3000];
    delays.forEach(delay => {
      setTimeout(refreshLeaderboard, delay);
    });

    // Set up listeners for reward updates
    const handleRewardUpdate = () => {
      console.log("LeaderboardTab: Detected reward update event");
      refreshLeaderboard();
    };
    
    window.addEventListener('refreshRewards', handleRewardUpdate);
    window.addEventListener('card_reward_update', handleRewardUpdate);
    window.addEventListener('catalog_action', (e) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.action === 'card_added') {
        console.log("LeaderboardTab: Detected card_added event");
        handleRewardUpdate();
      }
    });
    
    // Also refresh on storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'catalogUserRewards' || e.key === 'lastRewardUpdate') {
        console.log("LeaderboardTab: Storage event detected for rewards");
        refreshLeaderboard();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Regular interval refresh
    const intervalId = setInterval(refreshLeaderboard, 2000);
    
    return () => {
      window.removeEventListener('refreshRewards', handleRewardUpdate);
      window.removeEventListener('card_reward_update', handleRewardUpdate);
      window.removeEventListener('catalog_action', handleRewardUpdate);
      window.removeEventListener('storage', handleStorageChange);
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
        tier: getUserRewardTier(points)
      };
    })
    .sort((a, b) => b.points - a.points);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-500 h-5 w-5" />
          <h3 className="font-bold">Live Leaderboard</h3>
        </div>
        <button 
          onClick={() => {
            forceRewardsRefresh();
            refreshLeaderboard();
          }}
          className="text-xs bg-catalog-cream px-2 py-1 rounded hover:bg-catalog-teal hover:text-white transition-colors"
        >
          Refresh Now
        </button>
      </div>
      
      <p className="text-xs text-catalog-softBrown">Last updated: {lastUpdated}</p>
      
      <div className="bg-white rounded-md shadow p-3">
        {leaderboardEntries.length > 0 ? (
          <div className="space-y-3">
            {leaderboardEntries.map((entry, index) => (
              <div key={entry.userId} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {index === 0 && <Medal className="text-yellow-500 h-5 w-5" />}
                  {index === 1 && <Medal className="text-gray-400 h-5 w-5" />}
                  {index === 2 && <Medal className="text-amber-700 h-5 w-5" />}
                  {index > 2 && <span className="w-5 text-center text-xs">{index + 1}</span>}
                  <span className="font-medium">{entry.userName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm bg-catalog-cream px-2 py-0.5 rounded">{entry.tier}</span>
                  <span className="font-bold">{entry.points}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-catalog-softBrown">
            No rewards data available yet.
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
