"use client"
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  MapPin,
  Calendar,
  Users,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Star,
  Loader2,
  Wifi,
  Utensils,
  Wind,
  Droplet,
  Compass,
  Map as MapIcon
} from 'lucide-react';

type Location = string | { lat: number; long: number; address: string };

interface IMonasteryEvent {
  _id: string;
  eventName: string;
  startDate: string;
  endDate: string;
  time: string;
  duration: string;
  location: {
    lat: number;
    lng: number;
  };
  foundedYear: number;
  description: string;
  highlights: string;
  bookingAvailable: boolean;
  ticketPrice: number;
  totaltickets: number;
  bookedTickets: number;
  googleMapsLink: string
}

interface IEvent {
  _id: string;
  monasteryId: string;
  eventName: string;
  startDate: string;
  endDate: string;
  time: string;
  duration: string;
  location: string;
  description: string;
  highlights: string;
  images: string[];
  bookingAvailable: boolean;
  ticketPrice: number;
  totaltickets: number;
  bookedTickets: number;
  createdAt: string;
  updatedAt: string;
}

interface IMonasteryData {
  _id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  altitude: string;
  foundedYear: number;
  rating: number;
  reviews: number;
  guestFavorite: boolean;
  description: string;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  nearbyAttractions: string[];
  images: string[];
  price: number;
  originalPrice: number;
  perNight: string;
  amenities: string[] | null;
  events: IMonasteryEvent[] | null;
  googleMapsLink: string;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export default function MonasteryDetail() {
  const params = useParams();
  const router = useRouter();
  const monasteryId = (params?.id as string | null | undefined) ?? null;

  const [monastery, setMonastery] = useState<IMonasteryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (!monasteryId) {
      setIsLoading(false);
      return;
    }

    const fetchMonastery = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/monastries/${monasteryId}`);

        if (!res.ok) {
          if (res.status === 404) throw new Error(`Monastery with ID ${monasteryId} not found.`);
          throw new Error(`Failed to fetch monastery details. Status: ${res.status}`);
        }

        const data: IMonasteryData = await res.json();
        console.log("Monastry That i fetched:", data);
        setMonastery(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error while fetching data.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonastery();
  }, [monasteryId]);

  useEffect(() => {
    if (!monasteryId) return;

    const fetchEvents = async () => {
      setEventsLoading(true);

      try {
        const res = await fetch(`/api/events/event-by-monastries/${monasteryId}`);

        if (!res.ok) {
          throw new Error(`Failed to fetch events. Status: ${res.status}`);
        }
        const data = await res.json();
        const eventsList: IEvent[] = data.events || [];
        setEvents(eventsList);
        if (eventsList.length > 0) {
          setSelectedEventId(eventsList[0]._id);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setEvents([]);
      } finally {
        setEventsLoading(false);
      }
    };

    fetchEvents();
  }, [monasteryId]);

  const handleLikeToggle = async () => {
    const newLikedState = !liked;
    setLiked(newLikedState);

    try {
      const res = await fetch("/api/liked-monastery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          monasteryId,
          liked: newLikedState,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update like status");
      }

      console.log("Like updated:", await res.json());
    } catch (err) {
      console.error("Error updating like:", err);
      setLiked(!newLikedState);
    }
  };

  const handlePayment = async () => {
    if (!selectedEvent) return;

    try {
      setPaymentLoading(true);

      // 1️⃣ Create order from your API
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedEvent.ticketPrice * 100, // Razorpay expects amount in paise
          eventId: selectedEvent._id,
          monasteryId: monastery?._id,
        }),
      });

      const order = await orderRes.json();

      // 2️⃣ Load Razorpay SDK
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);

      script.onload = () => {
        // 3️⃣ Open Razorpay Checkout
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID!,
          amount: order.amount,
          currency: order.currency,
          name: "Sikkim Monastery Platform",
          description: `Ticket for ${selectedEvent.eventName}`,
          order_id: order.id,
         handler: async function (response: RazorpayResponse) {
  console.log("Payment Success:", response);

  await fetch("/api/create-tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      paymentId: response.razorpay_payment_id,
      orderId: response.razorpay_order_id,
      signature: response.razorpay_signature,

      eventId: selectedEvent._id,
      ticketPrice: selectedEvent.ticketPrice,
      numberOfPeople: 1,
      totalAmount: selectedEvent.ticketPrice * 1,
    }),
  });


}
,
          theme: {
            color: "#ef4444", // red vibe
          },
        };

        // @ts-ignore
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
    } catch (err) {
      console.error("Payment Error:", err);
      alert("❌ Payment failed. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const getLocationString = (location: Location): string => {
    if (typeof location === 'string') return location;
    if (typeof location === 'object' && location !== null && 'address' in location) return location.address;
    return 'Location details unavailable';
  };

  const getSelectedEvent = (): IEvent | null => {
    return events.find(e => e._id === selectedEventId) || null;
  };

  const handleViewOnMap = (googleMapsLink: string): void => {
    window.open(googleMapsLink, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Loader2 className="animate-spin text-gray-900 mr-3" size={32} />
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50 text-red-700 p-8">
        <p className="text-lg font-semibold">🛑 Error: {error}</p>
      </div>
    );
  }

  if (!monastery) {
    return null;
  }

  const amenities = monastery.amenities ?? [];
  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % monastery.images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + monastery.images.length) % monastery.images.length);
  const selectedEvent = getSelectedEvent();

  return (
    <div className="bg-white min-h-screen">
      {/* Navigation Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Sosa Homestays</h1>
          <div className="flex gap-2">
            <button className="p-3 hover:bg-gray-100 rounded-full transition">
              <Share2 size={20} className="text-gray-900" />
            </button>
            <button onClick={handleLikeToggle} className="p-3 hover:bg-gray-100 rounded-full transition">
              <Heart size={20} fill={liked ? 'currentColor' : 'none'} className={liked ? 'text-yellow-400' : 'text-gray-900'} />
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-3 gap-2 h-96 mb-4 rounded-xl overflow-hidden">
          <div className="col-span-2 row-span-2 relative group bg-gray-200 cursor-pointer">
            <img
              src={monastery.images[currentImageIndex]}
              alt="Monastery"
              className="w-full h-full object-cover"
            />

            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition z-10"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition z-10"
            >
              <ChevronRight size={20} />
            </button>

            <button
              onClick={() => setShowAllPhotos(true)}
              className="absolute bottom-3 right-3 bg-white hover:bg-gray-100 px-3 py-2 rounded-lg text-sm font-semibold transition"
            >
              Show all photos
            </button>
          </div>

          {monastery.images.slice(1, 3).map((img, idx) => (
            <div
              key={idx}
              className="relative bg-gray-200 overflow-hidden cursor-pointer group"
            >
              <img
                src={img}
                alt={`Gallery ${idx + 2}`}
                className="w-full h-full object-cover group-hover:opacity-80 transition"
                onClick={() => setCurrentImageIndex(idx + 1)}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          {monastery.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`w-20 h-20 overflow-hidden border-2 transition ${idx === currentImageIndex ? "border-gray-900" : "border-gray-300"
                } rounded-lg`}
            >
              <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-3 gap-12">
        <div className="col-span-2">
          {/* Title & Rating */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h1 className="text-3xl font-semibold text-gray-900 mb-3">{monastery.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star size={16} className="fill-gray-900 text-gray-900" />
                <span className="font-semibold text-gray-900">{monastery.rating}</span>
                <span className="text-gray-600">4.2 rating</span>
              </div>
              {monastery.guestFavorite && <span className="text-sm text-gray-700">⭐ Guest favorite</span>}
            </div>
          </div>

          {/* Details */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <div className="grid grid-cols-4 gap-6 mb-6">




            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-gray-900 mt-1 shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Location</div>
                  <div className="text-gray-600">{monastery.location.lat}, {monastery.location.lng}</div>
                </div>
              </div>
              <button
                onClick={() => handleViewOnMap(monastery.googleMapsLink)}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-900 text-sm font-medium rounded-lg shadow-sm text-gray-900 bg-white hover:bg-gray-50 transition duration-150 gap-2"
              >
                <MapIcon size={18} />
                View on Map
              </button>
            </div>
          </div>

          {/* About */}
          <div className="mb-12 pb-8 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">About this monastery</h2>
            <p className="text-gray-700 leading-relaxed text-base">{monastery.description}</p>
          </div>

          {/* Location Map */}
          <div className="mb-12 pb-8 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Location</h2>
            <iframe
              width="100%"
              height="400"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${monastery.location.lat},${monastery.location.lng}`}
              className="rounded-lg border border-gray-200"
            />
          </div>

