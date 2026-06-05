"use client";

import { useEffect } from "react";
import { captureTracking } from "@/lib/tracking";

export default function TrackingCapture() {
  useEffect(() => {
    captureTracking();
  }, []);
  return null;
}
