
import { useEffect, useState, useRef } from "react";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UploadCloud } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export const ProfileSettings = () => {
  const { userName, setUserName, profile, updateProfile } = useUser();
  const [name, setName] = useState(userName);
  const [bio, setBio] = useState(profile.bio);
  const [displayImage, setDisplayImage] = useState(profile.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Update name if userName changes in context
    setName(userName);
    setBio(profile.bio);
    setDisplayImage(profile.avatar);
  }, [userName, profile.bio, profile.avatar]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  };

  const handleSaveChanges = () => {
    // Save name to user context
    setUserName(name);
    
    // Save bio and avatar to profile
    updateProfile({
      bio: bio,
      avatar: displayImage
    });
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved.",
    });
  };

  const handlePhotoClick = () => {
    // Programmatically click the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Convert the selected file to a data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setDisplayImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-catalog-teal">Profile Information</h2>
      
      <div className="flex flex-col md:flex-row gap-6 md:items-center">
        <div className="flex flex-col items-center gap-3">
          <Avatar className="w-24 h-24 border-2 border-catalog-teal">
            <AvatarImage src={displayImage} />
            <AvatarFallback>{name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={handlePhotoClick}
          >
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
              onChange={handleNameChange} 
              className="catalog-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              value={bio} 
              onChange={handleBioChange} 
              className="catalog-input resize-none" 
              placeholder="Tell us about yourself..." 
              rows={3}
            />
          </div>

          <Button 
            className="bg-catalog-teal hover:bg-catalog-darkTeal mt-2"
            onClick={handleSaveChanges}
          >
            Save Profile Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
