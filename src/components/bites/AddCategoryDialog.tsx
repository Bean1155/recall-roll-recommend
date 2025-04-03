
import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FoodCategory } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { addUserRewardPoints } from "@/lib/data";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";

interface AddCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryAdded: (category: FoodCategory) => void;
  existingCategories: FoodCategory[];
}

const AddCategoryDialog = ({
  isOpen,
  onOpenChange,
  onCategoryAdded,
  existingCategories,
}: AddCategoryDialogProps) => {
  const [newCategory, setNewCategory] = useState("");
  const { toast } = useToast();
  const { currentUser } = useUser();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategory.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    const formattedCategory = newCategory.trim().toLowerCase() as FoodCategory;
    
    if (existingCategories.includes(formattedCategory)) {
      toast({
        title: "Error",
        description: "This category already exists",
        variant: "destructive",
      });
      return;
    }
    
    // Add category to local storage
    try {
      const savedCategories = localStorage.getItem('customFoodCategories');
      let customCategories: FoodCategory[] = [];
      
      if (savedCategories) {
        customCategories = JSON.parse(savedCategories);
      }
      
      customCategories.push(formattedCategory);
      localStorage.setItem('customFoodCategories', JSON.stringify(customCategories));
      
      onCategoryAdded(formattedCategory);
      setNewCategory("");
      onOpenChange(false);
      
      toast({
        title: "Success",
        description: `Added new category: ${formattedCategory}`,
      });
      
      // Add reward point for creating a new category
      if (currentUser) {
        addUserRewardPoints(currentUser.id, 1, "Creating a new food category");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
      <DialogContent className="sm:max-w-[500px] p-6 border-2 border-catalog-softBrown rounded-xl">
        <DialogTitle className="text-xl font-typewriter text-catalog-teal">
          Add New Category
        </DialogTitle>
        <DialogDescription className="text-sm text-catalog-softBrown mb-4">
          Create a custom category for your food experiences.
        </DialogDescription>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="category-name" className="text-sm font-medium">
                Category Name
              </label>
              <Input
                id="category-name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter a new category name"
                className="w-full"
              />
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-catalog-teal hover:bg-catalog-darkTeal">
              <Plus size={16} className="mr-2" />
              Add Category
            </Button>
          </DialogFooter>
        </form>
        
        <DialogClose className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-md hover:bg-gray-100">
          <X size={18} />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;
