
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const NotificationSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [newRecommendations, setNewRecommendations] = useState(true);
  const [friendActivity, setFriendActivity] = useState(true);
  const [appUpdates, setAppUpdates] = useState(true);
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-catalog-teal">Notification Preferences</h2>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-base font-medium">Notification Channels</h3>
          
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications" className="text-sm font-medium">
                Email Notifications
              </Label>
              <p className="text-xs text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications" className="text-sm font-medium">
                Push Notifications
              </Label>
              <p className="text-xs text-muted-foreground">
                Receive notifications on your device
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>
        </div>
        
        <div className="space-y-3 pt-3 border-t border-gray-200">
          <h3 className="text-base font-medium">Notification Types</h3>
          
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="new-recommendations" className="text-sm font-medium">
                New Recommendations
              </Label>
              <p className="text-xs text-muted-foreground">
                When someone recommends you a bite or blockbuster
              </p>
            </div>
            <Switch
              id="new-recommendations"
              checked={newRecommendations}
              onCheckedChange={setNewRecommendations}
            />
          </div>
          
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div className="space-y-0.5">
              <Label htmlFor="friend-activity" className="text-sm font-medium">
                Friend Activity
              </Label>
              <p className="text-xs text-muted-foreground">
                When friends add new items to their catalog
              </p>
            </div>
            <Switch
              id="friend-activity"
              checked={friendActivity}
              onCheckedChange={setFriendActivity}
            />
          </div>
          
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div className="space-y-0.5">
              <Label htmlFor="app-updates" className="text-sm font-medium">
                App Updates
              </Label>
              <p className="text-xs text-muted-foreground">
                New features and improvements
              </p>
            </div>
            <Switch
              id="app-updates"
              checked={appUpdates}
              onCheckedChange={setAppUpdates}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
