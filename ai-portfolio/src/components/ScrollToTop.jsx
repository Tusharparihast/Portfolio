import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Force the window to snap to the top-left corner instantly
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // 'instant' overrides the browser's scroll restoration memory
    });
  }, [pathname]);

  return null;
}