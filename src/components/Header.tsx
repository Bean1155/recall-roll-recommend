
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, Menu, Notebook, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavBar from "./NavBar";
import RewardsCounter from "./RewardsCounter";

const Header = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  
  return (
    <header className="bg-white border-b border-catalog-softBrown sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo area */}
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-catalog-teal" />
          <span className="font-typewriter text-catalog-teal font-bold text-xl">Catalog</span>
        </Link>
        
        {/* Center area - Rewards Counter (new addition) */}
        <RewardsCounter variant="compact" className="hidden md:flex" />
        
        {/* Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/bites')}
            className="text-catalog-softBrown hover:text-catalog-teal"
          >
            <Notebook className="h-5 w-5 mr-1" />
            Bites
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/blockbusters')}
            className="text-catalog-softBrown hover:text-catalog-teal"
          >
            <Notebook className="h-5 w-5 mr-1" />
            Blockbusters
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/settings')}
            className="text-catalog-softBrown hover:text-catalog-teal"
          >
            <Settings className="h-5 w-5 mr-1" />
            Settings
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
            className="text-catalog-softBrown hover:text-catalog-teal"
          >
            <User className="h-5 w-5 mr-1" />
            {currentUser?.name || 'Profile'}
          </Button>
        </div>
        
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6 text-catalog-softBrown" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-white">
            <div className="flex flex-col space-y-4 mt-6">
              <NavBar />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
