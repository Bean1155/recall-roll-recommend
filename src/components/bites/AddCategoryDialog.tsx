
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddCategoryDialogProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AddCategoryDialog = ({
  open, 
  isOpen, 
  onOpenChange
}: AddCategoryDialogProps) => {
  const [categoryName, setCategoryName] = useState("");
  
  const dialogOpen = open !== undefined ? open : isOpen;
  const handleOpenChange = onOpenChange;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle category creation logic
    if (categoryName.trim()) {
      // Add category
      console.log("Creating category:", categoryName);
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
