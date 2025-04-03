
import React from "react";
import { Link } from "react-router-dom";
import GridLayout from "@/components/GridLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  Utensils, 
  Film, 
  Plus, 
  UserPlus, 
  Heart,
  MessageSquare 
} from "lucide-react";

const Index = () => {
  return (
    <GridLayout title="TOTAL RECALL CATALOG">
      <div className="flex flex-col items-center mb-8">
        <p className="text-xl text-center text-catalog-softBrown max-w-2xl">
          Your personal catalog for tracking all of life's bites and blockbusters. 
          Never forget a great restaurant or movie recommendation again!
        </p>
      </div>

      <Tabs defaultValue="actions" className="mb-8">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="actions" className="w-1/2">Quick Actions</TabsTrigger>
          <TabsTrigger value="features" className="w-1/2">Featured Content</TabsTrigger>
        </TabsList>
        
        <TabsContent value="actions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/create/food" className="h-full">
              <Card className="h-full hover:bg-catalog-cream cursor-pointer transition-all duration-200 border-catalog-softBrown">
                <CardHeader className="bg-catalog-manila rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-catalog-teal">
                    <Utensils size={20} />
                    Add New Bite
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-catalog-softBrown">
                    Record a new restaurant, café, or food experience.
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/create/entertainment" className="h-full">
              <Card className="h-full hover:bg-catalog-cream cursor-pointer transition-all duration-200 border-catalog-softBrown">
                <CardHeader className="bg-catalog-manila rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-catalog-teal">
                    <Film size={20} />
                    Add New Blockbuster
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-catalog-softBrown">
                    Log a movie, TV show, or other entertainment.
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/recommend" className="h-full">
              <Card className="h-full hover:bg-catalog-cream cursor-pointer transition-all duration-200 border-catalog-softBrown">
                <CardHeader className="bg-catalog-manila rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-catalog-teal">
                    <UserPlus size={20} />
                    Recommend
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-catalog-softBrown">
                    Share a recommendation with friends.
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/collections" className="h-full">
              <Card className="h-full hover:bg-catalog-cream cursor-pointer transition-all duration-200 border-catalog-softBrown">
                <CardHeader className="bg-catalog-manila rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-catalog-teal">
                    <Heart size={20} />
                    Collections
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-catalog-softBrown">
                    View and manage your saved collections.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
          
          {/* Add the TestUserFeedback link here */}
          <div className="mt-6">
            <Link to="/test-feedback" className="h-full">
              <Card className="h-full hover:bg-catalog-cream cursor-pointer transition-all duration-200 border-catalog-softBrown">
                <CardHeader className="bg-catalog-teal rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <MessageSquare size={20} />
                    Test User Feedback Feature
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-catalog-softBrown">
                    Try our new user feedback functionality for recommended cards.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </TabsContent>
        
        <TabsContent value="features">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/bites" className="h-full">
              <Card className="h-full hover:bg-catalog-cream cursor-pointer transition-all duration-200 border-catalog-softBrown">
                <CardHeader className="bg-catalog-manila rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-catalog-teal">
                    <Utensils size={20} />
                    Explore Bites
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-catalog-softBrown">
                    Browse all your saved food experiences.
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/blockbusters" className="h-full">
              <Card className="h-full hover:bg-catalog-cream cursor-pointer transition-all duration-200 border-catalog-softBrown">
                <CardHeader className="bg-catalog-manila rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-catalog-teal">
                    <Film size={20} />
                    Explore Blockbusters
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-catalog-softBrown">
                    Browse all your saved entertainment.
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/search" className="h-full">
              <Card className="h-full hover:bg-catalog-cream cursor-pointer transition-all duration-200 border-catalog-softBrown">
                <CardHeader className="bg-catalog-manila rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-catalog-teal">
                    <BookOpen size={20} />
                    Search Catalog
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-catalog-softBrown">
                    Search through all your catalog entries.
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/profile" className="h-full">
              <Card className="h-full hover:bg-catalog-cream cursor-pointer transition-all duration-200 border-catalog-softBrown">
                <CardHeader className="bg-catalog-manila rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-catalog-teal">
                    <Plus size={20} />
                    My Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-catalog-softBrown">
                    View and edit your profile information.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </GridLayout>
  );
};

export default Index;
