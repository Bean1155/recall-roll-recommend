
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from '@/components/ui/menubar';
import { toast } from '@/components/ui/use-toast';

const SettingsMenu = () => {
  const { userName, setUserName } = useUser();
  const [newName, setNewName] = useState(userName);

  const handleSaveName = () => {
    if (newName.trim()) {
      setUserName(newName.trim());
      toast({
        title: 'Settings Updated',
        description: 'Your name has been updated successfully!'
      });
    }
  };

  return (
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
            </div>
          </div>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default SettingsMenu;
