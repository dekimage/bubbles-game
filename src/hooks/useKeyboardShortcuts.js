"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useKeyboardShortcuts({ onEdit, milestone = null }) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = (event) => {
      // Ignore key events when user is typing in an input or textarea
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
      ) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case "e":
          onEdit();
          break;
        case "escape":
          router.push("/");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [router, onEdit, milestone]);
}
