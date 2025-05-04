
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem('theme') as Theme) || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );
  
  // Update the theme in localStorage and apply it to the document
  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    applyThemeToDOM(newTheme);
    setThemeState(newTheme);
  };
  
  // Toggle between light and dark mode
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  // Function to apply theme to DOM with smooth transition
  const applyThemeToDOM = (theme: Theme) => {
    // Add transition class to document for smooth color transitions
    document.documentElement.classList.add('theme-transition');
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
    
    // Add event listener to remove transition class after transition completes
    const transitionEndHandler = () => {
      document.documentElement.classList.remove('theme-transition');
      document.documentElement.removeEventListener('transitionend', transitionEndHandler);
    };
    
    document.documentElement.addEventListener('transitionend', transitionEndHandler);
    
    // Fallback: remove transition class after a delay in case transitionend doesn't fire
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 1000);
  };
  
  // Apply the theme when the component mounts
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
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
