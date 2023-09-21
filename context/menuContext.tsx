import { createContext, useState } from "react";

type ContextValue = {
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ContextMenu = createContext<ContextValue>(undefined);

const MenuContext = ({ children }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <ContextMenu.Provider value={{ showMenu, setShowMenu }}>
      {children}
    </ContextMenu.Provider>
  );
};
export default MenuContext;
