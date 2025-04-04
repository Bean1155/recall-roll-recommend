
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
import { useUser } from "@/contexts/UserContext";

const Index = () => {
  const { currentUser } = useUser();
  const [showLaunch, setShowLaunch] = useState(false);
  
  const currentDate = new Date();
  const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

  // Check if the user has seen the launch screen before
  useEffect(() => {
    const hasSeenLaunch = localStorage.getItem("hasSeenLaunch");
    if (!hasSeenLaunch && !currentUser) {
      setShowLaunch(true);
    }
  }, [currentUser]);

  return (
    <>
      {showLaunch && <LaunchScreen />}
      <GridLayout>
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-[#333333] font-typewriter">TOTAL RECALL CATALOG</h1>
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
            
            <Link to="/bites" className="grid grid-cols-3 border-b border-catalog-softBrown hover:bg-catalog-cream">
              <div className="border-r border-catalog-softBrown py-6 flex items-center justify-center">
                <Search size={20} className="text-vintage-red" />
              </div>
              <div className="border-r border-catalog-softBrown py-6 col-span-2 flex items-center pl-4">
                <span className="font-script text-2xl text-vintage-red">Browse</span>
              </div>
            </Link>
            
            <Link to="/create/food" className="grid grid-cols-3 border-b border-catalog-softBrown hover:bg-catalog-cream">
              <div className="border-r border-catalog-softBrown py-6 flex items-center justify-center">
                <Plus size={20} className="text-[#3A7D44]" />
              </div>
              <div className="border-r border-catalog-softBrown py-6 col-span-2 flex items-center pl-4">
                <span className="font-script text-2xl text-[#3A7D44]">Add New</span>
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
            
            <Link to="/blockbusters" className="grid grid-cols-3 border-b border-catalog-softBrown hover:bg-catalog-cream">
              <div className="border-r border-catalog-softBrown py-6 flex items-center justify-center">
                <Search size={20} className="text-vintage-red" />
              </div>
              <div className="border-r border-catalog-softBrown py-6 col-span-2 flex items-center pl-4">
                <span className="font-script text-2xl text-vintage-red">Browse</span>
              </div>
            </Link>
            
            <Link to="/create/entertainment" className="grid grid-cols-3 border-b border-catalog-softBrown hover:bg-catalog-cream">
              <div className="border-r border-catalog-softBrown py-6 flex items-center justify-center">
                <Plus size={20} className="text-[#3A7D44]" />
              </div>
              <div className="border-r border-catalog-softBrown py-6 col-span-2 flex items-center pl-4">
                <span className="font-script text-2xl text-[#3A7D44]">Add New</span>
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
        
        {/* How It Works Section */}
        <div className="border-2 border-catalog-softBrown rounded-lg shadow-lg mb-12 bg-white overflow-hidden transform hover:scale-[1.02] transition-transform duration-300" 
          style={{
            boxShadow: "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px"
          }}>
          <div className="bg-vintage-orange p-4 border-b-2 border-catalog-softBrown">
            <h2 className="text-2xl font-bold text-center font-typewriter text-[#4a3f35]">How It Works</h2>
          </div>
          
          <div className="p-8 relative bg-[#FCFCF7]">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#FF9999] opacity-70"></div>
            
            <div className="relative pl-12 pr-4" 
              style={{
                backgroundImage: `repeating-linear-gradient(#FCFCF7, #FCFCF7 30px, #ACC8E5 30px, #ACC8E5 31px)`,
                backgroundPosition: '0 10px',
                lineHeight: '31px',
                paddingTop: '10px'
              }}>
              
              <ol className="space-y-[31px] list-none relative z-10">
                <li className="flex items-start">
                  <span className="font-bold text-xl mr-4 text-vintage-red">1.</span>
                  <p className="text-xl">Create catalog cards for your favorite foods and entertainment.</p>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-xl mr-4 text-vintage-red">2.</span>
                  <p className="text-xl">Browse your personal collection to recall experiences.</p>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-xl mr-4 text-vintage-red">3.</span>
                  <p className="text-xl">Recommend items to friends by sharing your cards.</p>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-xl mr-4 text-vintage-red">4.</span>
                  <p className="text-xl">Track who recommended what to you and who you've shared with.</p>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-xl mr-4 text-vintage-red">5.</span>
                  <div>
                    <p className="text-xl">Collect and track points for sharing your cards and become a top Total Recall</p>
                    <p className="text-xl" style={{lineHeight: '31px'}}>Catalog Sharer!</p>
                  </div>
                </li>
              </ol>
              
              <div className="absolute left-2 top-[10%] h-6 w-6 rounded-full bg-white border-2 border-[#9E8979] shadow-inner"></div>
              <div className="absolute left-2 top-[50%] h-6 w-6 rounded-full bg-white border-2 border-[#9E8979] shadow-inner"></div>
              <div className="absolute left-2 bottom-[10%] h-6 w-6 rounded-full bg-white border-2 border-[#9E8979] shadow-inner"></div>
            </div>
          </div>
        </div>
      </GridLayout>
    </>
  );
};

export default Index;
