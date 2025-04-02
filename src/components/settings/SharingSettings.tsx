
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const SharingSettings = () => {
  const [publicProfile, setPublicProfile] = useState(true);
  const [shareCards, setShareCards] = useState(true);
  const [defaultSharingPermission, setDefaultSharingPermission] = useState("friends");
  
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
              onCheckedChange={setPublicProfile}
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
              onCheckedChange={setShareCards}
            />
          </div>
        </div>
        
        <div className="space-y-3 pt-3 border-t border-gray-200">
          <h3 className="text-base font-medium">Default Sharing Permissions</h3>
          
          <RadioGroup 
            value={defaultSharingPermission} 
            onValueChange={setDefaultSharingPermission}
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
