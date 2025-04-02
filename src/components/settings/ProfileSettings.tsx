
import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UploadCloud } from "lucide-react";

export const ProfileSettings = () => {
  const { userName, setUserName } = useUser();
  const [name, setName] = useState(userName);
  const [bio, setBio] = useState("Food and movie enthusiast");
  const [displayImage, setDisplayImage] = useState("https://i.pravatar.cc/150?img=32");

  useEffect(() => {
    // Update name if userName changes in context
    setName(userName);
  }, [userName]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-catalog-teal">Profile Information</h2>
      
      <div className="flex flex-col md:flex-row gap-6 md:items-center">
        <div className="flex flex-col items-center gap-3">
          <Avatar className="w-24 h-24 border-2 border-catalog-teal">
            <AvatarImage src={displayImage} />
            <AvatarFallback>{userName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          
          <Button variant="outline" size="sm" className="text-xs">
            <UploadCloud className="h-3 w-3 mr-1" />
            Change Photo
          </Button>
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input 
              id="displayName" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="catalog-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              className="catalog-input resize-none" 
              placeholder="Tell us about yourself..." 
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
