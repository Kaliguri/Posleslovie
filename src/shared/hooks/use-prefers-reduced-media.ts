"use client";

import { useEffect, useState } from "react";

/** Skip heavy background video when user prefers less motion or is on a slow/save-data connection. */
export function usePrefersReducedMedia() {
  const [reduceMedia, setReduceMedia] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const connection = (
        navigator as Navigator & {
          connection?: { saveData?: boolean; effectiveType?: string };
        }
      ).connection;
      const slowConnection =
        connection?.saveData === true ||
        connection?.effectiveType === "slow-2g" ||
        connection?.effectiveType === "2g";
      setReduceMedia(motionQuery.matches || slowConnection);
    };

    update();
    motionQuery.addEventListener("change", update);
    return () => motionQuery.removeEventListener("change", update);
  }, []);

  return reduceMedia;
}
