"use client";

import { useEffect } from "react";

export default function UniqueVisitorTracker() {
  useEffect(() => {
    const hasVisited = localStorage.getItem("has_visited");

    if (hasVisited) return;

    const success = navigator.sendBeacon("/api/increment-visitor-count");

    if (success) {
      localStorage.setItem("has_visited", "true");
    }
  }, []);
  return null; 
}