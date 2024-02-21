"use client";
import React, {
  createContext,
  useMemo,
  useState,
  useContext,
  use,
  useEffect,
} from "react";
import INavigationCtx from "../../@types/INavigationCtx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Create the empty context
const NavigationCtx = createContext<INavigationCtx>({
  isOpen: false,
  setIsOpen: () => {},
});

/**
 * Provider for the navigation context
 */
function NavigationProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Memoize the value to prevent unnecessary re-renders
  const value = useMemo(() => ({ isOpen, setIsOpen }), [isOpen, setIsOpen]);

  return (
    <NavigationCtx.Provider value={value}>{children}</NavigationCtx.Provider>
  );
}

// Hook to access the navigation context
export const useNavigationCtx = () => useContext(NavigationCtx);

// Export the Provider to be used in the app to wrap the components that need access to the navigation context
export default NavigationProvider;
