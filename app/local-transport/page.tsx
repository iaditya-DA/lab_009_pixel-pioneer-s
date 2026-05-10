"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Bus, 
  Car, 
  CarFront, 
  MapPin, 
  Phone, 
  Star, 
  Clock, 
  Calendar, 
  Send, 
  Users, 
  Plane, 
  Compass,
  Utensils,
  Bike,
  BookmarkPlus
} from "lucide-react";

// The interfaces and data remain the same for functionality
interface LocalServiceExtended {
  name: string;
  icon?: string;
  category: string;
  categoryIcon?: string;
  location?: string;
  address?: string;
  businessHours?: string;
  established?: string;
  rating?: string;
  totalRatings?: string;
  ratings?: string;
  phone?: string;
  user_provided_phone?: string;
  google_map_link?: string;
  notes?: string;
  isDynamic?: boolean;
  price?: string;
}

export const staticServices: LocalServiceExtended[] = [
  // -------------------------------
  // SIKKIM — Transport Services
  // -------------------------------
  {
    name: "Beeranbaan Tours & Travels",
    icon: "🚗",
    category: "Car Rental / Taxi Service",
    categoryIcon: "🏢",
    location: "Tadong, Gangtok, Sikkim",
    businessHours: "Open until 11:45 PM",
    established: "2019",
    rating: "4.8",
    totalRatings: "185",
    phone: "8487862974",
    notes: "Offers car rental services; available for instant help. Alternate contact also available.",
  },
  {
    name: "Sikkim Taxi",
    icon: "🚕",
    category: "Taxi Service / Cab",
    categoryIcon: "🚖",
    location: "M G Marg, Bazar, Gangtok - 737101",
    businessHours: "Open until 11:00 PM",
    established: "2012",
    rating: "4.5",
    totalRatings: "95",
    phone: "8460194796",
    notes: "Basic taxi service listed under Gangtok, ideal for local city rides.",
  },
  {
    name: "Himalayan Car Rentals",
    icon: "🏔",
    category: "Premium Car Rental",
    categoryIcon: "🚙",
    location: "Development Area, Gangtok",
    businessHours: "24/7 Available",
    established: "2015",
    rating: "4.9",
    totalRatings: "320",
    phone: "9876543210",
    notes: "Premium vehicles for luxury travel and long highway trips.",
  },
  {
    name: "Sikkim Tours & Travels",
    icon: "🗺",
    category: "Tour Operator",
    categoryIcon: "🌄",
    location: "Tibet Road, Gangtok",
    businessHours: "9:00 AM - 9:00 PM",
    established: "2010",
    rating: "4.7",
    totalRatings: "215",
    phone: "9123456789",
    notes: "Complete tour packages for Sikkim including permits and guided tours.",
  },
  {
    name: "North Sikkim Cabs",
    icon: "🚐",
    category: "Mountain Taxi Service",
    categoryIcon: "🏔",
    location: "Lal Bazaar, Gangtok",
    businessHours: "6:00 AM - 10:00 PM",
    established: "2017",
    rating: "4.6",
    totalRatings: "142",
    phone: "9988776655",
    notes: "Specialized in North Sikkim routes like Lachen, Lachung and Gurudongmar.",
  },
  {
    name: "Airport Transfer Service",
    icon: "✈",
    category: "Airport Pickup & Drop",
    categoryIcon: "🚗",
    location: "Pakyong Airport, Sikkim",
    businessHours: "24/7 Available",
    established: "2018",
    rating: "4.8",
    totalRatings: "278",
    phone: "9445566778",
    notes: "Direct airport transfers to Gangtok and nearby towns.",
  },

  // -------------------------------
  // SIKKIM — Extra Verified Listings
  // -------------------------------
  {
    name: "Ne Taxi",
    icon: "🚕",
    category: "Car Rental / Taxi Service",
    categoryIcon: "🚖",
    location: "Tadong, Gangtok, Sikkim",
    address: "Below Central Bank, Opp Comfort Inn, Gairiqoan, Tadong, Gangtok",
    businessHours: "Open 24 Hrs",
    established: "2013",
    rating: "4.3",
    totalRatings: "211",
    ratings: "4.3 (211 ratings)",
    phone: "+91 80010 00199 / +91 80010 00195",
    user_provided_phone: "+917947411566",
    google_map_link: "",
    notes: "12+ years in business. Awarded State Award (Government of Sikkim, 2018).",
  },
  {
    name: "Ontaxi Services",
    icon: "🚙",
    category: "Car Rental",
    categoryIcon: "🚗",
    location: "Gangtok Bazar, Gangtok, Sikkim",
    address: "Gangtok Bazar, Gangtok",
    businessHours: "Open until 7:00 PM",
    established: "2020",
    rating: "4.9",
    totalRatings: "27",
    ratings: "4.9 (27 ratings)",
    phone: "+91 80010 00199 / +91 74790 49115",
    google_map_link: "",
    notes: "Verified operator, taxi services starting at ₹4,500 for sightseeing and outstation trips.",
  },

  // -------------------------------
  // SIKKIM — Additional Mock Services
  // -------------------------------
  {
    name: "MG Marg City Cabs",
    icon: "🚕",
    category: "City Taxi Service",
    categoryIcon: "🏙",
    location: "MG Marg, Gangtok, Sikkim",
    businessHours: "7:00 AM - 10:30 PM",
    established: "2016",
    rating: "4.4",
    totalRatings: "132",
    phone: "7000012345",
    notes: "Ideal for short city rides, shopping runs and cafe hopping around Gangtok.",
  },
  {
    name: "Pelling Hill Cabs",
    icon: "🚐",
    category: "Sightseeing Taxi Service",
    categoryIcon: "🌄",
    location: "Pelling, West Sikkim",
    businessHours: "6:30 AM - 9:00 PM",
    established: "2014",
    rating: "4.7",
    totalRatings: "88",
    phone: "7001122233",
    notes: "Covers Pemayangtse, Rabdentse Ruins, Skywalk and nearby viewpoints.",
  },
  {
    name: "Ravangla Shuttle & Tours",
    icon: "🚐",
    category: "Local Shuttle / Tour Service",
    categoryIcon: "🛺",
    location: "Ravangla, South Sikkim",
    businessHours: "7:00 AM - 8:30 PM",
    established: "2018",
    rating: "4.6",
    totalRatings: "64",
    phone: "7001456789",
    notes: "Daily shuttles to Buddha Park, Ralang Monastery and nearby villages.",
  },
  {
    name: "Lachen & Lachung Roadline",
    icon: "🚌",
    category: "Mountain Route Operator",
    categoryIcon: "🏔",
    location: "Vajra Stand, Gangtok, Sikkim",
    businessHours: "5:30 AM - 7:00 PM",
    established: "2011",
    rating: "4.5",
    totalRatings: "156",
    phone: "7001987654",
    notes: "Shared and private vehicles for North Sikkim circuits including Gurudongmar and Yumthang.",
  },
  {
    name: "Zero Point Expedition Rides",
    icon: "🚙",
    category: "Off-road Expedition Taxi",
    categoryIcon: "🧭",
    location: "Lachung, North Sikkim",
    businessHours: "6:00 AM - 5:00 PM",
    established: "2019",
    rating: "4.8",
    totalRatings: "73",
    phone: "7001765432",
    notes: "Specialized jeeps for snow routes and high-altitude sectors up to Zero Point (Yumesamdong).",
  },
  {
    name: "Pakyong Airport Prepaid Taxi Booth",
    icon: "🚖",
    category: "Airport Taxi Counter",
    categoryIcon: "✈",
    location: "Pakyong Airport, Sikkim",
    businessHours: "Flight Operational Hours",
    established: "2018",
    rating: "4.2",
    totalRatings: "190",
    phone: "Not Available",
    notes: "Official prepaid counter for fixed-rate taxis to Gangtok and nearby towns.",
  },
  {
    name: "Namchi Local Cabs",
    icon: "🚕",
    category: "City & Temple Taxi",
    categoryIcon: "🛕",
    location: "Namchi, South Sikkim",
    businessHours: "7:00 AM - 9:00 PM",
    established: "2015",
    rating: "4.5",
    totalRatings: "54",
    phone: "7001678901",
    notes: "Covers Char Dham, Samdruptse and local monasteries around Namchi.",
  },
];

