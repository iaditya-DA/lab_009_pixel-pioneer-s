"use client";

import React, { useEffect, useRef } from "react";
// Import the setOptions and importLibrary functions from the loader
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

interface AerialMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  mapId?: string | null;
}

// ⚠️ IMPORTANT: Initialize the loader options outside of the component 
// to prevent the "[@googlemaps/js-api-loader] The setOptions() function should only be called once." warning.
setOptions({
  key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
  v: "weekly",
});

export default function AerialMap({
  lat,
  lng,
  zoom = 18,
  mapId = process.env.NEXT_PUBLIC_MAP_ID ?? null,
}: AerialMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null); // Use correct type for better safety

  useEffect(() => {
    // Defensive: ensure we run only in browser
    if (typeof window === "undefined") return;

    let mounted = true;

    (async () => {
      try {
        // --- Fix 1: Use AdvancedMarkerElement (modern marker) ---
        // 1. Import the 'maps' library to get the Map class
        const { Map } = await importLibrary("maps");
        
        // 2. Import the 'marker' library to get the AdvancedMarkerElement
        const { AdvancedMarkerElement } = await importLibrary("marker"); 
        
        // Check mounting status before creating the map
        if (!mounted || !containerRef.current) return;

        // Create the map
        mapRef.current = new Map(containerRef.current, {
          center: { lat, lng },
          zoom,
          mapId: mapId || undefined, 
          tilt: 60,
          heading: 0,
          gestureHandling: "greedy",
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
        });

        // --- Fix 2: Use AdvancedMarkerElement instead of the deprecated Marker ---
        new AdvancedMarkerElement({
          position: { lat, lng },
          map: mapRef.current,
          title: "Monastery",
        });

        // optional: smooth initial camera animation (fly-in)
        setTimeout(() => {
          try {
            if (mapRef.current) {
                mapRef.current.setTilt(60);
                mapRef.current.setHeading(30);
            }
          } catch (e) {
            // ignore if not supported
          }
        }, 500);
      } catch (err) {
        console.error("Error loading Google Maps via importLibrary:", err);
      }
    })();

    return () => {
      mounted = false;
      mapRef.current = null;
    };
  }, [lat, lng, zoom, mapId]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[300px] bg-gray-100"
      style={{ minHeight: 400 }}
      aria-hidden={false}
    />
  );
}