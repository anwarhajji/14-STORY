// FIX: Implemented the UserContext, which was previously a placeholder.
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface User {
  name?: string;
  role: 'student' | 'educator';
}

interface UserContextType {
  user: User | null;
  isOnboarded: boolean;
  login: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedIsOnboarded = localStorage.getItem('isOnboarded');
      if (storedUser && storedIsOnboarded) {
        setUser(JSON.parse(storedUser));
        setIsOnboarded(JSON.parse(storedIsOnboarded));
      }
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
      localStorage.removeItem('user');
      localStorage.removeItem('isOnboarded');
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsOnboarded(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isOnboarded', JSON.stringify(true));
  };

  return (
    <UserContext.Provider value={{ user, isOnboarded, login }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};