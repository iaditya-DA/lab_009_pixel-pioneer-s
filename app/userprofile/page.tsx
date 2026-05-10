// 'use client';

// import React, { useState, useEffect } from 'react';
// import { LogOut, Heart, Ticket, Settings, MapPin, Calendar, Users, Zap } from 'lucide-react';
// import { signOut } from "next-auth/react";

// interface Monastery {
//   _id: string;
//   name: string;
//   district: string;
//   state: string;
//   images: string[];
// }

// interface Booking {
//   _id: string;
//   user: string;
//   event: {
//     _id?: string;
//     eventName: string;
//     startDate: string;
//     ticketPrice: number;
//   };
//   orderId: string;
//   date: string;
//   numberOfPeople: number;
//   ticketPrice: number;
//   totalAmount: number;
//   paymentStatus: 'pending' | 'success' | 'failed';
//   __v?: number;
// }

// interface UserData {
//   _id: string;
//   email: string;
//   username: string;
//   savedMonasteries: Monastery[];
//   bookings: Booking[];
// }

// type TabType = 'account' | 'saved' | 'tickets';

// const getInitials = (username: string): string => {
//   return username
//     .split(' ')
//     .map((word) => word[0])
//     .join('')
//     .toUpperCase()
//     .slice(0, 2);
// };

// const getAvatarColor = (username: string): string => {
//   const colors = [
//     'from-blue-500 to-cyan-500',
//     'from-purple-500 to-pink-500',
//     'from-rose-500 to-orange-500',
//     'from-emerald-500 to-teal-500',
//     'from-indigo-500 to-purple-500',
//     'from-amber-500 to-orange-500',
//   ];
//   return colors[username.length % colors.length];
// };

// const QRPlaceholder: React.FC = () => (
//   <div className="w-28 h-28 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border-2 border-slate-700 flex items-center justify-center shadow-lg">
//     <div className="w-24 h-24 bg-white rounded grid grid-cols-5 gap-0.5 p-2">
//       {Array.from({ length: 25 }).map((_, i) => (
//         <div
//           key={i}
//           className={`rounded-sm ${i % 3 === 0 ? 'bg-slate-900' : 'bg-slate-200'}`}
//         />
//       ))}
//     </div>
//   </div>
// );

