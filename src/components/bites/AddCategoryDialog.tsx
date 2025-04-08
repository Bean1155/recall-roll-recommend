
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { addCustomCategory, addCustomEntertainmentCategory } from "@/utils/categoryUtils";

interface AddCategoryDialogProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCategoryAdded?: (category: string) => void;
  type?: 'food' | 'entertainment';
}

const AddCategoryDialog = ({
  open, 
  isOpen, 
  onOpenChange,
  onCategoryAdded,
  type = 'food'
}: AddCategoryDialogProps) => {
  const [categoryName, setCategoryName] = useState("");
  
  const dialogOpen = open !== undefined ? open : isOpen;
  const handleOpenChange = onOpenChange;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (categoryName.trim()) {
      const normalizedCategory = categoryName.trim().toLowerCase();
      
      // Save the category based on type
      if (type === 'food') {
        addCustomCategory(normalizedCategory);
      } else {
        addCustomEntertainmentCategory(normalizedCategory);
      }
      
      // Notify parent component
      if (onCategoryAdded) {
        onCategoryAdded(normalizedCategory);
      }
      
      // Show toast notification
      toast({
        title: "New Category Added",
        description: `${categoryName} has been added to your categories.`,
      });
      
      // Clear input and close dialog
      setCategoryName("");
      if (handleOpenChange) {
        handleOpenChange(false);
      }
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full"
              autoFocus
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={!categoryName.trim()}>
              Add Category
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;
