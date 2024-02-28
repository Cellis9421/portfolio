"use client";
import React, {
  createContext,
  useMemo,
  useState,
  useContext,
  useCallback,
} from "react";
import IWindowManagerCtx from "../../@types/IWindowManagerCtx";

// Create the empty context
const WindowManagerCtx = createContext<IWindowManagerCtx>({
  openWindows: [],
  isOpen: () => false,
  open: () => {},
  close: () => {},
  toggle: () => {},
  closeAll: () => {},
});

function WindowManagerProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const [openWindows, setOpenWindows] = useState<string[]>([]);
    const isOpen = useCallback((key: string) => openWindows.includes(key), [openWindows]);
    const open = useCallback((key: string) => setOpenWindows([...openWindows, key]), [openWindows]);
    const close = useCallback((key: string) => setOpenWindows(openWindows.filter((k) => k !== key)), [openWindows]);
    const toggle = useCallback((key: string) => {
        if (isOpen(key)) {
            close(key);
        } else {
            open(key);
        }
    }, [isOpen, open, close]);
    const closeAll = useCallback(() => setOpenWindows([]), []);

  // Memoize the value to prevent unnecessary re-renders
  const value = useMemo(() => ({ openWindows, isOpen, open, close, toggle, closeAll }), [openWindows, isOpen, open, close, toggle, closeAll]);

  return (
    <WindowManagerCtx.Provider value={value}>{children}</WindowManagerCtx.Provider>
  );
}

// Hook to easily access the context
export const useWindowManagerCtx = () => useContext(WindowManagerCtx);

// Provider to be used in the app to wrap the components that need access to the context
export default WindowManagerProvider;
