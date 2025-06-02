
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first, then system preference
    const stored = localStorage.getItem('medarch-theme') as Theme;
    if (stored && ['light', 'dark'].includes(stored)) {
      return stored;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  
  // Apply theme to DOM with smooth transition
  const applyThemeToDOM = (newTheme: Theme) => {
    const root = document.documentElement;
    
    // Add transition class for smooth animation
    root.classList.add('theme-transition');
    
    // Apply theme
    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    
    // Remove transition class after animation
    setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 150);
  };
  
  // Update theme with persistence
  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('medarch-theme', newTheme);
    applyThemeToDOM(newTheme);
    setThemeState(newTheme);
  };
  
  // Toggle between themes
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  // Apply theme on mount and listen for system changes
  useEffect(() => {
    applyThemeToDOM(theme);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e: MediaQueryListEvent) => {
      // Only apply system change if no theme is stored
      if (!localStorage.getItem('medarch-theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange);
    };
  }, [theme]);
  
  const value = { theme, setTheme, toggleTheme };
  
  return (
    <ThemeContext.Provider value={value}>
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

export default useTheme;
