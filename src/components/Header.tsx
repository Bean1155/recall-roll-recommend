
import { Link } from "react-router-dom";
import { FileText, Utensils, Clapperboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import SettingsMenu from "@/components/SettingsMenu";

const Header = () => {
  return (
    <header className="bg-catalog-manila border-b border-catalog-softBrown py-4">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/fafe4c18-7a01-4f90-8483-06834c0e1170.png" 
              alt="Total Recall Catalog Logo" 
              className="h-16 w-16 rounded-full object-cover"
            />
          </Link>
          <div className="ml-3">
            <SettingsMenu />
          </div>
        </div>
        
        <nav className="flex gap-2">
          <Button asChild variant="outline" className="bg-catalog-cream border-catalog-softBrown">
            <Link to="/">
              <FileText className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="bg-catalog-pink border-catalog-softBrown">
            <Link to="/bites">
              <Utensils className="mr-2 h-4 w-4" />
              Bites
            </Link>
          </Button>
          <Button asChild variant="outline" className="bg-catalog-blue border-catalog-softBrown">
            <Link to="/blockbusters">
              <Clapperboard className="mr-2 h-4 w-4" />
              Blockbusters
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