export default function TransportPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dynamicServices, setDynamicServices] = useState<LocalServiceExtended[]>([]);

  useEffect(() => {
    console.log("Fetching dynamic services...");
    fetch("/api/services", { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        console.log("Dynamic services data received:", data);
        if (data.success) {
          console.log(`Received ${data.services.length} services from API.`);
          const formatted = data.services.map((s: any) => {
            console.log(`Formatting service: ${s.providerName}, Type: ${s.serviceType}, Status: ${s.status}`);
            return {
              name: s.providerName + "'s " + s.serviceType,
              category: s.serviceType,
              location: s.location || "Sikkim",
              phone: s.phone,
              notes: s.description || `Available from ${new Date(s.startDate).toLocaleDateString()} to ${new Date(s.endDate).toLocaleDateString()}`,
              rating: "New",
              totalRatings: "0",
              businessHours: "Flexible",
              isDynamic: true,
              price: s.price ? `₹${s.price}` : "Contact for Price"
            };
          });
          setDynamicServices(formatted);
        }
      })
      .catch(err => console.error("Error fetching dynamic services", err));
  }, []);

  const allServicesList = [...staticServices, ...dynamicServices];
  
  // Dynamically generate unique categories and their corresponding icons
  const uniqueCategories = useMemo(() => {
    const categories = [
        { name: "Taxi & City Cabs", icon: CarFront },
        { name: "Car Rentals (Self/Driver)", icon: Car },
        { name: "Mountain & Outstation", icon: Bus },
        { name: "Airport Transfers", icon: Plane },
        { name: "Tours & Shuttles", icon: Compass },
        { name: "Tourist Guide", icon: Users },
        { name: "Home Kitchen", icon: Utensils },
        { name: "Rent 2 Wheeler", icon: Bike },
        { name: "Rent 4 Wheeler", icon: Car },
    ];

    categories.unshift({ name: "All", icon: Users });
    return categories;
  }, []);
  
  const filteredServices = allServicesList.filter((s) => {
    if (selectedCategory === "All") return true;

    const cat = s.category.toLowerCase();
    const sel = selectedCategory.toLowerCase();

    // Filter logic to match the grouped category names
    if (selectedCategory === "Taxi & City Cabs") {
      return cat.includes("taxi") || cat.includes("cab") || cat.includes("city taxi");
    }
    if (selectedCategory === "Car Rentals (Self/Driver)") {
      return cat.includes("rental") || cat.includes("premium car");
    }
    if (selectedCategory === "Mountain & Outstation") {
      return cat.includes("mountain") || cat.includes("expedition");
    }
    if (selectedCategory === "Airport Transfers") {
      return cat.includes("airport") || cat.includes("transfer");
    }
    if (selectedCategory === "Tours & Shuttles") {
      return cat.includes("tour operator") || cat.includes("shuttle");
    }
    
    return cat.trim() === sel.trim();
  });

  console.log(`Rendering ${filteredServices.length} services (Filtered from ${allServicesList.length}) for category: ${selectedCategory}`);


  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* 1. HERO SECTION (Sleek & Clean) */}
      <section className="relative overflow-hidden py-16 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Find <span className="text-yellow-600">Verified Services</span> in Sikkim
          </h1>

          <p className="mt-3 text-lg text-gray-500 max-w-3xl mx-auto">
            Trusted Taxi, Cab Rentals, and Tour Operators for local travel and outstation circuits across Gangtok, Pelling & North Sikkim.
          </p>
        </div>
      </section>

      {/* 2. FILTER BUTTONS (JustDial-style Tabs) */}
      <section className="container mx-auto px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 ml-2">Browse by Service Type:</h2>
        <div className="flex flex-wrap gap-2 md:gap-3 lg:gap-4 overflow-x-auto pb-4">
          {uniqueCategories.map((c) => {
            const Icon = c.icon;
            const isSelected = selectedCategory === c.name;
            return (
              <button
                key={c.name}
                onClick={() => setSelectedCategory(c.name)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm border
                  ${isSelected
                    ? "bg-yellow-500 text-white border-yellow-500 shadow-md transform scale-[1.02] active:scale-100"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                  }`}
              >
                <Icon size={18} className={isSelected ? "text-white" : "text-yellow-600"} />
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* 3. SERVICE CARDS (Sleek & Dense Information) */}
      <section className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service, index) => {
          const mainContact = service.phone || service.user_provided_phone || 'Contact N/A';
          const isVerified = service.notes?.includes("Verified operator") || service.notes?.includes("State Award") || service.isDynamic;
          
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              
              {/* Card Header (Title & Verification) */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center truncate max-w-[200px]">
                    {service.name}
                  </h3>
                  {isVerified && (
                    <span className="text-[10px] font-bold px-2 py-1 bg-green-50 text-green-700 rounded-full border border-green-200 uppercase tracking-tighter shrink-0">
                      ✅ {service.isDynamic ? "User Verified" : "Verified"}
                    </span>
                  )}
                </div>
                <span className="text-xs text-yellow-600 font-medium">{service.category}</span>
              </div>

              {/* Card Body (Info Grid) */}
              <div className="p-4 space-y-3 flex-grow">
                
                {/* Rating & Price */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm font-semibold text-gray-800">
                      <Star size={16} className="text-yellow-500 mr-2" fill="#FBBF24" />
                      <span className="text-lg text-gray-900">{service.rating || "N/A"}</span>
                      <span className="text-gray-500 font-normal ml-1">({service.totalRatings || "0 ratings"})</span>
                    </div>
                    {service.price && (
                        <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                            {service.price}
                        </span>
                    )}
                </div>
                
                {/* Location */}
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">{service.location || "Multiple Locations"}</p>
                    {service.address && <p className="text-xs italic mt-0.5">{service.address}</p>}
                  </div>
                </div>

                {/* Business Hours & Established */}
                <div className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-100 pt-3">
                    <div className="flex items-center">
                        <Clock size={14} className="text-blue-500 mr-2" />
                        <span className="font-medium text-gray-700">{service.businessHours || "Flexible"}</span>
                    </div>
                    {service.established && (
                        <div className="flex items-center text-xs">
                            <Calendar size={14} className="text-gray-400 mr-1" />
                            Est. {service.established}
                        </div>
                    )}
                </div>

                {/* Notes/Highlights */}
                {service.notes && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold mb-1">Description:</p>
                    <p className="text-sm text-gray-700 italic leading-snug">
                      {service.notes}
                    </p>
                  </div>
                )}
                
              </div>

              {/* Card Footer (Buttons) */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col space-y-3 rounded-b-xl">
                
                <div className="flex gap-2">
                    <a
                      href={`tel:${mainContact.replace(/\s/g, '').split('/')[0].replace(/\+/g, '')}`}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-xl transition-all duration-200 text-sm font-bold shadow-sm hover:bg-gray-50"
                    >
                      <Phone size={18} className="text-yellow-500" />
                      <span>Call Now</span>
                    </a>

                    <button
                      onClick={() => alert("Booking request sent to " + service.name)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-yellow-500 text-white rounded-xl transition-all duration-200 text-sm font-bold shadow hover:bg-yellow-600 shadow-yellow-200"
                    >
                      <BookmarkPlus size={18} />
                      <span>Book Now</span>
                    </button>
                </div>
              </div>

            </div>
          );
        })}
      </section>
      
      {/* Fallback for no results */}
      {filteredServices.length === 0 && (
        <div className="container mx-auto px-4 py-20 text-center">
          <Send size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-xl text-gray-600">No services found for "{selectedCategory}". Try selecting "All".</p>
        </div>
      )}

    </div>
  );
}