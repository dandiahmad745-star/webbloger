"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function LoadingScreen({ onLoaded }: { onLoaded: () => void }) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2500); // Start fading out after 2.5s

    const unmountTimer = setTimeout(() => {
      onLoaded();
    }, 3000); // Unmount after 3s (2.5s + 0.5s fade duration)

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(unmountTimer);
    };
  }, [onLoaded]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500",
        isFadingOut ? "opacity-0" : "opacity-100"
      )}
      aria-hidden={isFadingOut}
    >
      <div className="relative h-full w-full overflow-hidden">
        <div className="shimmer-effect"></div>
      </div>
    </div>
  );
}
