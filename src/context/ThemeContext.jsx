import { createContext, useContext, useState } from 'react';

const ThemeCtx = createContext(null);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(true);
  return (
    <ThemeCtx.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx);
