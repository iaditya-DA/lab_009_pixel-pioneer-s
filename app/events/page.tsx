// "use client";
// import React, { useEffect, useState } from "react";
// import { Mountain, CalendarCheck, CornerRightUp, Loader2, XCircle, Ticket, MapPin } from "lucide-react";
// import { useRouter } from "next/navigation";

// type Monastery = {
//   _id: string;
//   name: string;
//   images: string[];
//   shortDescription?: string;
// };

// type EventType = {
//   _id: string;
//   monasteryId: string;
//   eventName: string;
//   category: string;
//   startDate: string;
//   endDate?: string;
//   time?: string;
//   duration?: string;
//   location?: string;
//   description: string;
//   highlights?: string[];
//   images: string[];
//   bookingAvailable?: boolean;
//   ticketPrice?: number;
// };

// const EventCarousel: React.FC<{ events: EventType[] }> = ({ events }) => {
//     const router = useRouter();
//   if (events.length === 0) {
//     return (
//       <p className="text-gray-500 text-sm p-3 bg-gray-50 rounded-lg italic">
//         No featured events for this monastery.
//       </p>
//     );
//   }

//   return (
//     <div className="flex overflow-x-auto space-x-4 pb-4 -mx-6 px-6 scrollbar-hide">
//       {events.map((event) => (
//         <div
//         onClick={()=>router.push(`events/${event._id}`)}
//           key={event._id}
//           className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-300 transform hover:scale-[1.03]"
//         >
            
//           <div className="w-full h-32 overflow-hidden rounded-t-xl bg-gray-100 flex items-center justify-center">
//             {event.images && event.images.length > 0 ? (
//               <img
//                 src={event.images[0]}
//                 alt={event.eventName}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <p className="text-gray-400 text-xs">No Image</p>
//             )}
//           </div>

//           <div className="p-4">
//             <h4 className="text-indigo-700 font-semibold text-sm line-clamp-1">{event.eventName}</h4>
//             <p className="text-gray-600 text-xs line-clamp-2">{event.description}</p>    
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// const EventsPage: React.FC = () => {
//   const router = useRouter();
//   const [monasteries, setMonasteries] = useState<Monastery[]>([]);
//   const [events, setEvents] = useState<EventType[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchAll() {
//       try {
//         const [mRes, eRes] = await Promise.all([
//           fetch("/api/monasteryImg"),
//           fetch("/api/events"),
//         ]);

//         if (!mRes.ok) throw new Error(`Monastery fetch failed: ${mRes.status}`);
//         if (!eRes.ok) throw new Error(`Event fetch failed: ${eRes.status}`);

//         const mData: Monastery[] = await mRes.json();
//         const eData: EventType[] = await eRes.json();

//         const updatedMons = mData.map((m) => ({
//           ...m,
//           shortDescription:
//             m.shortDescription ||
//             `Explore cultural celebrations and sacred rituals at ${m.name}.`,
//         }));

//         setMonasteries(updatedMons);
//         setEvents(eData);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Unknown error");
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchAll();
//   }, []);

//   if (loading)
//     return (
//       <div className="min-h-screen flex flex-col justify-center items-center">
//         <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
//         <p className="mt-4 text-xl font-bold">Loading Events...</p>
//       </div>
//     );

//   if (error)
//     return (
//       <div className="text-center mt-20 p-8 border-2 border-red-500 bg-red-50 rounded-xl shadow-xl max-w-xl mx-auto">
//         <XCircle className="w-12 h-12 mx-auto text-red-600" />
//         <p className="text-xl font-bold text-red-700">API Error: {error}</p>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-white">
//       {/* HERO */}
//       <section
//         className="relative h-[60vh] bg-cover bg-center flex items-center justify-center"
//         style={{
//           backgroundImage:
//             "url('https://res.cloudinary.com/djeospbqe/image/upload/v1764292249/sing2_gfxkk0.webp')",
//         }}
//       >
//         <div className="absolute inset-0 bg-black/50"></div>
//         <div className="relative text-center px-6">
//           <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-4">
//             Monastery Festivals & Rituals
//           </h1>
//           <p className="text-xl text-white font-light drop-shadow-md">
//             Discover sacred celebrations & vibrant cultural events.
//           </p>
//         </div>
//       </section>

