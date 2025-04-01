
import React from "react";
import GridLayout from "@/components/GridLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Settings } from "lucide-react";

const ProfilePage = () => {
  return (
    <GridLayout title="My Profile">
      <div className="max-w-md mx-auto catalog-card p-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24 border-2 border-catalog-teal">
            <AvatarImage src="https://i.pravatar.cc/150?img=32" />
            <AvatarFallback>TR</AvatarFallback>
          </Avatar>
          
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Jane Doe</h2>
            <p className="text-catalog-softBrown">Member since May 2023</p>
          </div>
          
          <div className="catalog-line w-full"></div>
          
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="text-center">
              <div className="text-2xl font-semibold text-catalog-teal">24</div>
              <div className="text-sm text-catalog-softBrown">Bites</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-catalog-teal">18</div>
              <div className="text-sm text-catalog-softBrown">Blockbusters</div>
            </div>
          </div>
          
          <div className="catalog-line w-full"></div>
          
          <div className="flex gap-4 w-full">
            <Button className="flex-1" variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            <Button className="flex-1" variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </GridLayout>
  );
};

export default ProfilePage;
