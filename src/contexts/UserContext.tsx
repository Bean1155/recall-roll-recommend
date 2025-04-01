
import React, { createContext, useContext, useState, useEffect } from 'react';

// Mock app users - in a real app, this would come from a database
export const appUsers = [
  { id: '1', name: 'Food Lover' },
  { id: '2', name: 'Movie Buff' },
  { id: '3', name: 'Culinary Explorer' },
  { id: '4', name: 'Film Critic' },
  { id: '5', name: 'Foodie Friend' },
];

type UserContextType = {
  userName: string;
  setUserName: (name: string) => void;
  users: Array<{ id: string, name: string }>;
};

const defaultUserName = "Food Lover";

const UserContext = createContext<UserContextType>({
  userName: defaultUserName,
  setUserName: () => {},
  users: appUsers,
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userName, setUserName] = useState<string>(() => {
    // Load from localStorage if available
    const savedName = localStorage.getItem('catalogUserName');
    return savedName || defaultUserName;
  });

  // Save to localStorage whenever userName changes
  useEffect(() => {
    localStorage.setItem('catalogUserName', userName);
  }, [userName]);

  return (
    <UserContext.Provider value={{ userName, setUserName, users: appUsers }}>
      {children}
    </UserContext.Provider>
  );
};
