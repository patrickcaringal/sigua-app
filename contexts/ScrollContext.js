import { createContext, useContext, useRef } from "react";

import { useLocalStorage } from "../hooks";
import { auth, monitorAuthState } from "../modules/firebase";

const ScrollContext = createContext({});

export const useScroll = () => useContext(ScrollContext);

export const ScrollContextProvider = ({ children }) => {
  const branchRef = useRef(null);
  const announcementRef = useRef(null);
  const feedbackRef = useRef(null);

  const onBranchScroll = () => {
    branchRef.current.scrollIntoView({ behavior: "smooth", alignToTop: true });
  };

  const onAnnouncementScroll = () => {
    announcementRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const onFeedbackScroll = () => {
    feedbackRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const value = {
    feedbackRef,
    onFeedbackScroll,
    branchRef,
    onBranchScroll,
    announcementRef,
    onAnnouncementScroll,
  };
  return (
    <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
  );
};
