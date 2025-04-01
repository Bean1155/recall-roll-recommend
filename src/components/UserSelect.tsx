
import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { isRecommendedToUser } from "@/lib/data";
import { Label } from "@/components/ui/label";

interface UserSelectProps {
  cardId: string;
  onUserSelect: (userId: string) => void;
  selectedUserId: string | null;
}

const UserSelect = ({ cardId, onUserSelect, selectedUserId }: UserSelectProps) => {
  const { users } = useUser();
  const [availableUsers, setAvailableUsers] = useState(users);
  
  useEffect(() => {
    // Filter out users who already received this recommendation
    const filteredUsers = users.filter(user => !isRecommendedToUser(cardId, user.id));
    setAvailableUsers(filteredUsers);
  }, [cardId, users]);
  
  if (availableUsers.length === 0) {
    return (
      <div className="p-3 bg-catalog-cream/50 rounded-md border border-catalog-softBrown">
        <p className="text-sm">You've already recommended this to all app users!</p>
      </div>
    );
  }
  
  return (
    <div>
      <Label htmlFor="user-select">Select App User</Label>
      <Select
        value={selectedUserId || ""}
        onValueChange={onUserSelect}
      >
        <SelectTrigger id="user-select" className="catalog-input">
          <SelectValue placeholder="Choose an app user" />
        </SelectTrigger>
        <SelectContent>
          {availableUsers.map(user => (
            <SelectItem key={user.id} value={user.id}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserSelect;
