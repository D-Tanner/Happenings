import React, {
  createContext,
  useRef,
  useState,
  useEffect,
  useContext,
} from "react";
import ReactDOM from "react-dom";

import "./Modal.css";

const ModalContext = createContext();

export const useModalContext = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const modalRef = useRef();

  const [user, setUser] = useState(null)
  const [value, setValue] = useState();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSearchBarModal, setShowSearchBarModal] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showEditPostModal, setShowEditPostModal] = useState(false);

  useEffect(() => {
    setValue(modalRef.current);
  }, []);

  return (
    <>
      <ModalContext.Provider
        value={{
          value,
          user,
          setUser,
          authenticated,
          setAuthenticated,
          showLoginModal,
          setShowLoginModal,
          showPostModal,
          setShowPostModal,
          showEditPostModal,
          setShowEditPostModal,
          showSignUpModal,
          setShowSignUpModal,
          showSearchBarModal,
          setShowSearchBarModal,
        }}
      >
        {children}
      </ModalContext.Provider>
      <div ref={modalRef} />
    </>
  );
};

export const Modal = ({ onClose, children }) => {
  const { value } = useContext(ModalContext);
  if (!value) return null;

  return ReactDOM.createPortal(
    <div id="modal">
      <div id="modal-background" onClick={onClose} />
      <div id="modal-content">{children}</div>
    </div>,
    value
  );
};

export const SearchModal = ({ onClose, children }) => {
  const { value } = useContext(ModalContext);
  if (!value) return null;

  return ReactDOM.createPortal(
    <div id="searchModal">
      <div id="searchModal-background" onClick={onClose} />
      <div id="searchModal-content">{children}</div>
    </div>,
    value
  );
};
