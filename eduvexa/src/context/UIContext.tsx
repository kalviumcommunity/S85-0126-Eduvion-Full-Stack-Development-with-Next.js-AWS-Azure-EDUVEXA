"use client";
import { createContext, useContext, ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

type Theme = 'light' | 'dark';

interface UIContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isLoading: boolean;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

function UIProviderInner({ children }: { children: ReactNode }) {
  const { theme, toggleTheme, setTheme } = useTheme();
  return (
    <UIContext.Provider value={{ theme, toggleTheme, setTheme, isLoading: false }}>
      {children}
    </UIContext.Provider>
  );
}

export const UIProvider = ({ children }: { children: ReactNode }) => {
  return <UIProviderInner>{children}</UIProviderInner>;
};

export const useUIContext = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUIContext must be used within a UIProvider');
  }
  return context;
};
