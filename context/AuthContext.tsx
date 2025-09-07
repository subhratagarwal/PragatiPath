import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { AuthUser } from '../types';
import { mockUsers } from '../constants';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthUser | null>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  updateUser: (updatedUser: AuthUser) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In a real app, this would be in a secure backend. For demo, we use localStorage.
const USERS_STORAGE_KEY = 'pragatipath_users';
const SESSION_STORAGE_KEY = 'pragatipath_session';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (storedSession) {
        setUser(JSON.parse(storedSession));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    } finally {
        setLoading(false);
    }
  }, []);

  const getUsers = () => {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  };

  const login = async (email: string, password: string): Promise<AuthUser | null> => {
    // NOTE: Storing plain text passwords is a huge security risk! This is only for the demo.
    const foundUser = mockUsers.find((u) => u.email === email && u.password === password);
    
    if (foundUser) {
      const authUser: AuthUser = { 
          id: foundUser.id, 
          name: foundUser.name, 
          email: foundUser.email, 
          role: foundUser.role,
          avatarUrl: foundUser.avatarUrl,
      };
      setUser(authUser);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(authUser));
      return authUser;
    }
    
    // Fallback to check localStorage for dynamically registered users
    const dynamicallyRegisteredUsers = getUsers();
    const foundDynamicUser = dynamicallyRegisteredUsers.find((u: any) => u.email === email && u.password === password);
    if(foundDynamicUser) {
        const authUser: AuthUser = {
            id: foundDynamicUser.id,
            name: foundDynamicUser.name,
            email: foundDynamicUser.email,
            role: 'citizen', // All dynamically registered users are citizens
            avatarUrl: `https://picsum.photos/seed/${foundDynamicUser.name}/100`, // Generate a consistent avatar
        };
        setUser(authUser);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(authUser));
        return authUser;
    }


    return null;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    if (mockUsers.some(u => u.email === email)) {
        return false;
    }
    let users = getUsers();
    if (users.some((u: any) => u.email === email)) {
      return false; // User already exists
    }
    const newUser = { id: `user_${Date.now()}`, name, email, password }; // Plain text password for demo only
    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    return true;
  };

  const updateUser = (updatedUser: AuthUser) => {
    setUser(updatedUser);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const value = { user, login, logout, register, loading, updateUser };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};