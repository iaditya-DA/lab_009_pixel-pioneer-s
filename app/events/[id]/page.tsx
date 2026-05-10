"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type EventDetail = {
  _id: string;
  monasteryId: string;
  eventName: string;
  category: string;
  startDate: string;
  endDate?: string;
  time?: string;
  duration?: string;
  location?: string;
  description?: string;
  highlights?: string[];
  images: string[];
  bookingAvailable?: boolean;
  ticketPrice?: number;
};

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id;
  const router = useRouter();

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/${eventId}`);
        if (!res.ok) throw new Error("Failed to fetch event data");
        const data = await res.json();
        setEvent(data);
        console.log(data);
        
        setSelectedImageIndex(0);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (eventId) fetchEvent();
  }, [eventId]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!event) return <p className="text-center mt-10">Event not found.</p>;
  return (
  <div className="min-h-screen bg-[#faf8f2]">

    {/* HERO SECTION */}
    <div className="relative h-[420px] w-full overflow-hidden shadow-lg">
      <img
        src={event.images[selectedImageIndex]}
        className="w-full h-full object-cover brightness-90"
        alt={event.eventName}
      />

      {/* overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

      {/* title */}
      <div className="absolute bottom-10 left-10 text-white">
        <button
          onClick={() => router.back()}
          className="text-sm mb-3 inline-flex items-center gap-1 opacity-80 hover:opacity-100 transition"
        >
          ← Back to Events
        </button>

        <h1 className="text-5xl font-bold leading-tight drop-shadow-xl">
          {event.eventName}
        </h1>

        <span className="mt-4 inline-block px-5 py-1 text-sm font-semibold rounded-full
          bg-white/20 backdrop-blur-md border border-white/30">
          {event.category}
        </span>
      </div>
    </div>

    {/* MAIN CONTENT */}
    <div className="max-w-6xl mx-auto p-10 space-y-12">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT - IMAGE + DESCRIPTION */}
        <div className="lg:col-span-2 space-y-10">

          {/* Main Image */}
          <div className="rounded-2xl overflow-hidden shadow-lg border border-yellow-700/20">
            <img
              src={event.images[0]}
              className="w-full h-[360px] object-cover hover:scale-105 transition duration-700"
            />
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-yellow-700/20 shadow-lg p-8">
            <h2 className="text-3xl font-bold text-yellow-700 italic mb-4">About Event</h2>
            <p className="text-gray-800 leading-relaxed text-lg text-justify">
              {event.description}
            </p>
          </div>

          {/* Highlights */}
          <div className="bg-white rounded-2xl border border-yellow-700/20 shadow-lg p-8">
            <h2 className="text-2xl font-bold text-yellow-700 italic mb-4">✨ Highlights</h2>
            <ul className="space-y-2 text-gray-800 text-lg">
              {event.highlights?.map((h, i) => (                
                <li key={i} className="flex gap-2 items-start">
                  <span>—</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
          {event.bookingAvailable && (
            <button className="w-full py-4 text-lg font-bold rounded-2xl text-white 
              bg-gradient-to-r from-yellow-600 to-orange-700 shadow-xl hover:scale-105 transition">
              Book Tickets
            </button>
          )}
        </div>
        {/* RIGHT - DETAILS + GALLERY */}
        <div className="space-y-8">
          {/* INFO CARD */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-700/20">
            <h2 className="text-2xl font-extrabold mb-6 text-gray-900">
              Event Information
            </h2>
            <div className="space-y-3 text-gray-800 text-lg">
              <p><strong>📅 Start:</strong> {event.startDate}</p>
              <p><strong>📅 End:</strong> {event.endDate}</p>
              <p><strong>⏳ Duration:</strong> {event.duration}</p>
              <p><strong>⏰ Time:</strong> {event.time}</p>
              <p><strong>📍 Location:</strong> {event.location}</p>
              <p><strong>💵 Price:</strong> ₹{event.ticketPrice}</p>
            </div>
          </div>

          {/* Gallery */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-yellow-700/20">
            <h2 className="text-xl font-bold mb-4">📸 Gallery</h2>
            <div className="grid grid-cols-3 gap-3 max-h-[410px] overflow-y-auto pr-1">
              {event.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`h-28 object-cover rounded-xl cursor-pointer transition shadow-md
                    ${selectedImageIndex === i ? "ring-4 ring-yellow-600 scale-105" : "opacity-80 hover:opacity-100"}
                  `}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);


}
