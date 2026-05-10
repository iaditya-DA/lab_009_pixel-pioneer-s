"use client";

import { MapPin, Star, Share2 } from "lucide-react";
import dynamic from "next/dynamic";

const AerialMap = dynamic(() => import("../functions/AerialMap"), { ssr: false });

interface MonasteryAerialPageProps {
  name: string;
  description: string;
  lat: number;
  lng: number;
  foundedYear: number;
  altitude: string;
  nearbyAttractions: string[];
  rating: number;
  reviewsCount: number;
  locationText: string;
}

export default function MonasteryAerialPage({
  name = "Default Monastery",
  description = "This is a default description for testing purposes.",
  lat = 27.533,
  lng = 88.512,
  foundedYear = 1900,
  altitude = "2000m",
  nearbyAttractions = [],
  rating = 4.5,
  reviewsCount = 100,
  locationText = "Gangtok, Sikkim",
}: any) {
  return (
    <div className="w-full bg-white">
      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2">
            {/* Map */}
            <div className="w-full h-[60vh] lg:h-[500px] rounded-xl overflow-hidden shadow-sm border border-gray-200 mb-8">
              <AerialMap lat={lat} lng={lng} zoom={18} />
            </div>

            {/* About Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                About {name}
              </h2>

              <p className="text-gray-700 text-base leading-relaxed mb-6">
  {description.length > 300
    ? description.slice(0, 300) + "..."
    : description}
</p>


              {/* Highlights */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Elevation</p>
                  <p className="text-lg font-medium text-gray-900">
                    {altitude}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Founded</p>
                  <p className="text-lg font-medium text-gray-900">
                    {foundedYear}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Nearby Attractions</p>
                  <p className="text-sm text-gray-800">
                 {(nearbyAttractions ?? []).join(", ")}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="text-sm font-medium text-gray-900">
                    {locationText}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE — INFO CARD */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 p-6 border border-gray-200 rounded-xl shadow-sm bg-white">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  <span className="font-medium text-gray-900">{rating}</span>
                  <span className="text-gray-500">
                    ({reviewsCount} reviews)
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-1">Location</p>
                <p className="text-lg font-semibold text-gray-900">
                  {locationText}
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  {lat}° N, {lng}° E
                </p>
              </div>

              <hr className="my-4" />

              {/* Example Extra Info */}
              <button className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition mb-2">
                Get Directions
              </button>
              <button className="w-full border border-gray-300 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-50 transition">
                More Info
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
