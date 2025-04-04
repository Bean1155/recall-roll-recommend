
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, Menu, Notebook, Settings, User, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavBar from "./NavBar";
import { Toaster } from "@/components/ui/toaster";
import RewardsCounter from "./RewardsCounter";
import { useEffect } from "react";
import { ensureUserHasRewards, forceRewardsRefresh, addPointsForCardCreation } from "@/utils/rewardUtils";

const Header = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  
  // Initialize user rewards when header loads
  useEffect(() => {
    if (currentUser?.id) {
      console.log("Header: Initializing rewards for user", currentUser.id);
      ensureUserHasRewards(currentUser.id);
      
      // Force a refresh of rewards immediately and then dispatch event
      forceRewardsRefresh();
      
      // Dispatch a custom event to ensure all components know rewards should update
      window.dispatchEvent(new CustomEvent('rewards_init_complete', { 
        detail: { userId: currentUser.id, timestamp: Date.now() } 
      }));
    }
  }, [currentUser]);
  
  // Listen for card creation events
  useEffect(() => {
    const handleCardCreationEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.action === 'card_added' && currentUser) {
        console.log("Header detected card_added event, adding points");
        addPointsForCardCreation(currentUser.id, customEvent.detail.cardType || 'unknown');
      }
    };
    
    window.addEventListener('catalog_action', handleCardCreationEvent);
    
    return () => {
      window.removeEventListener('catalog_action', handleCardCreationEvent);
    };
  }, [currentUser]);
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  return (
    <>
      <header className="bg-white border-b border-catalog-softBrown sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
          {/* Logo area */}
          <Link to="/" className="flex items-center space-x-1 sm:space-x-2">
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-catalog-teal" />
            <span className="font-typewriter text-catalog-teal font-bold text-lg sm:text-xl">Catalog</span>
          </Link>
          
          {/* Rewards counter in header */}
          <div className="flex items-center">
            <Link to="/rewards" className="mr-2">
              <RewardsCounter variant="compact" />
            </Link>
          </div>
          
          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation('/bites')}
              className="text-catalog-softBrown hover:text-catalog-teal"
            >
              <Notebook className="h-5 w-5 mr-1" />
              Bites
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation('/blockbusters')}
              className="text-catalog-softBrown hover:text-catalog-teal"
            >
              <Notebook className="h-5 w-5 mr-1" />
              Blockbusters
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation('/rewards')}
              className="text-catalog-softBrown hover:text-catalog-teal"
            >
              <Award className="h-5 w-5 mr-1" />
              Rewards
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation('/settings')}
              className="text-catalog-softBrown hover:text-catalog-teal"
            >
              <Settings className="h-5 w-5 mr-1" />
              Settings
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation('/profile')}
              className="text-catalog-softBrown hover:text-catalog-teal"
            >
              <User className="h-5 w-5 mr-1" />
              {currentUser?.name || 'Profile'}
            </Button>
          </div>
          
          {/* Mobile menu - Fixed to ensure the Sheet opens properly */}
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden relative z-10 flex items-center justify-center"
              >
                <Menu className="h-5 w-5 text-catalog-softBrown" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-white w-[80%] max-w-[300px] p-4">
              <div className="flex flex-col space-y-4 mt-8">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation('/bites')}
                  className="justify-start text-catalog-softBrown hover:text-catalog-teal w-full px-4"
                >
                  <Notebook className="h-5 w-5 mr-2" />
                  Bites
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation('/blockbusters')}
                  className="justify-start text-catalog-softBrown hover:text-catalog-teal w-full px-4"
                >
                  <Notebook className="h-5 w-5 mr-2" />
                  Blockbusters
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation('/rewards')}
                  className="justify-start text-catalog-softBrown hover:text-catalog-teal w-full px-4"
                >
                  <Award className="h-5 w-5 mr-2" />
                  Rewards
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation('/settings')}
                  className="justify-start text-catalog-softBrown hover:text-catalog-teal w-full px-4"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Settings
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation('/profile')}
                  className="justify-start text-catalog-softBrown hover:text-catalog-teal w-full px-4"
                >
                  <User className="h-5 w-5 mr-2" />
                  {currentUser?.name || 'Profile'}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      
      <Toaster />
    </>
  );
};

export default Header;
