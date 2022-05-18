import { createContext, useState, useEffect } from "react";

export const SidebarContext = createContext();

const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [width, setWidth] = useState(0);
  function toggle() {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    console.log("use effect içi");
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }

    const resizeDimensions = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    window.addEventListener("resize", resizeDimensions);
    return () => window.removeEventListener("resize", resizeDimensions);
  }, []);
  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        toggle,
      }}
    >
      {" "}
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarProvider;
