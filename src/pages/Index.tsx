
import React from "react";
import { Link } from "react-router-dom";
import GridLayout from "@/components/GridLayout";
import { Button } from "@/components/ui/button";
import { 
  Utensils, 
  Film, 
  Plus,
  Search 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const currentDate = new Date();
  const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

  return (
    <GridLayout>
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 text-[#333333] font-typewriter">TOTAL RECALL CATALOG</h1>
        <p className="text-xl text-vintage-red font-script">Tracking Every Bite and Blockbuster</p>
      </div>

      {/* Two column layout for Bites and Blockbusters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Bites Column */}
        <div className="border rounded-lg overflow-hidden border-catalog-softBrown">
          <div className="bg-vintage-pink p-4 text-center">
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
        
        {/* Blockbusters Column - Updated with the blue color to match nav bar */}
        <div className="border rounded-lg overflow-hidden border-catalog-softBrown">
          <div className="bg-blue-500 p-4 text-center">
            <h2 className="text-2xl font-bold text-white font-typewriter">BLOCKBUSTERS</h2>
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
      
      {/* How It Works Section - Updated with Card component for visual pop */}
      <Card className="border-2 border-catalog-softBrown rounded-lg shadow-lg mb-12 bg-catalog-cream hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-center mb-8 font-typewriter text-[#5D4037]">How It Works</h2>
          
          <ol className="space-y-6">
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
                <p className="text-xl">Catalog Sharer!</p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>
    </GridLayout>
  );
};

export default Index;
