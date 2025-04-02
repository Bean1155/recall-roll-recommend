
import React from "react";
import GridLayout from "@/components/GridLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Settings, Share2, BookmarkPlus } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { getCardsByType } from "@/lib/data";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { userName, profile } = useUser();
  
  // Get stats for the user's cards
  const bites = getCardsByType('food');
  const blockbusters = getCardsByType('entertainment');

  return (
    <GridLayout title="My Profile">
      <div className="max-w-md mx-auto catalog-card p-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24 border-2 border-catalog-teal">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback>{userName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          
          <div className="text-center">
            <h2 className="text-2xl font-semibold">{userName}</h2>
            <p className="text-catalog-softBrown">{profile.bio}</p>
          </div>
          
          <div className="catalog-line w-full"></div>
          
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="text-center">
              <div className="text-2xl font-semibold text-catalog-teal">{bites.length}</div>
              <div className="text-sm text-catalog-softBrown">Bites</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-catalog-teal">{blockbusters.length}</div>
              <div className="text-sm text-catalog-softBrown">Blockbusters</div>
            </div>
          </div>
          
          <div className="catalog-line w-full"></div>
          
          <div className="flex flex-wrap gap-3 w-full">
            <Button 
              className="flex-1" 
              variant="outline"
              onClick={() => navigate('/settings')}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            <Button 
              className="flex-1" 
              variant="outline"
              onClick={() => navigate('/settings')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
        
        {profile.isRegistered ? (
          <Card className="mt-6 border border-catalog-softBrown/10">
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto py-3 justify-start" onClick={() => navigate('/collections')}>
                  <BookmarkPlus className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="text-sm font-medium">My Collections</div>
                    <div className="text-xs text-muted-foreground">View saved items</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto py-3 justify-start" onClick={() => navigate('/recommend')}>
                  <Share2 className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="text-sm font-medium">Share</div>
                    <div className="text-xs text-muted-foreground">Recommend to friends</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-6 p-4 bg-catalog-manila/50 rounded-md border border-catalog-softBrown/10">
            <h3 className="font-medium mb-2">Create an Account</h3>
            <p className="text-sm text-catalog-softBrown mb-3">
              Sign up to save your catalog and access it from anywhere.
            </p>
            <Button 
              className="w-full bg-catalog-teal hover:bg-catalog-darkTeal"
              onClick={() => navigate('/settings')}
            >
              Sign Up Now
            </Button>
          </div>
        )}
      </div>
    </GridLayout>
  );
};

export default ProfilePage;
