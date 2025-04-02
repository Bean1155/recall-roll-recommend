
import React from "react";
import GridLayout from "@/components/GridLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Utensils, Clapperboard, Plus } from "lucide-react";

const CollectionsPage = () => {
  return (
    <GridLayout title="My Collections">
      <div className="grid grid-cols-1 gap-8 max-w-2xl mx-auto">
        <div className="catalog-card p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Utensils className="mr-2 text-catalog-teal" />
            Bites Collection
          </h2>
          <p className="mb-4">Your collection of memorable food experiences.</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild className="bg-catalog-teal hover:bg-catalog-darkTeal flex-1">
              <Link to="/bites">View Bites</Link>
            </Button>
            <Button asChild className="bg-catalog-teal hover:bg-catalog-darkTeal flex-1">
              <Link to="/create/food" className="flex items-center justify-center">
                <Plus size={16} className="mr-1" /> Add New Bite
              </Link>
            </Button>
          </div>
        </div>

        <div className="catalog-card p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Clapperboard className="mr-2 text-catalog-teal" />
            Blockbusters Collection
          </h2>
          <p className="mb-4">Your collection of memorable entertainment experiences.</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild className="bg-catalog-teal hover:bg-catalog-darkTeal flex-1">
              <Link to="/blockbusters">View Blockbusters</Link>
            </Button>
            <Button asChild className="bg-catalog-teal hover:bg-catalog-darkTeal flex-1">
              <Link to="/create/entertainment" className="flex items-center justify-center">
                <Plus size={16} className="mr-1" /> Add New Blockbuster
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </GridLayout>
  );
};

export default CollectionsPage;
