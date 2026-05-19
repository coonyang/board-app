"use client";

import { useEffect } from "react";

export default function ViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    fetch(`/api/view/${postId}`, {
      method: "POST",
    });
  }, [postId]);

  return null;
}
