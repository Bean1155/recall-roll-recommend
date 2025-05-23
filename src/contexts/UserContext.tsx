
import React, { createContext, useContext, useState, useEffect } from 'react';

// Mock app users - in a real app, this would come from a database
export const appUsers = [
  { id: '1', name: 'Food Lover' },
  { id: '2', name: 'Movie Buff' },
  { id: '3', name: 'Culinary Explorer' },
  { id: '4', name: 'Film Critic' },
  { id: '5', name: 'Foodie Friend' },
];

type UserProfile = {
  bio: string;
  avatar: string;
  email: string | null;
  isRegistered: boolean;
};

type NotificationSettings = {
  email: boolean;
  push: boolean;
  recommendations: boolean;
  friendActivity: boolean;
  appUpdates: boolean;
};

type SharingSettings = {
  publicProfile: boolean;
  shareCards: boolean;
  defaultPermission: 'public' | 'friends' | 'private';
  allowNoteUpdates: boolean;
  autoReceiveNotes: boolean;
};

export type UserType = {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  createdAt?: string;
};

type UserContextType = {
  userName: string;
  setUserName: (name: string) => void;
  users: Array<{ id: string, name: string }>;
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  notificationSettings: NotificationSettings;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  sharingSettings: SharingSettings;
  updateSharingSettings: (settings: Partial<SharingSettings>) => void;
  currentUser: UserType;
  setCurrentUser: (user: UserType) => void;
  login: (email: string) => void; // Add the login function type
};

const defaultUserName = "Food Lover";

const defaultProfile: UserProfile = {
  bio: "Food and movie enthusiast",
  avatar: "https://i.pravatar.cc/150?img=32",
  email: null,
  isRegistered: false,
};

const defaultNotificationSettings: NotificationSettings = {
  email: true,
  push: false,
  recommendations: true,
  friendActivity: true,
  appUpdates: true,
};

const defaultSharingSettings: SharingSettings = {
  publicProfile: true,
  shareCards: true,
  defaultPermission: 'friends',
  allowNoteUpdates: true,
  autoReceiveNotes: true,
};

// Default current user
const defaultCurrentUser: UserType = {
  id: '1',
  name: 'Food Lover'
};

const UserContext = createContext<UserContextType>({
  userName: defaultUserName,
  setUserName: () => {},
  users: appUsers,
  profile: defaultProfile,
  updateProfile: () => {},
  notificationSettings: defaultNotificationSettings,
  updateNotificationSettings: () => {},
  sharingSettings: defaultSharingSettings,
  updateSharingSettings: () => {},
  currentUser: defaultCurrentUser,
  setCurrentUser: () => {},
  login: () => {}, // Add login to default context
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userName, setUserName] = useState<string>(() => {
    // Load from localStorage if available
    const savedName = localStorage.getItem('catalogUserName');
    return savedName || defaultUserName;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const savedProfile = localStorage.getItem('catalogUserProfile');
    return savedProfile ? JSON.parse(savedProfile) : defaultProfile;
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    const savedSettings = localStorage.getItem('catalogNotificationSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultNotificationSettings;
  });

  const [sharingSettings, setSharingSettings] = useState<SharingSettings>(() => {
    const savedSettings = localStorage.getItem('catalogSharingSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSharingSettings;
  });

  // Current user state
  const [currentUser, setCurrentUser] = useState<UserType>(() => {
    // Try to load from localStorage
    const savedUser = localStorage.getItem('currentUser');
    // In a real app, this would be based on authenticated user
    return savedUser ? JSON.parse(savedUser) : defaultCurrentUser;
  });

  // Update profile
  const updateProfile = (newProfileData: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...newProfileData }));
  };

  // Update notification settings
  const updateNotificationSettings = (newSettings: Partial<NotificationSettings>) => {
    setNotificationSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Update sharing settings
  const updateSharingSettings = (newSettings: Partial<SharingSettings>) => {
    setSharingSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Login function implementation
  const login = (email: string) => {
    // Find a user with matching email or use default
    // In a real app, this would authenticate against a backend
    const newUser = { 
      ...defaultCurrentUser, 
      email 
    };
    
    setCurrentUser(newUser);
    updateProfile({ email, isRegistered: true });
  };

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('catalogUserName', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('catalogUserProfile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('catalogNotificationSettings', JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  useEffect(() => {
    localStorage.setItem('catalogSharingSettings', JSON.stringify(sharingSettings));
  }, [sharingSettings]);

  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <UserContext.Provider 
      value={{ 
        userName, 
        setUserName, 
        users: appUsers,
        profile,
        updateProfile,
        notificationSettings,
        updateNotificationSettings,
        sharingSettings,
        updateSharingSettings,
        currentUser,
        setCurrentUser,
        login // Provide the login function to consumers
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
