
import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { SharingSettings } from "@/components/settings/SharingSettings";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const SettingsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userName } = useUser();
  const isMobile = useIsMobile();
  
  // Parse the tab from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get('tab');
  
  const [activeTab, setActiveTab] = useState(tabFromUrl || "profile");
  
  // Update the activeTab state if the URL changes
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);
  
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
            <TabsList className="grid grid-cols-4 mb-6 bg-gray-100 p-1.5">
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:bg-catalog-teal data-[state=active]:text-white"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="account" 
                className="data-[state=active]:bg-catalog-teal data-[state=active]:text-white"
              >
                Account
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="data-[state=active]:bg-catalog-teal data-[state=active]:text-white"
              >
                {isMobile ? "Alerts" : "Notifications"}
              </TabsTrigger>
              <TabsTrigger 
                value="sharing" 
                className="data-[state=active]:bg-catalog-teal data-[state=active]:text-white"
              >
                Sharing
              </TabsTrigger>
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
