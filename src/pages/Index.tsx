
import React, { useState, useEffect } from "react";
import GridLayout from "@/components/GridLayout";
import { 
  Utensils, 
  Film, 
  Plus,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import LaunchScreen from "@/components/LaunchScreen";
import OnboardingScreen from "@/components/onboarding/OnboardingScreen";
import { useUser } from "@/contexts/UserContext";

const Index = () => {
  const { currentUser } = useUser();
  const [showLaunch, setShowLaunch] = useState(false);
  
  const currentDate = new Date();
  const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

  // Check if the user has seen the launch screen before
  useEffect(() => {
    const hasSeenLaunch = localStorage.getItem("hasSeenLaunch");
    if (!hasSeenLaunch && !currentUser.email) {
      setShowLaunch(true);
    }
  }, [currentUser]);

  return (
    <>
      {/* Show onboarding screen */}
      <OnboardingScreen />
      
      {showLaunch && <LaunchScreen onClose={() => setShowLaunch(false)} />}
      <GridLayout>
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-black font-typewriter">TOTAL RECALL CATALOG</h1>
          <p className="text-xl text-vintage-red font-typewriter">Tracking Every Bite and Blockbuster</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Bites Card */}
          <div className="border rounded-lg overflow-hidden border-catalog-softBrown shadow-lg transform hover:scale-[1.02] transition-transform duration-300"
            style={{
              boxShadow: "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px"
            }}>
            <div className="bg-[#FFDEE2] p-4 text-center">
              <h2 className="text-2xl font-bold text-[#5D4037] font-typewriter">BITES</h2>
            </div>
            
            <div className="grid grid-cols-3 border-b border-catalog-softBrown">
              <div className="border-r border-catalog-softBrown py-16"></div>
              <div className="border-r border-catalog-softBrown py-16 flex justify-center items-center">
                <Utensils size={60} className="text-[#333333]" />
              </div>
              <div className="py-16"></div>
            </div>
            
            <Link to="/search?type=food" className="grid grid-cols-3 border-b border-catalog-softBrown hover:bg-catalog-cream">
              <div className="border-r border-catalog-softBrown py-8 flex items-center justify-center">
                <Search size={24} className="text-vintage-red" />
              </div>
              <div className="border-r border-catalog-softBrown py-8 col-span-2 flex items-center pl-6">
                <span className="font-script text-3xl text-vintage-red">Browse</span>
              </div>
            </Link>
            
            <Link to="/create/food" className="grid grid-cols-3 border-b border-catalog-softBrown hover:bg-catalog-cream">
              <div className="border-r border-catalog-softBrown py-8 flex items-center justify-center">
                <Plus size={24} className="text-[#3A7D44]" />
              </div>
              <div className="border-r border-catalog-softBrown py-8 col-span-2 flex items-center pl-6">
                <span className="font-script text-3xl text-[#3A7D44]">Add New</span>
              </div>
            </Link>
            
            <div className="grid grid-cols-3 border-b border-catalog-softBrown">
              <div className="border-r border-catalog-softBrown py-4 flex items-center justify-end pr-2">
                <span className="text-sm text-gray-600">Last updated:</span>
              </div>
              <div className="border-r border-catalog-softBrown py-4 col-span-2 flex items-center pl-4">
                <span className="text-sm text-gray-600">{formattedDate}</span>
              </div>
            </div>
          </div>
          
          {/* Blockbusters Card */}
          <div className="border rounded-lg overflow-hidden border-catalog-softBrown shadow-lg transform hover:scale-[1.02] transition-transform duration-300"
            style={{
              boxShadow: "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px"
            }}>
            <div className="bg-[#D3E4FD] p-4 text-center">
              <h2 className="text-2xl font-bold text-[#5D4037] font-typewriter">BLOCKBUSTERS</h2>
            </div>
            
            <div className="grid grid-cols-3 border-b border-catalog-softBrown">
              <div className="border-r border-catalog-softBrown py-16"></div>
              <div className="border-r border-catalog-softBrown py-16 flex justify-center items-center">
                <Film size={60} className="text-[#333333]" />
              </div>
              <div className="py-16"></div>
            </div>
            
            <Link to="/search?type=entertainment" className="grid grid-cols-3 border-b border-catalog-softBrown hover:bg-catalog-cream">
              <div className="border-r border-catalog-softBrown py-8 flex items-center justify-center">
                <Search size={24} className="text-vintage-red" />
              </div>
              <div className="border-r border-catalog-softBrown py-8 col-span-2 flex items-center pl-6">
                <span className="font-script text-3xl text-vintage-red">Browse</span>
              </div>
            </Link>
            
            <Link to="/create/entertainment" className="grid grid-cols-3 border-b border-catalog-softBrown hover:bg-catalog-cream">
              <div className="border-r border-catalog-softBrown py-8 flex items-center justify-center">
                <Plus size={24} className="text-[#3A7D44]" />
              </div>
              <div className="border-r border-catalog-softBrown py-8 col-span-2 flex items-center pl-6">
                <span className="font-script text-3xl text-[#3A7D44]">Add New</span>
              </div>
            </Link>
            
            <div className="grid grid-cols-3 border-b border-catalog-softBrown">
              <div className="border-r border-catalog-softBrown py-4 flex items-center justify-end pr-2">
                <span className="text-sm text-gray-600">Last updated:</span>
              </div>
              <div className="border-r border-catalog-softBrown py-4 col-span-2 flex items-center pl-4">
                <span className="text-sm text-gray-600">{formattedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </GridLayout>
    </>
  );
};

export default Index;
