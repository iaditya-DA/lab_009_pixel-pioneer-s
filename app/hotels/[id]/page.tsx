"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  MapPin,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Star,
  Loader2,
  Wallet,
  Building2,
} from "lucide-react";

interface IHotel {
  _id: string;
  name: string;
  description?: string;
  images: string[];
  address: string;
  pricePerNight: number;
  rating: number;
  available: boolean;
  owner?: string;
  closestMonastery?: string;
  location: { lat: number; lng: number };
  googleMapsEmbedUrl?: string;
}

export default function HotelDetail() {
  const params = useParams();
  const hotelId = params?.id as string;

  const [hotel, setHotel] = useState<IHotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await fetch(`/api/hotels/${hotelId}`);

        if (!res.ok) throw new Error("Hotel not found!");

        const data = await res.json();
        setHotel(data);
      } catch (err) {
        setError("Failed to load hotel details.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [hotelId]);

  const nextImage = () => {
    if (!hotel) return;
    setCurrentImage((prev) => (prev + 1) % hotel.images.length);
  };

  const prevImage = () => {
    if (!hotel) return;
    setCurrentImage((prev) => (prev - 1 + hotel.images.length) % hotel.images.length);
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );

  if (error || !hotel)
    return (
      <div className="h-screen flex items-center justify-center text-red-500 text-lg">
        {error ?? "Hotel not found!"}
      </div>
    );

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="border-b py-4 px-6 sticky top-0 bg-white z-40 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">{hotel.name}</h1>

        <div className="flex gap-2">
          <button className="p-3 hover:bg-gray-100 rounded-full transition">
            <Share2 size={20} />
          </button>

          <button
            onClick={() => setLiked(!liked)}
            className="p-3 hover:bg-gray-100 rounded-full transition"
          >
            <Heart
              size={20}
              fill={liked ? "red" : "none"}
              className={liked ? "text-red-500" : "text-gray-900"}
            />
          </button>
        </div>
      </div>

      {/* Images */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <div className="relative h-96 rounded-xl overflow-hidden group">
          <img
            src={hotel.images[currentImage]}
            className="w-full h-full object-cover"
            alt="Hotel"
          />

          <button
            onClick={prevImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 mt-4">
          {hotel.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImage(idx)}
              className={`w-24 h-20 overflow-hidden rounded-lg border-2 ${
                currentImage === idx ? "border-gray-900" : "border-gray-200"
              }`}
            >
              <img src={img} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-3 gap-12">
        <div className="col-span-2">
          <h1 className="text-3xl font-bold mb-3 text-gray-900">
            {hotel.name}
          </h1>

          <div className="flex items-center gap-2 mb-4">
            <Star size={18} className="text-yellow-500 fill-yellow-500" />
            <span className="font-semibold text-gray-900">{hotel.rating}</span>
            <span className="text-gray-600">/ 5</span>
          </div>

          <p className="text-gray-700 leading-relaxed">{hotel.description}</p>

          <div className="mt-6 flex items-start gap-2 text-gray-700 text-sm">
            <MapPin size={16} />
            <span>{hotel.address}</span>
          </div>

          {hotel.closestMonastery && (
            <p className="mt-4 inline-block bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg text-sm font-semibold">
              Near {hotel.closestMonastery}
            </p>
          )}

          {/* Owner Info */}
          {hotel.owner && (
            <div className="mt-6 flex items-center gap-2">
              <Building2 size={20} className="text-gray-700" />
              <span className="text-gray-700 font-medium">
                Owned by {hotel.owner}
              </span>
            </div>
          )}
        </div>

        {/* Booking Card */}
        <div className="border p-6 rounded-2xl shadow-lg h-fit">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">
                ₹{hotel.pricePerNight.toLocaleString()}
              </h2>
              <span className="text-gray-600 text-sm">per night</span>
            </div>
          </div>

          <div className="text-sm mb-4">
            {hotel.available ? (
              <span className="text-green-600 font-semibold">Available</span>
            ) : (
              <span className="text-red-600 font-semibold">Not Available</span>
            )}
          </div>

          <button
            disabled={!hotel.available}
            className={`w-full py-3 rounded-xl font-semibold text-white ${
              hotel.available
                ? "bg-gray-900 hover:bg-gray-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Book Now
          </button>
        </div>
      </section>

      {/* Google Map */}
      {hotel.googleMapsEmbedUrl && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <iframe
            src={hotel.googleMapsEmbedUrl}
            className="w-full h-96 rounded-xl"
            loading="lazy"
          ></iframe>
        </section>
      )}
    </div>
  );
}
