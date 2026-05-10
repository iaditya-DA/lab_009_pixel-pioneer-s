"use client";

import React, { useState, useEffect } from "react";
import { 
  Building2, 
  MapPin, 
  Star, 
  DollarSign, 
  Search, 
  Calendar,
  Navigation,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Phone,
  BookmarkPlus,
  ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Hotel {
  _id: string;
  name: string;
  description?: string;
  images: string[];
  address: string;
  pricePerNight: number;
  rating?: number;
  available: boolean;
  closestMonastery?: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
}

export default function HotelsPage() {
  const router = useRouter();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/hotels");
      if (response.ok) {
        const data = await response.json();
        setHotels(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHotels = hotels.filter((hotel) =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500 pt-16 pb-32 px-4 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center text-white/80 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-sm">
            Premium Stays
          </h1>
          <p className="text-xl text-yellow-50 max-w-2xl font-medium opacity-90">
            Discover the most comfortable and authentic accommodations near Sikkim's spiritual landmarks.
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-amber-600/20 rounded-full blur-2xl"></div>
      </div>

      {/* Search & Filter Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-gray-200/50 p-8 border border-gray-100 transition-all">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full md:max-w-lg group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-yellow-500 transition-colors" size={22} />
              <input
                type="text"
                placeholder="Search by hotel name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 outline-none transition-all font-medium text-gray-700 shadow-sm"
              />
            </div>
            
            <div className="flex gap-3">
               <div className="px-6 py-4 bg-yellow-50 rounded-2xl border border-yellow-100 flex items-center gap-3">
                  <Building2 size={20} className="text-yellow-600" />
                  <span className="font-bold text-yellow-700">{filteredHotels.length} Hotels Available</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-yellow-500 mb-4" size={48} />
            <p className="text-gray-500 font-medium text-lg">Finding the best rooms for you...</p>
          </div>
        ) : filteredHotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredHotels.map((hotel) => (
              <div 
                key={hotel._id} 
                className="group bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-gray-200/40 border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image Section */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={hotel.images[0] || "/hotel-placeholder.jpg"}
                    alt={hotel.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                  
                  {/* Badge */}
                  <div className="absolute top-5 right-5 bg-white/95 backdrop-blur px-4 py-2 rounded-2xl shadow-lg border border-white/20 flex items-center gap-2">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-gray-900">{hotel.rating || "New"}</span>
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-5 left-5 text-white">
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold tracking-tighter">₹{hotel.pricePerNight}</span>
                        <span className="text-sm font-medium opacity-80">/night</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors truncate">
                      {hotel.name}
                    </h3>
                    <div className="flex items-start gap-2 text-gray-500 font-medium">
                      <MapPin size={18} className="text-yellow-500 shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">{hotel.address}</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {hotel.closestMonastery && (
                      <div className="px-3 py-1.5 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-lg border border-yellow-100 uppercase tracking-wide">
                        Near {hotel.closestMonastery}
                      </div>
                    )}
                    <div className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg border border-gray-100 uppercase tracking-wide">
                      {hotel.available ? "Available" : "Sold Out"}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => alert("Booking functionality coming soon!")}
                      className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-extrabold py-4 rounded-2xl shadow-lg shadow-yellow-200/50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group/btn"
                    >
                      <span>Book Now</span>
                      <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <button className="p-4 bg-gray-50 text-gray-400 hover:bg-yellow-50 hover:text-yellow-600 rounded-2xl border border-gray-100 transition-all">
                        <BookmarkPlus size={22} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <Building2 size={64} className="mx-auto text-gray-200 mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">No Hotels Found</h2>
            <p className="text-gray-500 max-w-sm mx-auto">We couldn't find any hotels matching your search. Try adjusting your filters.</p>
          </div>
        )}
      </div>

      {/* CTA Footer */}
      <div className="bg-gray-900 py-20 px-4 mt-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-extrabold text-white mb-6">Are you a Hotel Owner?</h2>
          <p className="text-gray-400 text-xl mb-10 leading-relaxed">
            Partner with TravelSync and reach thousands of travelers visiting Sikkim's monasteries.
          </p>
          <button 
            onClick={() => router.push("/hotel-admin")}
            className="px-10 py-5 bg-white text-gray-900 font-black rounded-2xl hover:bg-yellow-400 transition-all shadow-2xl active:scale-95"
          >
            List Your Hotel
          </button>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-10 left-10 w-40 h-40 border-8 border-white rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-60 h-60 border-8 border-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
