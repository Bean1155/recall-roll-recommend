
import React, { useState } from 'react';
import { FoodCard, CatalogCard } from '@/lib/types';
import CatalogCardComponent from '@/components/CatalogCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCategoryDisplayName } from '@/utils/categoryUtils';
import { Link } from 'react-router-dom';
import { Plus, PlusIcon } from 'lucide-react';

interface Category {
  name: string;
  count: number;
  type?: string;
}

interface CategoryCardsDisplayProps {
  categories: Category[];
  cards: Record<string, CatalogCard[]>;
  colorForCategory: (categoryName: string) => string;
  showEmptyCategories?: boolean;
}

const CategoryCardsDisplay: React.FC<CategoryCardsDisplayProps> = ({
  categories,
  cards,
  colorForCategory,
  showEmptyCategories = true,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };
  
  const renderCategory = (category: Category) => {
    const categoryName = category.name;
    const categoryCards = cards[categoryName] || [];
    const isExpanded = expandedCategories[categoryName];
    const hasCards = categoryCards.length > 0;
    
    if (!hasCards && !showEmptyCategories) {
      return null;
    }
    
    const bgColor = colorForCategory(categoryName);
    const textColor = '#ffffff'; // White text for all category headers
    
    return (
      <div key={categoryName} className="mb-8">
        <div 
          className="flex justify-between items-center px-4 py-2 rounded-t-lg cursor-pointer"
          style={{ backgroundColor: bgColor, color: textColor }}
          onClick={() => toggleCategory(categoryName)}
        >
          <h3 className="font-bold text-lg">
            {getCategoryDisplayName(categoryName)} ({categoryCards.length})
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1 h-auto"
            style={{ color: textColor }}
          >
            {isExpanded ? 'Hide' : 'Show'}
          </Button>
        </div>
        
        {isExpanded && (
          <div className="p-4 bg-slate-50 rounded-b-lg">
            {hasCards ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryCards.map((card) => (
                  <Card key={card.id} className="overflow-hidden h-full">
                    <CatalogCardComponent card={card} />
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No items in this category yet.</p>
                <Button asChild>
                  <Link to={`/create/food?category=${categoryName}`}>
                    <PlusIcon size={16} className="mr-2" />
                    Add First Item
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      {categories.map(renderCategory)}
      
      {categories.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No categories available.</p>
          <Button asChild>
            <Link to="/create/food">
              <PlusIcon size={16} className="mr-2" />
              Add First Food Item
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryCardsDisplay;
