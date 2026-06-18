import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  // Destructure both pathname and hash to track full navigation changes
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // CRITICAL FIX: If the target URL contains an anchor link hash (like #projects),
    // abort this hook immediately and let HashLink safely take over scrolling down!
    if (hash) return;

    // Force the window to snap to the top-left corner instantly on normal route switches
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", 
    });
  }, [pathname, hash]); // Listen to both layout switches and section anchor targets

  return null;
}