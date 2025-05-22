
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/user';
import { useAuth } from '@/utils/authContext';

export type ThemeName = 'light' | 'dark' | 'green' | 'blue' | 'purple' | 'amber';

export interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [theme, setThemeState] = useState<ThemeName>('light');
  
  // Load theme preference from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('auditFlowTheme');
    if (savedTheme && isValidTheme(savedTheme)) {
      setThemeState(savedTheme as ThemeName);
      applyTheme(savedTheme as ThemeName);
    } else if (user?.theme && isValidTheme(user.theme)) {
      setThemeState(user.theme as ThemeName);
      applyTheme(user.theme as ThemeName);
    }
  }, [user]);
  
  const isValidTheme = (theme: string): theme is ThemeName => {
    return ['light', 'dark', 'green', 'blue', 'purple', 'amber'].includes(theme);
  };
  
  // Apply theme by setting the data-theme attribute on the document element
  const applyTheme = (themeName: ThemeName) => {
    const root = document.documentElement;
    
    // Remove all existing theme classes
    root.classList.remove('light', 'dark', 'theme-green', 'theme-blue', 'theme-purple', 'theme-amber');
    
    // Apply appropriate theme class
    if (themeName === 'light' || themeName === 'dark') {
      root.classList.add(themeName);
    } else {
      root.classList.add('light'); // Base theme
      root.classList.add(`theme-${themeName}`); // Additional theme
    }
    
    // Update localStorage
    localStorage.setItem('auditFlowTheme', themeName);
  };
  
  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    
    // If user is logged in, save theme preference to their account
    if (user) {
      const storedUsers = localStorage.getItem('auditUsers');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const updatedUsers = users.map((u: any) => 
          u.id === user.id ? { ...u, theme: newTheme } : u
        );
        localStorage.setItem('auditUsers', JSON.stringify(updatedUsers));
      }
      
      // Also update the current user in localStorage
      const currentUser = localStorage.getItem('auditFlowUser');
      if (currentUser) {
        const parsedUser = JSON.parse(currentUser);
        parsedUser.theme = newTheme;
        localStorage.setItem('auditFlowUser', JSON.stringify(parsedUser));
      }
    }
  };
  
  const toggleDarkMode = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };
  
  const isDarkMode = theme === 'dark';
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleDarkMode, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
