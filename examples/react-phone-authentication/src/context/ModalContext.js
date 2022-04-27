import { createContext, useState } from "react";
import Notification from "../components/Notification";

export const ModalContext = createContext();
const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [type, setType] = useState("");
  
  const closeModal = async () => {
    setIsOpen(false);
    await new Promise((r) => setTimeout(r, 1000));
    setType(null);
    setContent(null);
  };

  const openModal = async (content, type) => {
    setType(type);
    setContent(content);

    setIsOpen(true);
    await new Promise((r) => setTimeout(r, 2500));

    await closeModal();
  };

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        content,
        type,
        closeModal,
        openModal,
      }}
    >
      {" "}
      <Notification />
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
