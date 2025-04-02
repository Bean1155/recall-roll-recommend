
import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { SharingSettings } from "@/components/settings/SharingSettings";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { userName } = useUser();
  const [activeTab, setActiveTab] = useState("profile");
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-catalog-manila pb-20">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5 text-catalog-softBrown" />
            </Button>
            <h1 className="text-2xl font-bold text-catalog-teal">Settings</h1>
          </div>
          <Button 
            className="bg-catalog-teal hover:bg-catalog-darkTeal"
            onClick={handleSaveSettings}
          >
            Save Changes
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border border-catalog-softBrown/20">
          <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="sharing">Sharing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <ProfileSettings />
            </TabsContent>
            
            <TabsContent value="account" className="space-y-6">
              <AccountSettings />
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6">
              <NotificationSettings />
            </TabsContent>
            
            <TabsContent value="sharing" className="space-y-6">
              <SharingSettings />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <NavBar />
    </div>
  );
};

export default SettingsPage;
