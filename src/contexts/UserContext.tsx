
import React, { createContext, useContext, useState, useEffect } from 'react';

type UserContextType = {
  userName: string;
  setUserName: (name: string) => void;
};

const defaultUserName = "Food Lover";

const UserContext = createContext<UserContextType>({
  userName: defaultUserName,
  setUserName: () => {},
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
    <UserContext.Provider value={{ userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
};
