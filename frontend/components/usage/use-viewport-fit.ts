"use client";

import { useEffect, useState } from "react";

export function useViewportFit(): number {
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    const update = () => setNavHeight(header.getBoundingClientRect().height);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return navHeight;
}
