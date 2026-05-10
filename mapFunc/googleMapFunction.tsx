"use client";

import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";

interface MapProps {
  lat: number;
  lng: number;
}

const containerStyle = {
  width: "100%",
  height: "400px",
};

export default function Map({ lat, lng }: MapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";

  const center = { lat, lng };

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}

// we can do later to enchance 

// 🔥 Dark-mode themed Google Map
// 🔥 Custom marker images
// 🔥 Multiple markers list
// 🔥 Autocomplete search box
// 🔥 Map inside modal / card layout