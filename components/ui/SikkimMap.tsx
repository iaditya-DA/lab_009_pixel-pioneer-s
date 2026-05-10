"use client";
import { MapContainer, GeoJSON, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";

import { useRouter } from "next/navigation";
import { Types } from "mongoose";
import { div } from "framer-motion/client";
// Type for Monasteries
type Monastery = {
  _id: Types.ObjectId;
  name: string;
  lat: number;
  lng: number;
  description?: string;
  foundedYear?: string;
  district?: string;
};
type District = {
  district: string;
  description?: string;
  image?: string;
  population: number;
  area_km2: number;
  villages?: number;
  literacy_rate?: string; // e.g. "83.85%"
  district_code: string;
  latitude: number;
  longitude: number;
  languages?: string[];
  festivals?: string[];
  foods?: string[];
}
const monasteryIcon = new L.Icon({
  iconUrl: "/images/monastry.png",
  iconSize: [28, 28],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});
const adventureIcon = new L.Icon({
  iconUrl: "/images/hiking.png",
  iconSize: [28, 28],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})
const ecoIcon = new L.Icon({
  iconUrl: "/images/plant.png",
  iconSize: [28, 28],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})
const religiousIcon = new L.Icon({
  iconUrl: "/images/om.png",
  iconSize: [28, 28],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})
const sancturyIcon = new L.Icon({
  iconUrl: "/images/adventure.png",
  iconSize: [28, 28],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
})
const adventures = {
  "Adventure Zone Sikkim": { lat: 27.3660461, lng: 88.62801, category: "Adventure" },
  "Fly Sikkim Adventure": { lat: 27.3461078, lng: 88.5998768, category: "Adventure" },
  "Oho Adventure": { lat: 27.3358577, lng: 88.5902189, category: "Adventure" },
  "Get Set Go Tours, Travels & Adventures": { lat: 27.3105755, lng: 88.5975892, category: "Adventure" },
  "Ban Jhakri Falls Park": { lat: 27.3507643, lng: 88.6032316, category: "Adventure" },

  "Himalayan Zoological Park": { lat: 27.3478, lng: 88.6044, category: "Eco" },
  "Saramsa Garden": { lat: 27.3092, lng: 88.6283, category: "Eco" },
  "Bakthang Waterfalls": { lat: 27.3661, lng: 88.6097, category: "Eco" },
  "Raj Bhavan Complex Gardens": { lat: 27.3325, lng: 88.6142, category: "Eco" },
  "Kabi Lungchok": { lat: 27.4206, lng: 88.5836, category: "Eco" },

  "Khangchendzonga National Park (KNP)": { lat: 27.6667, lng: 88.3122, category: "Sanctuary" },
  "Shingba Rhododendron Sanctuary": { lat: 27.8411, lng: 88.7392, category: "Sanctuary" },

  "Lachen": { lat: 27.6075, lng: 88.563, category: "Adventure" },
  "Lachung": { lat: 27.6853, lng: 88.7565, category: "Adventure" },
  "Gurudongmar Lake": { lat: 28.0255, lng: 88.6811, category: "Adventure" },
  "Yumthang Valley": { lat: 27.8189, lng: 88.7058, category: "Adventure" },
  "Singhik": { lat: 27.4216, lng: 88.5247, category: "Adventure" },

  "Dzongu Valley": { lat: 27.4833, lng: 88.4833, category: "Eco" },
  "Teesta River Confluence (Chungthang)": { lat: 27.575, lng: 88.65, category: "Eco" },
  "Shingba Rhododendron Sanctuary 2": { lat: 27.5089, lng: 88.74, category: "Eco" },

  "Labrang Monastery": { lat: 27.4089, lng: 88.58, category: "Religious" },
  "Lachen Monastery (Ngodub Choling)": { lat: 27.7162, lng: 88.5566, category: "Religious" },
  "Lachung Monastery": { lat: 27.6167, lng: 88.65, category: "Religious" },
  "Guru Dongmar Lake Religious": { lat: 28.0255, lng: 88.6811, category: "Religious" },
  "Sirijonga Yuma Mangheem": { lat: 27.4, lng: 88.5333, category: "Religious" },

  "Maenam Wildlife Sanctuary": { lat: 27.3139, lng: 88.3931, category: "Sanctuary" },
  "Kitam Bird Sanctuary": { lat: 27.1032, lng: 88.3444, category: "Sanctuary" },

  "Maenam Peak": { lat: 27.3139, lng: 88.3931, category: "Adventure" },
  "Tendong Hill": { lat: 27.255, lng: 88.4056, category: "Adventure" },
  "Bhaleydhunga Ropeway": { lat: 27.3183, lng: 88.36, category: "Adventure" },
  "Tarey Bhir": { lat: 27.1756, lng: 88.3347, category: "Adventure" },

  "Temi Tea Garden": { lat: 27.2717, lng: 88.45, category: "Eco" },
  "Borong Hot Springs": { lat: 27.2986, lng: 88.3661, category: "Eco" },

  "Siddheshwar Dham (Char Dham)": { lat: 27.1867, lng: 88.3611, category: "Religious" },
  "Samdruptse Hill": { lat: 27.2, lng: 88.3583, category: "Religious" },
  "Ralang Monastery": { lat: 27.3117, lng: 88.4239, category: "Religious" },

  "Varsey Rhododendron Sanctuary": { lat: 27.1942, lng: 88.1194, category: "Sanctuary" },

  "Yuksom": { lat: 27.3678, lng: 88.2197, category: "Adventure" },
  "Singshore Bridge": { lat: 27.3092, lng: 88.1236, category: "Adventure" },

  "Khecheopalri Lake": { lat: 27.36, lng: 88.1864, category: "Eco" },

  "Pemayangtse Monastery": { lat: 27.3044, lng: 88.2528, category: "Religious" },
}
const adventurePlaces = Object.entries(adventures).map(([name, data]) => ({
  name,
  lat: data.lat,
  lng: data.lng,
  category: data.category,
}));

export default function SikkimMap() {
  const [districts, setDistricts] = useState<any | null>(null);
  const [monasteries, setMonasteries] = useState<Monastery[] | null>(null);
  const [hoverDistrict, setHoverDistrict] = useState<string>(""); // ⭐ hover text state
  const [selectedMonastery, setSelectedMonastery] = useState<Monastery | null>(null);
  const [districtData, setDistrictData] = useState<District[] | null>(null);
  const router = useRouter();
  // Fetching geojson & monasteries list
  useEffect(() => {
    async function fetchData() {
      // fetch districts
      const districtsRes = await fetch("/Sikkim/SIKKIM_DISTRICTS.geojson");
      const districtsData: any = await districtsRes.json();
      setDistricts(districtsData);

      // fetch monasteries from API
      const monasteriesRes = await fetch("/api/monastries");
      const monasteriesData = await monasteriesRes.json();
      const simplified = monasteriesData.map((m: any) => ({
        _id: m._id,
        name: m.name,
        lat: m.location.lat,
        lng: m.location.lng,
        description: m.description,
        foundedYear: m.foundedYear,
        district: m.district
      }));
      setMonasteries(simplified);
    }
    fetchData();
  }, []);
  useEffect(() => {
    async function fetchData() {
      const data = await fetch(`/api/district`);
      const dis = await data.json();
      setDistrictData(dis);
    }
    fetchData();
  }, [])
  // Boundary of Sikkim map
  const bounds: L.LatLngBoundsLiteral = [
    [27.0, 88.0],
    [28.2, 88.9],
  ];

  // STYLE default and hover
  const normalStyle = {
    color: "#fff",
    weight: 2,
    fillColor: "#DA4167",
    fillOpacity: 0.9,
  };

  const hoverStyle = {
    color: "#fff",
    weight: 3,
    fillColor: "#FFD369",
    fillOpacity: 1,
  };

  // DISTRICT EVENTS (hover + click zoom)
  const onEachDistrict = (feature: any, layer: any) => {
    layer.on({
      mouseover: () => {
        setHoverDistrict(feature.properties.DISTRICT); // ⭐ show district name
        layer.setStyle(hoverStyle);
      },
      mouseout: () => {
        setHoverDistrict("");
        layer.setStyle(normalStyle);
      },
      click: () => {
        const map = layer._map;
        map.fitBounds(layer.getBounds(), { padding: [40, 40] }); // ⭐ zoom district
      },
    });
  };
  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      {/* ---- BACKGROUND BLURRED IMAGE ---- */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/images/bg3.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(5px) brightness(50%)",
          zIndex: 1,
        }}
      />
      {/* ---- PAGE TITLE ---- */}
      <h1
        style={{
          position: "absolute",
          top: "30px",
          width: "100%",
          textAlign: "center",
          fontSize: "48px",
          fontWeight: "bold",
          color: "white",
          zIndex: 3,
          letterSpacing: "2px",
          textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
        }}
      >
        Sikkim — Journey Through Monasteries
      </h1>
      {/* ---- HOVER DISTRICT NAME ---- */}
      {hoverDistrict && (
        <div
          style={{
            position: "absolute",
            top: "90px",
            width: "100%",
            textAlign: "center",
            fontSize: "22px",
            fontWeight: "600",
            color: "#FFD369",
            zIndex: 9,
            textShadow: "2px 2px 5px rgba(0,0,0,0.8)",
            transition: "0.3s",
          }}
        >
          {hoverDistrict}
        </div>
      )}

      {/* ---- MAP ---- */}
      {/* ---- LEGEND BOX ---- */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "40px",
          background: "rgba(255,255,255,0.9)",
          padding: "14px 18px",
          borderRadius: "12px",
          zIndex: 50,
          width: "180px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
          backdropFilter: "blur(4px)",
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "700",
            marginBottom: "10px",
            textAlign: "center",
            color: "#B45309",
            textTransform: "uppercase",
          }}
        >
          Description
        </h3>

        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
          <img src="/images/monastry.png" width={22} height={22} style={{ marginRight: "10px" }} />
          <span style={{ fontSize: "14px", color: "#333" }}>Monastery</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
          <img src="/images/hiking.png" width={22} height={22} style={{ marginRight: "10px" }} />
          <span style={{ fontSize: "14px", color: "#333" }}>Adventure</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
          <img src="/images/plant.png" width={22} height={22} style={{ marginRight: "10px" }} />
          <span style={{ fontSize: "14px", color: "#333" }}>Eco Tourism</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
          <img src="/images/om.png" width={22} height={22} style={{ marginRight: "10px" }} />
          <span style={{ fontSize: "14px", color: "#333" }}>Religious</span>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <img src="/images/adventure.png" width={22} height={22} style={{ marginRight: "10px" }} />
          <span style={{ fontSize: "14px", color: "#333" }}>Sanctuary</span>
        </div>
      </div>

      <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
        <MapContainer
          center={[27.533, 88.512]}
          zoom={9}
          minZoom={8}
          maxBounds={bounds}
          zoomControl={false}
          dragging={true}
          style={{ height: "100%", width: "100%", background: "transparent" }}
        >
          {districts && (
            <GeoJSON data={districts} style={normalStyle} onEachFeature={onEachDistrict} />
          )}

          {/* ---- MONASTERY MARKERS ---- */}
          {monasteries &&
            monasteries.map((m, idx) => (
              <Marker
                key={idx}
                position={[m.lat, m.lng]}
                icon={monasteryIcon}
                eventHandlers={{
                  click: () => setSelectedMonastery(m), // ⭐ open modal
                }}
              >
              </Marker>
            ))}
          {/* ---- OTHER CATEGORY MARKERS ---- */}
          {adventurePlaces.map((p, i) => {
            let icon;

            if (p.category === "Adventure") icon = adventureIcon;
            else if (p.category === "Eco") icon = ecoIcon;
            else if (p.category === "Religious") icon = religiousIcon;
            else icon = sancturyIcon;

            return (
              <Marker key={i} position={[p.lat, p.lng]} icon={icon}>
                <Popup>
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #fffaf0, #fef3c7)",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                      textAlign: "center",
                      minWidth: "160px",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        marginBottom: "6px",
                        color: "#B45309",                     // Golden-brown title
                        textTransform: "uppercase",
                      }}
                    >
                      {p.name}
                    </h3>

                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        background: "#fef9c3",              // light yellow badge
                        color: "#92400e",                     // dark gold text
                        fontWeight: "600",
                        fontSize: "13px",
                      }}
                    >
                      {p.category}
                    </span>
                  </div>
                </Popup>

              </Marker>
            );
          })}
        </MapContainer>
      </div>
      {/* ---- MODAL FOR MONASTERY DETAILS ---- */}
      {selectedMonastery && (
        <div
          style={{
            position: "absolute",
            bottom: "50px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255,255,255,0.95)",
            padding: "25px",
            borderRadius: "16px",
            width: "420px",
            zIndex: 30,
            backdropFilter: "blur(10px)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
            animation: "fadeUp 0.4s ease",
          }}
        >
          {/* Title + Info */}
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "800",
              background: "linear-gradient(135deg, #DA4167, #FFD369)",
              WebkitBackgroundClip: "text",
              color: "transparent",
              marginBottom: "12px",
            }}
          >
            {selectedMonastery.name}
          </h2>

          <div style={{ marginBottom: "15px", color: "#444", fontSize: "15px" }}>
            <p><b>District:</b> {selectedMonastery.district}</p>
            <p><b>Founded:</b> {selectedMonastery.foundedYear}</p>
            <p style={{ marginTop: "8px", lineHeight: "1.4" }}>
              {selectedMonastery.description?.slice(0, 140)}...
            </p>
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              marginTop: "10px",
            }}
          >
            <button
              style={{
                padding: "10px 18px",
                background: "#DA4167",
                color: "white",
                fontWeight: "600",
                borderRadius: "8px",
                cursor: "pointer",
                border: "none",
                boxShadow: "0 4px 10px rgba(218,65,103,0.4)",
                transition: "0.2s",
              }}
              onClick={() => router.push(`/monastery/${selectedMonastery._id}`)}
            >
              View More
            </button>

            <button
              onClick={() => setSelectedMonastery(null)}
              style={{
                padding: "10px 18px",
                background: "white",
                color: "#DA4167",
                fontWeight: "600",
                borderRadius: "8px",
                cursor: "pointer",
                border: "2px solid #DA4167",
                transition: "0.2s",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