// export default function UserProfile() {
//   const [activeTab, setActiveTab] = useState<TabType>('account');
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUserProfile = async (): Promise<void> => {
//       try {
//         setLoading(true);
//         const response = await fetch('/api/userprofile');
//         if (!response.ok) {
//           throw new Error('Failed to fetch user profile');
//         }
//         const json = await response.json();
//         console.log("User profile response JSON:", json);
        
//         // Fix: Extract user from the response object
//         const { user, success,bookings } = json;
        
//         if (!success || !user) {
//           throw new Error('No user data returned from server');
//         }

//         // Transform the response to match UserData interface
//         const transformedData: UserData = {
//           _id: user._id,
//           email: user.email,
//           username: user.username,
//           savedMonasteries: user.savedMonasteries || [],
//           bookings: bookings || [],
//         };
        
//         setUserData(transformedData);
//         setError(null);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'An error occurred');
//         setUserData(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserProfile();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await signOut({ callbackUrl: "/" });
//     } catch (err) {
//       console.error("Logout failed:", err);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <div className="relative w-16 h-16">
//             <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-spin" style={{maskImage: 'conic-gradient(transparent 30%, black)'}}></div>
//             <div className="absolute inset-2 bg-slate-950 rounded-full"></div>
//           </div>
//           <p className="text-slate-300 font-medium">Loading your profile</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !userData) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
//         <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-8 max-w-md text-center shadow-2xl">
//           <div className="text-red-500 text-5xl mb-4 font-bold">!</div>
//           <p className="text-red-400 font-medium">{error || 'Failed to load profile'}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex min-h-screen gap-6 p-6">
//           {/* Sidebar */}
//           <div className="w-80 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-slate-700 flex flex-col overflow-hidden shadow-2xl sticky top-6 h-fit">
//             {/* Profile Section */}
//             <div className="p-8 border-b border-slate-700 bg-gradient-to-b from-slate-800/50 to-transparent">
//               <div className="flex flex-col items-center">
//                 <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${getAvatarColor(userData.username)} flex items-center justify-center mb-4 shadow-xl ring-2 ring-slate-700`}>
//                   <span className="text-white text-3xl font-bold">
//                     {getInitials(userData.username)}
//                   </span>
//                 </div>
//                 <h2 className="text-2xl font-bold text-white">
//                   {userData.username}
//                 </h2>
//                 <p className="text-sm text-slate-400 mt-2 text-center break-all">{userData.email}</p>
//               </div>
//             </div>

//             {/* Navigation */}
//             <nav className="flex-1 px-4 py-6 space-y-2">
//               {(
//                 [
//                   { id: 'account', label: 'Account', icon: Settings },
//                   { id: 'saved', label: 'Saved Monasteries', icon: Heart },
//                   { id: 'tickets', label: 'My Tickets', icon: Ticket },
//                 ] as const
//               ).map(({ id, label, icon: Icon }) => (
//                 <button
//                   key={id}
//                   onClick={() => setActiveTab(id)}
//                   className={`w-full px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 font-medium ${
//                     activeTab === id
//                       ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
//                       : 'text-slate-300 hover:bg-slate-700/50'
//                   }`}
//                 >
//                   <Icon size={20} />
//                   {label}
//                 </button>
//               ))}
//             </nav>

//             {/* Logout */}
//             <div className="p-4 border-t border-slate-700">
//               <button
//                 onClick={handleLogout}
//                 className="w-full px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 font-medium text-slate-300 hover:bg-red-500/20 hover:text-red-400"
//               >
//                 <LogOut size={20} />
//                 Logout
//               </button>
//             </div>
//           </div>

//           {/* Content */}
//           <div className="flex-1">
//             {/* Account Tab */}
//             {activeTab === 'account' && (
//               <div className="max-w-4xl">
//                 <div className="mb-8">
//                   <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
//                     Account Settings
//                   </h1>
//                   <p className="text-slate-400">Manage your profile information</p>
//                 </div>

//                 <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-8 shadow-2xl">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <div>
//                       <label className="block text-sm font-semibold text-slate-300 mb-3">
//                         Full Name
//                       </label>
//                       <input
//                         type="text"
//                         value={userData.username}
//                         disabled
//                         className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white font-medium cursor-not-allowed"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-semibold text-slate-300 mb-3">
//                         Email Address
//                       </label>
//                       <input
//                         type="email"
//                         value={userData.email}
//                         disabled
//                         className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white font-medium cursor-not-allowed"
//                       />
//                     </div>
//                   </div>

//                   <div className="mt-8 p-6 bg-slate-700/30 rounded-xl border border-slate-600">
//                     <div className="flex items-start gap-3">
//                       <Zap size={20} className="text-cyan-400 mt-1 flex-shrink-0" />
//                       <div>
//                         <p className="font-semibold text-slate-200">Pro Tip</p>
//                         <p className="text-sm text-slate-400 mt-1">Visit more monasteries and book events to unlock exclusive benefits and rewards!</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Saved Monasteries Tab */}
//             {activeTab === 'saved' && (
//               <div>
//                 <div className="mb-8">
//                   <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-2">
//                     Saved Monasteries
//                   </h1>
//                   <p className="text-slate-400">
//                     {userData.savedMonasteries?.length || 0} location{userData.savedMonasteries?.length !== 1 ? 's' : ''} saved
//                   </p>
//                 </div>

//                 {userData.savedMonasteries?.length === 0 ? (
//                   <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 border-dashed p-16 text-center shadow-lg">
//                     <Heart size={56} className="mx-auto text-slate-600 mb-4" />
//                     <p className="text-slate-300 font-medium text-lg">
//                       No saved monasteries yet
//                     </p>
//                     <p className="text-slate-500 text-sm mt-3">
//                       Explore and save your favorite monasteries to visit later
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     {userData.savedMonasteries?.map((monastery: Monastery) => (
//                       <div
//                         key={monastery._id}
//                         className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10"
//                       >
//                         {monastery.images?.[0] && (
//                           <div className="h-48 overflow-hidden bg-slate-700">
//                             <img
//                               src={monastery.images[0]}
//                               alt={monastery.name}
//                               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                             />
//                           </div>
//                         )}
//                         <div className="p-6">
//                           <h3 className="font-bold text-lg text-white mb-3 group-hover:text-cyan-400 transition-colors">
//                             {monastery.name}
//                           </h3>
//                           <div className="flex items-center gap-2 text-slate-400">
//                             <MapPin size={16} className="text-cyan-400 flex-shrink-0" />
//                             <p className="text-sm">
//                               {monastery.district}, {monastery.state}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Tickets Tab */}
//             {activeTab === 'tickets' && (
//               <div>
//                 <div className="mb-8">
//                   <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-2">
//                     My Tickets
//                   </h1>
//                   <p className="text-slate-400">
//                     {userData.bookings?.length || 0} booking{userData.bookings?.length !== 1 ? 's' : ''}
//                   </p>
//                 </div>

//                 {userData.bookings?.length === 0 ? (
//                   <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 border-dashed p-16 text-center shadow-lg">
//                     <Ticket size={56} className="mx-auto text-slate-600 mb-4" />
//                     <p className="text-slate-300 font-medium text-lg">
//                       No tickets booked yet
//                     </p>
//                     <p className="text-slate-500 text-sm mt-3">
//                       Book your first ticket to start your monastery journey
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="space-y-6">
//                     {userData.bookings?.map((booking: Booking) => (
//                       <div
//                         key={booking._id}
//                         className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10"
//                       >
//                         <div className="flex flex-col lg:flex-row">
//                           {/* Ticket Content */}
//                           <div className="lg:w-2/3 p-8 border-b lg:border-b-0 lg:border-r border-slate-700">
//                             <div className="flex justify-between items-start mb-6">
//                               <div>
//                                 <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
//                                   Event
//                                 </p>
//                                 <h3 className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">
//                                   {booking.event?.eventName || 'Event'}
//                                 </h3>
//                               </div>
//                               <span
//                                 className={`text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider whitespace-nowrap ${
//                                   booking.paymentStatus === 'success'
//                                     ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
//                                     : booking.paymentStatus === 'pending'
//                                     ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
//                                     : 'bg-red-500/20 text-red-400 border border-red-500/30'
//                                 }`}
//                               >
//                                 {booking.paymentStatus}
//                               </span>
//                             </div>

//                             <div className="space-y-4">
//                               <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
//                                 <div>
//                                   <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">
//                                     Date
//                                   </p>
//                                   <p className="flex items-center gap-2 text-white font-semibold">
//                                     <Calendar size={16} className="text-cyan-400" />
//                                     {new Date(booking.event?.startDate || booking.date).toLocaleDateString('en-IN', {
//                                       day: 'numeric',
//                                       month: 'short',
//                                       year: 'numeric',
//                                     })}
//                                   </p>
//                                 </div>
//                                 <div>
//                                   <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">
//                                     Guests
//                                   </p>
//                                   <p className="flex items-center gap-2 text-white font-semibold">
//                                     <Users size={16} className="text-cyan-400" />
//                                     {booking.numberOfPeople}
//                                   </p>
//                                 </div>
//                                 <div>
//                                   <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">
//                                     Per Person
//                                   </p>
//                                   <p className="text-white font-semibold">
//                                     ₹{booking.event?.ticketPrice || booking.ticketPrice}
//                                   </p>
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
//                               <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Order ID</p>
//                               <p className="text-sm font-mono text-slate-300">{booking.orderId}</p>
//                             </div>
//                           </div>

//                           {/* QR Code Section */}
//                           <div className="lg:w-1/3 p-8 flex flex-col items-center justify-center bg-gradient-to-br from-slate-700/50 to-slate-800/50 border-t lg:border-t-0">
//                             <QRPlaceholder />
//                             <p className="text-xs text-slate-400 font-medium mt-6 text-center">
//                               Scan at entry to validate your ticket
//                             </p>
//                           </div>
//                         </div>

//                         {/* Total Amount Footer */}
//                         <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 px-8 py-4 flex justify-between items-center border-t border-slate-700">
//                           <p className="text-slate-400 text-sm font-medium">
//                             Total Amount
//                           </p>
//                           <p className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
//                             ₹{booking.totalAmount}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import React, { useState, useEffect } from 'react';
import { LogOut, Heart, Ticket, Settings, MapPin, Calendar, Users, Zap } from 'lucide-react';

interface Monastery {
  _id: string;
  name: string;
  district: string;
  state: string;
  images: string[];
}

interface Booking {
  _id: string;
  user: string;
  event: {
    _id?: string;
    eventName: string;
    startDate: string;
    ticketPrice: number;
  };
  orderId: string;
  date: string;
  numberOfPeople: number;
  ticketPrice: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'success' | 'failed';
  __v?: number;
}

interface UserData {
  _id: string;
  email: string;
  username: string;
  savedMonasteries: Monastery[];
  bookings: Booking[];
}

type TabType = 'account' | 'saved' | 'tickets';

const getInitials = (username: string): string => {
  return username
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (username: string): string => {
  const colors = [
    'from-yellow-400 to-amber-500',
    'from-yellow-500 to-orange-500',
    'from-amber-400 to-yellow-500',
    'from-yellow-400 to-yellow-600',
    'from-amber-500 to-yellow-500',
    'from-yellow-500 to-amber-600',
  ];
  return colors[username.length % colors.length];
};

const QRPlaceholder: React.FC = () => (
  <div className="w-28 h-28 bg-white rounded-lg border-2 border-yellow-400 flex items-center justify-center shadow-lg">
    <div className="w-24 h-24 bg-yellow-50 rounded grid grid-cols-5 gap-0.5 p-2">
      {Array.from({ length: 25 }).map((_, i) => (
        <div
          key={i}
          className={`rounded-sm ${i % 3 === 0 ? 'bg-yellow-600' : 'bg-gray-200'}`}
        />
      ))}
    </div>
  </div>
);

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState<TabType>('account');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch('/api/userprofile');
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        const json = await response.json();
        
        const { user, success, bookings } = json;
        
        if (!success || !user) {
          throw new Error('No user data returned from server');
        }

        const transformedData: UserData = {
          _id: user._id,
          email: user.email,
          username: user.username,
          savedMonasteries: user.savedMonasteries || [],
          bookings: bookings || [],
        };
        
        setUserData(transformedData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    // Implement logout with NextAuth in actual app
    alert('Logout functionality');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full animate-spin" style={{maskImage: 'conic-gradient(transparent 30%, black)'}}></div>
            <div className="absolute inset-2 bg-white rounded-full"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading your profile</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md text-center shadow-lg">
          <div className="text-red-500 text-5xl mb-4 font-bold">!</div>
          <p className="text-red-600 font-medium">{error || 'Failed to load profile'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex min-h-screen gap-8 p-8">
          {/* Sidebar */}
          <div className="w-72 bg-white rounded-2xl border border-gray-200 flex flex-col overflow-hidden shadow-lg sticky top-8 h-fit">
            {/* Profile Section */}
            <div className="p-8 border-b border-gray-200 bg-gradient-to-br from-yellow-50 to-white">
              <div className="flex flex-col items-center">
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${getAvatarColor(userData.username)} flex items-center justify-center mb-4 shadow-lg ring-2 ring-yellow-200`}>
                  <span className="text-white text-3xl font-bold">
                    {getInitials(userData.username)}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {userData.username}
                </h2>
                <p className="text-sm text-gray-600 mt-2 text-center break-all font-light">{userData.email}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {(
                [
                  { id: 'account', label: 'Account', icon: Settings },
                  { id: 'saved', label: 'Saved Monasteries', icon: Heart },
                  { id: 'tickets', label: 'My Tickets', icon: Ticket },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 font-medium text-sm ${
                    activeTab === id
                      ? 'bg-yellow-400 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  {label}
                </button>
              ))}
              
              <button
                onClick={() => window.location.href = '/trip-together'}
                className="w-full px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 font-medium text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
              >
                <Users size={20} />
                Trip Together
              </button>

              <button
                onClick={() => window.location.href = '/provide-service'}
                className="w-full px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 font-medium text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
              >
                <Zap size={20} />
                Provide a Service
              </button>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 font-medium text-gray-700 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="max-w-4xl">
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Account Settings
                  </h1>
                  <p className="text-gray-600 font-light">Manage your profile information</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={userData.username}
                        disabled
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-medium cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={userData.email}
                        disabled
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-medium cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-yellow-50 rounded-xl border border-yellow-200">
                    <div className="flex items-start gap-3">
                      <Zap size={20} className="text-yellow-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">Pro Tip</p>
                        <p className="text-sm text-gray-700 mt-1 font-light">Visit more monasteries and book events to unlock exclusive benefits and rewards!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Saved Monasteries Tab */}
            {activeTab === 'saved' && (
              <div>
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Saved Monasteries
                  </h1>
                  <p className="text-gray-600 font-light">
                    {userData.savedMonasteries?.length || 0} location{userData.savedMonasteries?.length !== 1 ? 's' : ''} saved
                  </p>
                </div>

                {userData.savedMonasteries?.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-300 border-dashed p-16 text-center shadow-lg">
                    <Heart size={56} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-900 font-semibold text-lg">
                      No saved monasteries yet
                    </p>
                    <p className="text-gray-600 text-sm mt-3 font-light">
                      Explore and save your favorite monasteries to visit later
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {userData.savedMonasteries?.map((monastery: Monastery) => (
                      <div
                        key={monastery._id}
                        className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg"
                      >
                        {monastery.images?.[0] && (
                          <div className="h-48 overflow-hidden bg-gray-200">
                            <img
                              src={monastery.images[0]}
                              alt={monastery.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors">
                            {monastery.name}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin size={16} className="text-yellow-600 flex-shrink-0" />
                            <p className="text-sm font-light">
                              {monastery.district}, {monastery.state}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tickets Tab */}
            {activeTab === 'tickets' && (
              <div>
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    My Tickets
                  </h1>
                  <p className="text-gray-600 font-light">
                    {userData.bookings?.length || 0} booking{userData.bookings?.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {userData.bookings?.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-300 border-dashed p-16 text-center shadow-lg">
                    <Ticket size={56} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-900 font-semibold text-lg">
                      No tickets booked yet
                    </p>
                    <p className="text-gray-600 text-sm mt-3 font-light">
                      Book your first ticket to start your monastery journey
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {userData.bookings?.map((booking: Booking) => (
                      <div
                        key={booking._id}
                        className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-yellow-400 transition-all duration-300 hover:shadow-lg"
                      >
                        <div className="flex flex-col lg:flex-row">
                          {/* Ticket Content */}
                          <div className="lg:w-2/3 p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
                            <div className="flex justify-between items-start mb-6">
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                                  Event
                                </p>
                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">
                                  {booking.event?.eventName || 'Event'}
                                </h3>
                              </div>
                              <span
                                className={`text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider whitespace-nowrap ${
                                  booking.paymentStatus === 'success'
                                    ? 'bg-green-100 text-green-700 border border-green-300'
                                    : booking.paymentStatus === 'pending'
                                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                                    : 'bg-red-100 text-red-700 border border-red-300'
                                }`}
                              >
                                {booking.paymentStatus}
                              </span>
                            </div>

                            <div className="space-y-4">
                              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                                <div>
                                  <p className="text-xs text-gray-600 font-medium uppercase tracking-wider mb-2">
                                    Date
                                  </p>
                                  <p className="flex items-center gap-2 text-gray-900 font-semibold">
                                    <Calendar size={16} className="text-yellow-600" />
                                    {new Date(booking.event?.startDate || booking.date).toLocaleDateString('en-IN', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                    })}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 font-medium uppercase tracking-wider mb-2">
                                    Guests
                                  </p>
                                  <p className="flex items-center gap-2 text-gray-900 font-semibold">
                                    <Users size={16} className="text-yellow-600" />
                                    {booking.numberOfPeople}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 font-medium uppercase tracking-wider mb-2">
                                    Per Person
                                  </p>
                                  <p className="text-gray-900 font-semibold">
                                    ₹{booking.event?.ticketPrice || booking.ticketPrice}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-300">
                              <p className="text-xs text-gray-600 font-medium uppercase tracking-wider mb-1">Order ID</p>
                              <p className="text-sm font-mono text-gray-900">{booking.orderId}</p>
                            </div>
                          </div>

                          {/* QR Code Section */}
                          <div className="lg:w-1/3 p-8 flex flex-col items-center justify-center bg-yellow-50 border-t lg:border-t-0">
                            <QRPlaceholder />
                            <p className="text-xs text-gray-700 font-light mt-6 text-center">
                              Scan at entry to validate your ticket
                            </p>
                          </div>
                        </div>

                        {/* Total Amount Footer */}
                        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 px-8 py-4 flex justify-between items-center border-t border-yellow-200">
                          <p className="text-gray-700 text-sm font-medium">
                            Total Amount
                          </p>
                          <p className="text-2xl font-bold text-yellow-600">
                            ₹{booking.totalAmount}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}