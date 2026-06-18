import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset browser window layout viewport to the absolute top coordinates
    window.scrollTo(0, 0);
  }, [pathname]); // Fires instantly every single time the route path changes

  return null; // This utility doesn't need to render any HTML visual wrappers
}