          {/* 360 Degree Virtual Tour */}
          <div className="mb-12 pb-8 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Interactive 360° Tour</h2>
            <p className="text-gray-700 leading-relaxed text-base mb-6">
              Immerse yourself in the spiritual ambiance. Take a complete virtual walk-through of the monastery grounds and interiors from the comfort of your screen.
            </p>
            <button
              onClick={() => router.push(`/full-view/${monastery._id}`)}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-900 text-sm font-medium rounded-lg shadow-sm text-gray-900 bg-white hover:bg-gray-50 transition duration-150 gap-2"
            >
              <Compass size={18} />
              Start 360° Virtual Tour
            </button>
          </div>

          {/* Historical Archives Redirect */}
          <div className="mb-12 pb-8 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Historical Archives</h2>
            <p className="text-gray-700 leading-relaxed text-base mb-6 ">
              Discover the deep history, founding stories, and detailed documentation of the {monastery.name}.
            </p>
            <a
              href={`/historical-archives/monastery/${monastery._id}`}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-900 text-sm font-medium rounded-lg shadow-sm text-gray-900 bg-white hover:bg-gray-50 transition duration-150"
            >
              View Full Archives 📜
            </a>
          </div>

          {/* Upcoming Events & Festivals */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upcoming Events & Festivals</h2>
            {eventsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin text-gray-900" size={24} />
              </div>
            ) : events.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {events.map((event) => (
                  <div key={event._id} className="rounded-lg cursor-pointer overflow-hidden border border-gray-200 hover:shadow-lg transition">
                    {event.images && event.images.length > 0 ? (
                      <div
                        onClick={() => router.push(`/events/${event._id}`)}
                        className="w-full h-40 bg-gray-200 overflow-hidden">
                        <img
                          src={event.images[0]}
                          alt={event.eventName}
                          className="w-full h-full object-cover hover:scale-105 transition duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-40 bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 text-sm">No image available</span>
                      </div>
                    )}
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{event.eventName}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Calendar size={14} />
                        <span>{event.startDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No upcoming events available</p>
            )}
          </div>
        </div>

        {/* Booking Card */}
        <div className="col-span-1">
          <div className="border border-gray-300 rounded-xl p-6 sticky top-24 shadow-md">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Select an Event:</h3>
              {eventsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="animate-spin text-gray-900" size={20} />
                </div>
              ) : events.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {events.map((event) => (
                    <button
                      key={event._id}
                      onClick={() => setSelectedEventId(event._id)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition ${selectedEventId === event._id
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                    >
                      <div className="font-semibold text-gray-900 text-sm line-clamp-1">{event.eventName}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                        <Calendar size={12} />
                        <span>{event.startDate}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No events available</p>
              )}
            </div>

            {selectedEvent && (
              <>
                <div className="mb-4 text-center bg-gray-100 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-800">
                    🌟 Participate in {selectedEvent.eventName}!
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-bold text-gray-900">₹{selectedEvent.ticketPrice}</span>
                  </div>
                  <p className="text-sm text-gray-600">per ticket</p>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={paymentLoading}
                  className="w-full bg-yellow-400 text-white py-3 rounded-lg font-semibold hover:bg-yellow-400 transition mb-4 disabled:bg-red-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {paymentLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Be a part of Event'
                  )}
                </button>

                <div className="mb-6 pb-6 border-b border-gray-200 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Ticket Price</span>
                    <span className="text-gray-900">₹{selectedEvent.ticketPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Taxes & fees</span>
                    <span className="text-gray-900">₹0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Available Tickets</span>
                    <span className="text-gray-900">{selectedEvent.totaltickets - selectedEvent.bookedTickets}</span>
                  </div>
                </div>

                <div className="flex justify-between font-semibold text-gray-900 mb-6">
                  <span>Total</span>
                  <span>₹{selectedEvent.ticketPrice}</span>
                </div>

                <p className="text-xs text-gray-600 text-center">💎 Prices include all fees</p>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}