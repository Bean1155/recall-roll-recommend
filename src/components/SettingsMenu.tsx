
import React, { useState } from 'react';
import { Settings, Stamp, Presentation } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from '@/components/ui/menubar';
import { toast } from '@/components/ui/use-toast';
import LaunchScreen from './LaunchScreen';
import OnboardingScreen from './onboarding/OnboardingScreen';

const SettingsMenu = () => {
  const { userName, setUserName } = useUser();
  const [newName, setNewName] = useState(userName);
  const [showLaunchScreen, setShowLaunchScreen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleSaveName = () => {
    if (newName.trim()) {
      setUserName(newName.trim());
      toast({
        title: 'Settings Updated',
        description: 'Your name has been updated successfully!'
      });
    }
  };

  const handleShowLaunchScreen = () => {
    setShowLaunchScreen(true);
  };

  const handleShowOnboarding = () => {
    // Remove the flag from localStorage to make the onboarding show
    localStorage.removeItem("hasSeenOnboarding");
    setShowOnboarding(true);
  };

  return (
    <>
      {showLaunchScreen && (
        <LaunchScreen 
          forcedOpen={true} 
          onClose={() => setShowLaunchScreen(false)} 
        />
      )}
      
      {showOnboarding && (
        <OnboardingScreen 
          forcedOpen={true}
          onClose={() => setShowOnboarding(false)} 
        />
      )}
      
      <Menubar className="border-none bg-transparent p-0">
        <MenubarMenu>
          <MenubarTrigger className="p-1 data-[state=open]:bg-catalog-softBrown/20 rounded-md">
            <Settings size={20} className="text-catalog-softBrown" />
          </MenubarTrigger>
          <MenubarContent className="bg-white border border-catalog-softBrown min-w-[300px]">
            <div className="p-4">
              <h3 className="font-bold mb-4 text-catalog-softBrown">Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="userName" className="text-sm font-medium block mb-1">
                    Your Name
                  </label>
                  <Input
                    id="userName"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter your name"
                    className="catalog-input"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Your name will appear in the catalog header
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveName}
                    className="bg-catalog-teal hover:bg-catalog-darkTeal"
                    size="sm"
                  >
                    Save Settings
                  </Button>
                </div>
                
                <MenubarSeparator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Developer Options</h4>
                  <div className="space-y-2">
                    <Button 
                      onClick={handleShowLaunchScreen}
                      variant="outline" 
                      size="sm"
                      className="w-full border-dashed border-catalog-softBrown flex items-center justify-center gap-2"
                    >
                      <Stamp size={16} />
                      Preview Launch Screen
                    </Button>
                    <Button 
                      onClick={handleShowOnboarding}
                      variant="outline" 
                      size="sm"
                      className="w-full border-dashed border-catalog-softBrown flex items-center justify-center gap-2"
                    >
                      <Presentation size={16} />
                      Preview Onboarding
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      View and test the app's onboarding experiences
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </>
  );
};

export default SettingsMenu;
