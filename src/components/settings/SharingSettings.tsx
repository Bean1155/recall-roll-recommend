
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUser } from "@/contexts/UserContext";

export const SharingSettings = () => {
  const { sharingSettings, updateSharingSettings } = useUser();
  const { publicProfile, shareCards, defaultPermission, allowNoteUpdates, autoReceiveNotes } = sharingSettings;
  
  const handleSwitchChange = (field: string) => (checked: boolean) => {
    updateSharingSettings({ [field]: checked });
  };
  
  const handlePermissionChange = (value: string) => {
    updateSharingSettings({ defaultPermission: value as 'public' | 'friends' | 'private' });
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-catalog-teal">Sharing & Privacy</h2>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-base font-medium">Profile Visibility</h3>
          
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="public-profile" className="text-sm font-medium">
                Public Profile
              </Label>
              <p className="text-xs text-muted-foreground">
                Make your profile visible to other app users
              </p>
            </div>
            <Switch
              id="public-profile"
              checked={publicProfile}
              onCheckedChange={handleSwitchChange('publicProfile')}
            />
          </div>
          
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div className="space-y-0.5">
              <Label htmlFor="share-cards" className="text-sm font-medium">
                Share Cards with Community
              </Label>
              <p className="text-xs text-muted-foreground">
                Allow your cards to be visible in public collections
              </p>
            </div>
            <Switch
              id="share-cards"
              checked={shareCards}
              onCheckedChange={handleSwitchChange('shareCards')}
            />
          </div>
          
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div className="space-y-0.5">
              <Label htmlFor="allow-note-updates" className="text-sm font-medium">
                Allow Note Updates
              </Label>
              <p className="text-xs text-muted-foreground">
                Allow others to add notes to your cards when you share them
              </p>
            </div>
            <Switch
              id="allow-note-updates"
              checked={allowNoteUpdates}
              onCheckedChange={handleSwitchChange('allowNoteUpdates')}
            />
          </div>
          
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div className="space-y-0.5">
              <Label htmlFor="auto-receive-notes" className="text-sm font-medium">
                Auto-Receive Recommendation Notes
              </Label>
              <p className="text-xs text-muted-foreground">
                Automatically add notes from recommendations to your cards in real-time
              </p>
            </div>
            <Switch
              id="auto-receive-notes"
              checked={autoReceiveNotes}
              onCheckedChange={handleSwitchChange('autoReceiveNotes')}
            />
          </div>
        </div>
        
        <div className="space-y-3 pt-3 border-t border-gray-200">
          <h3 className="text-base font-medium">Default Sharing Permissions</h3>
          
          <RadioGroup 
            value={defaultPermission} 
            onValueChange={handlePermissionChange}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="public" />
              <Label htmlFor="public" className="text-sm font-medium">
                Public - Anyone can see
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="friends" id="friends" />
              <Label htmlFor="friends" className="text-sm font-medium">
                Friends Only - Only people you've connected with
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="private" />
              <Label htmlFor="private" className="text-sm font-medium">
                Private - Only you can see
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="pt-3 border-t border-gray-200">
          <div className="rounded-md bg-amber-50 p-3 border border-amber-200">
            <p className="text-sm text-amber-800">
              By using our app and sharing content, you agree to our Terms of Service and Privacy Policy. 
              We respect your privacy and will never share your personal information without your consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