//       {/* MAIN GRID */}
//       <main className="max-w-7xl mx-auto py-12 px-6">
//         <h2 className="text-4xl font-bold text-indigo-900 mb-10 flex items-center gap-3 border-b pb-3">
//           <CalendarCheck className="w-8 h-8 text-indigo-600" />
//           Featured Events by Monastery
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {monasteries.map((m) => (
//             <div
//               key={m._id}
//               className="bg-white rounded-xl shadow-lg overflow-hidden hover:-translate-y-1 hover:shadow-indigo-400/40 transition"
//             >
//               <img
//                 src={m.images?.[0]}
//                 alt={m.name}
//                 className="h-56 w-full object-cover"
//               />

//               <div className="p-6">
//                 <h3 className="text-xl font-bold text-indigo-900">{m.name}</h3>
//                 <p className="text-sm text-gray-700 line-clamp-3 mb-3">{m.shortDescription}</p>

//                 <EventCarousel events={events.filter((e) => e.monasteryId === m._id)} />

//                 <button
//                   onClick={() => router.push(`/events/monastery/${m._id}`)}
//                   className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-800"
//                 >
//                   View All Events
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default EventsPage;





"use client";
import React, { useEffect, useState } from "react";
import {
  CalendarCheck,
  Loader2,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Monastery = {
  _id: string;
  name: string;
  images: string[];
  shortDescription?: string;
};

type EventType = {
  _id: string;
  monasteryId: string;
  eventName: string;
  category: string;
  startDate: string;
  description: string;
  images: string[];
};

const EventCarousel: React.FC<{ events: EventType[] }> = ({ events }) => {
  const router = useRouter();
  if (events.length === 0)
    return <p className="text-gray-500 text-xs italic">No Events Yet</p>;

  return (
    <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
      {events.map((event) => (
        <div
          onClick={() => router.push(`/events/${event._id}`)}
          key={event._id}
          className="flex-shrink-0 w-64 bg-white border border-yellow-500/30 rounded-xl hover:border-yellow-500 hover:shadow-yellow-500/40 transition duration-300 cursor-pointer"
        >
          <div className="w-full h-32 overflow-hidden rounded-t-xl">
            <img src={event.images[0]} className="w-full h-full object-cover" />
          </div>

          <div className="p-4">
            <h4 className="text-yellow-600 font-semibold text-sm line-clamp-1">
              {event.eventName}
            </h4>
            <p className="text-gray-700 text-xs line-clamp-2">
              {event.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const EventsPage: React.FC = () => {
  const router = useRouter();
  const [monasteries, setMonasteries] = useState<Monastery[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [mRes, eRes] = await Promise.all([
          fetch("/api/monasteryImg"),
          fetch("/api/events"),
        ]);

        const mData = await mRes.json();
        const eData = await eRes.json();

        setMonasteries(mData);
        setEvents(eData);
      } catch (err) {
        setError("Unable to fetch events");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-yellow-500" />
        <p className="mt-4 text-xl font-bold text-gray-800">Loading Events...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-20 p-8 border border-red-500 bg-red-100 rounded-xl shadow-xl max-w-xl mx-auto text-black">
        <XCircle className="w-12 h-12 mx-auto text-red-500" />
        <p className="text-xl font-bold">API Error: {error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-black">
      {/* HERO */}
      <section
        className="relative h-[60vh] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/djeospbqe/image/upload/v1764292249/sing2_gfxkk0.webp')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
          <p className="text-yellow-500 uppercase tracking-[4px]">
            Sikkim Culture & Traditions
          </p>
          <h1 className="text-6xl md:text-7xl font-serif italic font-extrabold text-white">
            Cultural Festivals
          </h1>
          <p className="mt-3 text-gray-200 text-lg max-w-xl">
            Explore divine rituals, celebrations & sacred experiences.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto py-12 px-6">
        <h2 className="text-4xl font-bold text-yellow-600 mb-10 flex items-center gap-3 font-serif italic border-b border-yellow-600 pb-3">
          <CalendarCheck className="w-8 h-8 text-yellow-600" />
          Featured Events by Monastery
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {monasteries.map((m) => (
            <div
              key={m._id}
              className="bg-white border border-yellow-600/40 rounded-xl shadow-lg hover:shadow-yellow-600/40 transition"
            >
              <img
                src={m.images?.[0]}
                className="h-56 w-full object-cover rounded-t-xl"
              />

              <div className="p-6">
                <h3 className="text-2xl font-bold text-yellow-600 font-serif italic">
                  {m.name}
                </h3>

                <p className="text-sm text-gray-700 mt-2">
                  {m.shortDescription}
                </p>

                <div className="mt-4">
                  <EventCarousel
                    events={events.filter((e) => e.monasteryId === m._id)}
                  />
                </div>

                <button
                  onClick={() => router.push(`/events/monastery/${m._id}`)}
                  className="w-full mt-6 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition"
                >
                  View All Events
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default EventsPage;



// "use client";
// import React, { useEffect, useState } from "react";
// import {
//   CalendarCheck,
//   Loader2,
//   XCircle,
//   MapPin,
// } from "lucide-react";
// import { useRouter } from "next/navigation";

// type Monastery = {
//   _id: string;
//   name: string;
//   images: string[];
//   shortDescription?: string;
// };

// type EventType = {
//   _id: string;
//   monasteryId: string;
//   eventName: string;
//   category: string;
//   startDate: string;
//   description: string;
//   images: string[];
// };

// const EventCarousel: React.FC<{ events: EventType[] }> = ({ events }) => {
//   const router = useRouter();
//   if (events.length === 0)
//     return <p className="text-gray-400 text-xs italic">No Events Yet</p>;

//   return (
//     <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
//       {events.map((event) => (
//         <div
//           onClick={() => router.push(`/events/${event._id}`)}
//           key={event._id}
//           className="flex-shrink-0 w-64 bg-black border border-yellow-500/20 rounded-xl hover:border-yellow-400 hover:shadow-yellow-500/40 transition duration-300 cursor-pointer"
//         >
//           <div className="w-full h-32 overflow-hidden rounded-t-xl">
//             <img src={event.images[0]} className="w-full h-full object-cover" />
//           </div>
//           <div className="p-4">
//             <h4 className="text-yellow-400 font-semibold text-sm line-clamp-1">
//               {event.eventName}
//             </h4>
//             <p className="text-gray-300 text-xs line-clamp-2">
//               {event.description}
//             </p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// const EventsPage: React.FC = () => {
//   const router = useRouter();
//   const [monasteries, setMonasteries] = useState<Monastery[]>([]);
//   const [events, setEvents] = useState<EventType[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchAll() {
//       try {
//         const [mRes, eRes] = await Promise.all([
//           fetch("/api/monasteryImg"),
//           fetch("/api/events"),
//         ]);

//         const mData = await mRes.json();
//         const eData = await eRes.json();

//         setMonasteries(mData);
//         setEvents(eData);
//       } catch (err) {
//         setError("Unable to fetch events");
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchAll();
//   }, []);

//   if (loading)
//     return (
//       <div className="min-h-screen flex flex-col justify-center items-center bg-black">
//         <Loader2 className="w-12 h-12 animate-spin text-yellow-400" />
//         <p className="mt-4 text-xl font-bold text-gray-200">Loading Events...</p>
//       </div>
//     );

//   if (error)
//     return (
//       <div className="text-center mt-20 p-8 border border-red-500 bg-red-950/40 rounded-xl shadow-xl max-w-xl mx-auto text-white">
//         <XCircle className="w-12 h-12 mx-auto text-red-400" />
//         <p className="text-xl font-bold">API Error: {error}</p>
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-black text-white">
//       {/* HERO */}
//       <section
//         className="relative h-[60vh] bg-cover bg-center"
//         style={{
//           backgroundImage:
//             "url('https://res.cloudinary.com/djeospbqe/image/upload/v1764292249/sing2_gfxkk0.webp')",
//         }}
//       >
//         <div className="absolute inset-0 bg-black/70"></div>

//         <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
//           <p className="text-yellow-400 uppercase tracking-[4px]">
//             Sikkim Culture & Traditions
//           </p>
//           <h1 className="text-6xl md:text-7xl font-serif italic font-extrabold text-white">
//             Cultural Festivals
//           </h1>
//           <p className="mt-3 text-gray-300 text-lg max-w-xl">
//             Explore divine rituals, celebrations & sacred experiences.
//           </p>
//         </div>
//       </section>

//       {/* MAIN CONTENT */}
//       <main className="max-w-7xl mx-auto py-12 px-6">
//         <h2 className="text-4xl font-bold text-yellow-400 mb-10 flex items-center gap-3 font-serif italic border-b border-yellow-500 pb-3">
//           <CalendarCheck className="w-8 h-8 text-yellow-500" />
//           Featured Events by Monastery
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//           {monasteries.map((m) => (
//             <div
//               key={m._id}
//               className="bg-black border border-yellow-500/30 rounded-xl shadow-lg hover:shadow-yellow-500/30 transition"
//             >
//               <img
//                 src={m.images?.[0]}
//                 className="h-56 w-full object-cover opacity-90"
//               />
//               <div className="p-6">
//                 <h3 className="text-2xl font-bold text-yellow-400 font-serif italic">
//                   {m.name}
//                 </h3>
//                 <p className="text-sm text-gray-300 mt-2">
//                   {m.shortDescription}
//                 </p>

//                 <div className="mt-4">
//                   <EventCarousel
//                     events={events.filter((e) => e.monasteryId === m._id)}
//                   />
//                 </div>

//                 <button
//                   onClick={() => router.push(`/events/monastery/${m._id}`)}
//                   className="w-full mt-6 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition"
//                 >
//                   View All Events
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default EventsPage;
