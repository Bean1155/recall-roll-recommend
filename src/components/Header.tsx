
import { Link } from "react-router-dom";
import { Archive, Book, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-catalog-manila border-b border-catalog-softBrown py-4">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <Link to="/" className="flex items-center mb-4 md:mb-0">
          <img 
            src="/lovable-uploads/b1c69d28-6949-4945-8501-dcc72236d701.png" 
            alt="Total Recall Catalog Logo" 
            className="h-16 w-auto"
          />
        </Link>
        
        <nav className="flex gap-2">
          <Button asChild variant="outline" className="bg-catalog-cream border-catalog-softBrown">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="bg-catalog-pink border-catalog-softBrown">
            <Link to="/bites">
              <Archive className="mr-2 h-4 w-4" />
              Bites
            </Link>
          </Button>
          <Button asChild variant="outline" className="bg-catalog-blue border-catalog-softBrown">
            <Link to="/blockbusters">
              <Book className="mr-2 h-4 w-4" />
              Blockbusters
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
