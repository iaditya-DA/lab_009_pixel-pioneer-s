// "use client";
// import { useParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// type EventType = {
//   _id: string;
//   eventName: string;
//   category: string;
//   startDate: string;
//   endDate?: string;
//   description: string;
//   images: string[];
//   ticketPrice?: number;
//   bookingAvailable?: boolean;
// };

// type Monastery = {
//   _id: string;
//   name: string;
//   description: string;
//   foundedYear: number;
//   images: string[];
// };

// export default function MonasteryEventsPage() {
//   const params = useParams();
//   const monasteryId = params.id as string;
//   const router = useRouter();

//   const [monastery, setMonastery] = useState<Monastery | null>(null);
//   const [events, setEvents] = useState<EventType[]>([]);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       const res = await fetch(`/api/events/event-by-monastries/${monasteryId}`);
//       const data = await res.json();
//       setEvents(data.events);
//     };

//     const fetchMonastery = async () => {
//       const res = await fetch(`/api/monasteryImg/${monasteryId}`);
//       const data = await res.json();
//       setMonastery(data);
//     };

//     if (monasteryId) {
//       fetchEvents();
//       fetchMonastery();
//     }
//   }, [monasteryId]);

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-6 max-w-7xl mx-auto">
//       <button
//         className="mb-4 text-indigo-600 hover:underline"
//         onClick={() => router.back()}
//       >
//         ← Back
//       </button>

//       {/* Monastery Card */}
//       {monastery && <MonasteryCard monastery={monastery} />}

//       {/* Events List */}
//       {events.length === 0 ? (
//         <p className="text-center text-gray-600 mt-10">No events found...</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {events.map((event) => (
//             <div
//               key={event._id}
//               className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
//             >
//               <img
//                 src={event.images?.[0]}
//                 alt={event.eventName}
//                 className="w-full h-52 object-cover"
//               />

//               <div className="p-5">
//                 <h2 className="text-xl font-semibold mb-1">{event.eventName}</h2>
//                 <p className="text-sm text-indigo-600 font-medium mb-1">{event.category}</p>
//                 <p className="text-gray-700 text-sm line-clamp-3 mb-3">{event.description}</p>

//                 <button
//                   className="w-full py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
//                   onClick={() => router.push(`/events/${event._id}`)}
//                 >
//                   View Details
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// /* -------------------------------------------------
//    👇 Embedded Monastery Card Component
// -------------------------------------------------- */
// function MonasteryCard({ monastery }: any) {
//   return (
//     <div className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-md p-6 mb-10 gap-6">
//       <img
//         src={monastery.images?.[0]}
//         alt={monastery.name}
//         className="w-full md:w-72 h-48 object-cover rounded-lg shadow-md"
//       />

//       <div className="flex-1">
//         <h1 className="text-4xl font-bold mb-2">{monastery.name}</h1>
//         <p className="text-gray-600 mb-2">
//           <span className="font-semibold">Founded Year:</span> {monastery.foundedYear}
//         </p>
//         <p className="text-gray-700 line-clamp-4">{monastery.description}</p>
//       </div>
//     </div>
//   );
// }

"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type EventType = {
  _id: string;
  eventName: string;
  category: string;
  startDate: string;
  endDate?: string;
  description: string;
  images: string[];
  ticketPrice?: number;
  bookingAvailable?: boolean;
};

type Monastery = {
  _id: string;
  name: string;
  description: string;
  foundedYear: number;
  images: string[];
};

export default function MonasteryEventsPage() {
  const params = useParams();
  const monasteryId = params.id as string;
  const router = useRouter();

  const [monastery, setMonastery] = useState<Monastery | null>(null);
  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch(`/api/events/event-by-monastries/${monasteryId}`);
      const data = await res.json();
      setEvents(data.events);
    };

    const fetchMonastery = async () => {
      const res = await fetch(`/api/monasteryImg/${monasteryId}`);
      const data = await res.json();
      setMonastery(data);
    };

    if (monasteryId) {
      fetchEvents();
      fetchMonastery();
    }
  }, [monasteryId]);

  return (
    <div className="min-h-screen bg-white text-black">

      <div className="max-w-7xl mx-auto py-10 px-6">
        <button
          className="mb-6 text-yellow-600 hover:text-yellow-700 font-semibold flex items-center gap-2"
          onClick={() => router.back()}
        >
          ← Back
        </button>

        {/* MONASTERY DESCRIPTION BOX */}
        {/* {monastery && (
          <div className="bg-white border border-yellow-600/30 p-6 rounded-xl shadow-md mb-10">
             <img
                src={monastery.images?.[0]}
                alt={monastery.name}
                className="w-full h-52 object-cover"
              />
            <h2 className="text-3xl font-bold text-yellow-700 font-serif italic mb-3">
              About Monastery
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {monastery.description}
            </p>
          </div>
        )} */}
        {monastery && (
          <div className="bg-white border border-yellow-600/30 p-8 rounded-xl shadow-md mb-10">
            <h2 className="text-3xl font-bold text-yellow-700 font-serif italic mb-6 text-center">
              About Monastery
            </h2>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* LEFT IMAGE */}
              <img
                src={monastery.images?.[0]}
                alt={monastery.name}
                className="md:w-1/2 w-full h-64 object-cover rounded-xl shadow-sm"
              />

              {/* RIGHT TEXT */}
              <p className="md:w-1/2 w-full text-gray-700 leading-relaxed text-lg text-justify">
                {monastery.description?.slice(0, 600)}...
              </p>
            </div>
          </div>
        )}

        {/* EVENTS SECTION */}
        <h2 className="text-3xl font-bold text-yellow-700 font-serif italic mb-8 border-b border-yellow-600 pb-2">
          Festivals & Spiritual Events
        </h2>

        {events.length === 0 ? (
          <p className="text-center text-gray-500 italic mt-10 text-lg">
            No events found...
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white border border-yellow-600/30 rounded-xl shadow-lg overflow-hidden hover:shadow-yellow-600/40 hover:scale-[1.02] transition transform duration-300 cursor-pointer"
                onClick={() => router.push(`/events/${event._id}`)}
              >
                <img
                  src={event.images?.[0]}
                  alt={event.eventName}
                  className="w-full h-56 object-cover"
                />

                <div className="p-5">
                  <h3 className="text-xl font-bold text-yellow-700 font-serif italic mb-1">
                    {event.eventName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{event.category}</p>
                  <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                    {event.description}
                  </p>

                  <button className="w-full py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
