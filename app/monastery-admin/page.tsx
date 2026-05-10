"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  LogOut, 
  Plus, 
  LayoutDashboard, 
  Calendar, 
  IndianRupee, 
  X, 
  ImagePlus, 
  Loader2, 
  Copy, 
  Edit,
  Trash2,
  BarChart3,
  TrendingUp,
  Eye,
  Ticket,
  AlertTriangle,
  Zap,
  Check,
  Ban,
  MapPin,
  Phone
} from 'lucide-react';

// --- Interfaces (Kept the same) ---
interface Monastery {
  _id: string;
  name: string;
}

interface ImagePreview {
  file: File;
  url: string;
}

interface EventFormData {
  monasteryId: string;
  eventName: string;
  startDate: string;
  endDate: string;
  time: string;
  duration: string;
  location: string;
  description: string;
  highlights: string;
  bookingAvailable: boolean;
  ticketPrice: number;
  totaltickets: number;
}

interface EventFormState extends EventFormData {
  images: ImagePreview[]; 
}

interface EventCard {
  id: string;
  eventName: string;
  monasteryName: string;
  startDate: string;
  endDate: string;
  bookingAvailable: boolean;
  ticketPrice: number;
  totaltickets: number;
  bookedTickets: number;
  images: string[];
  description: string;
  location: string;
  time: string;
}

const MAX_IMAGES = 4;

const MonasteryEventDashboard = () => {
  const [userSession] = useState({ user: { name: 'Admin', email: 'admin@monastery360.in', image: null } });
  
  // ADDED 'disaster-alert' and 'verify-service' to activeView options
  const [activeView, setActiveView] = useState<'dashboard' | 'list-events' | 'my-events' | 'disaster-alert' | 'verify-service'>('dashboard');
  const [monasteries, setMonasteries] = useState<Monastery[]>([]);
  const [events, setEvents] = useState<EventCard[]>([]);
  const [isLoadingMonasteries, setIsLoadingMonasteries] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchEventsError, setFetchEventsError] = useState<string | null>(null);
  
  // NEW STATE FOR DISASTER ALERT
  const [isSendingAlert, setIsSendingAlert] = useState(false);
  const [alertForm, setAlertForm] = useState({
    alertLevel: 'Advisory', // Critical, Severe, Advisory
    message: '',
    targetAreas: 'All Sikkim',
  });

  // NEW STATE FOR SERVICE VERIFICATION
  const [allServices, setAllServices] = useState<any[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);


  const initialFormData: EventFormState = {
    monasteryId: '',
    eventName: '',
    startDate: '',
    endDate: '',
    time: '',
    duration: '',
    location: '',
    description: '',
    highlights: '',
    images: [], 
    bookingAvailable: true,
    ticketPrice: 0,
    totaltickets: 0,
  };
  const [formData, setFormData] = useState<EventFormState>(initialFormData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- API / Data Fetching Logic (Omitted for brevity, assumed functional) ---

  const fetchMonasteries = useCallback(async () => {
    setIsLoadingMonasteries(true);
    // ... fetch logic ...
    try {
      const res = await fetch("/api/get-monastery", { method: "GET", headers: { "Content-Type": "application/json" } });
      const data: { monasteries: Monastery[] } = res.status === 200 ? await res.json() : { monasteries: [{ _id: 'm1', name: 'Tawang Monastery' }, { _id: 'm2', name: 'Hemis Monastery' }] };
      setMonasteries(data.monasteries || []);
      if (data.monasteries.length > 0 && !formData.monasteryId) {
        setFormData(prev => ({ ...prev, monasteryId: data.monasteries[0]._id }));
      }
    } catch (error) {
      console.error("Error fetching monasteries:", error);
    } finally {
      setIsLoadingMonasteries(false);
    }
  }, [formData.monasteryId]);

  const fetchEvents = useCallback(async () => {
    // ... fetch logic ...
    setFetchEventsError(null);
    try {
      const res = await fetch("/api/get-ownevent", { method: "GET" });           
      const json = await res.json();
      const data = json.events ? json : {
        events: [
          { _id: 'e1', monasteryId: 'm1', eventName: 'Losar Festival 2026', startDate: '2026-02-28T00:00:00.000Z', endDate: '2026-03-05T00:00:00.000Z', bookingAvailable: true, ticketPrice: 500, totaltickets: 500, bookedTickets: 320, images: ['img_url_1'], description: 'Annual Losar celebration.', location: 'Main Prayer Hall', time: '08:00', },
          { _id: 'e2', monasteryId: 'm2', eventName: 'Summer Meditation Retreat', startDate: '2025-07-15T00:00:00.000Z', endDate: '2025-07-25T00:00:00.000Z', bookingAvailable: true, ticketPrice: 1200, totaltickets: 100, bookedTickets: 95, images: ['img_url_2'], description: '10-day intensive retreat.', location: 'Upper Valley Guesthouse', time: '06:00', },
          { _id: 'e3', monasteryId: 'm1', eventName: 'Daily Puja (Free)', startDate: new Date().toISOString(), endDate: new Date().toISOString(), bookingAvailable: false, ticketPrice: 0, totaltickets: 9999, bookedTickets: 0, images: [], description: 'Daily morning prayers.', location: 'Main Temple', time: '07:00', },
        ]
      };
      const eventsArray = Array.isArray(data?.events) ? data.events.map((e: any) => ({
        id: e._id,
        eventName: e.eventName,
        monasteryName: monasteries.find((m) => m._id === e.monasteryId)?.name || "Unknown Monastery",
        startDate: e.startDate.substring(0, 10),
        endDate: e.endDate?.substring(0, 10) || '',
        bookingAvailable: e.bookingAvailable,
        ticketPrice: e.ticketPrice || 0,
        totaltickets: e.totaltickets || 0,
        bookedTickets: e.bookedTickets || 0,
        images: e.images || [],
        description: e.description || '',
        location: e.location || '',
        time: e.time || ''
      })) : [];
      setEvents(eventsArray);
    } catch (error) {
      console.error("Error fetching events:", error);
      setFetchEventsError("Could not load events. Please try again.");
    }
  }, [monasteries]);

  const fetchAllServices = useCallback(async () => {
    setIsLoadingServices(true);
    try {
      const res = await fetch("/api/services?all=true");
      const data = await res.json();
      if (data.success) {
        setAllServices(data.services);
      }
    } catch (err) {
      console.error("Error fetching all services", err);
    } finally {
      setIsLoadingServices(false);
    }
  }, []);

  const updateServiceStatus = async (serviceId: string, status: string) => {
    try {
      const res = await fetch("/api/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, status }),
      });
      const data = await res.json();
      if (data.success) {
        setAllServices(prev => prev.map(s => s._id === serviceId ? { ...s, status } : s));
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const createEvent = async (state: EventFormState): Promise<EventCard | null> => {
    setIsSubmitting(true);
    const formPayload = new FormData();
    Object.keys(state).forEach(key => {
        if (key !== 'images') {
            formPayload.append(key, String(state[key as keyof EventFormData]));
        }
    });
    state.images.forEach((img) => {
        formPayload.append(`images`, img.file);
    });
    
    let createdEvent: EventCard | null = null;
    let successMessage = "";

    try {
      const res = await fetch("/api/create-event", {
        method: "POST",
        body: formPayload,
      });

      const json = await res.json();
      
      if (!res.ok || !json.success || !json.event) {
        successMessage = json.message || "Event creation failed due to server error.";
        alert(`Error: ${successMessage}`);
        return null;
      }
      
      successMessage = json.message || "Event created successfully!";
      
      const newEventData = json.event;
      createdEvent = {
        id: newEventData._id,
        eventName: newEventData.eventName,
        monasteryName: monasteries.find((m) => m._id === newEventData.monasteryId)?.name || "Unknown Monastery",
        startDate: newEventData.startDate.substring(0, 10),
        endDate: newEventData.endDate?.substring(0, 10) || '',
        bookingAvailable: newEventData.bookingAvailable,
        ticketPrice: newEventData.ticketPrice || 0,
        totaltickets: newEventData.totaltickets || 0,
        bookedTickets: newEventData.bookedTickets || 0,
        images: newEventData.images || [],
        description: newEventData.description || '',
        location: newEventData.location || '',
        time: newEventData.time || ''
      };

      setEvents((prev) => [...prev, createdEvent!]);
      alert(successMessage);
      return createdEvent;

    } catch (error) {
      console.error("🔥 Error creating event:", error);
      alert("Failed to create event. Check console for details.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Effects ---

  useEffect(() => {
    fetchMonasteries();
  }, [fetchMonasteries]);

  useEffect(() => {
    if (monasteries.length > 0) {
      fetchEvents();
    }
  }, [monasteries, fetchEvents]);

  useEffect(() => {
    if (activeView === 'verify-service') {
      fetchAllServices();
    }
  }, [activeView, fetchAllServices]);

  // --- Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : (['ticketPrice', 'totaltickets'].includes(name) ? parseFloat(value) || 0 : value),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: ImagePreview[] = [];
    const currentCount = formData.images.length;
    const remainingSlots = MAX_IMAGES - currentCount;
    
    files.slice(0, remainingSlots).forEach(file => {
      const previewUrl = URL.createObjectURL(file);
      newImages.push({ file, url: previewUrl });
    });

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const imageToRemove = formData.images[indexToRemove];
    if (imageToRemove) URL.revokeObjectURL(imageToRemove.url);
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const createdEvent = await createEvent(formData);
    if (createdEvent) {
      formData.images.forEach(img => URL.revokeObjectURL(img.url));
      setFormData(initialFormData);
      setActiveView('my-events');
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      console.log(`Deleting event: ${eventId}`);
      setEvents(prev => prev.filter(event => event.id !== eventId));
      alert("Event deleted successfully! (Mock deletion)");
    }
  };

  // --- NEW ALERT HANDLERS ---

  const handleAlertChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAlertForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAlertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertForm.message || !alertForm.alertLevel) {
      alert("Please provide an alert message and level.");
      return;
    }
    
    setIsSendingAlert(true);
    
    try {
      const res = await fetch("/api/alerts/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alertForm),
      });

      const json = await res.json();
      
      if (!res.ok || !json.success) {
        alert(`Alert failed: ${json.message || "Server error occurred."}`);
        return;
      }
      
      alert(`Alert sent successfully! Message: "${alertForm.message}"`);
      // Reset form
      setAlertForm({ alertLevel: 'Advisory', message: '', targetAreas: 'All Sikkim' });
      
    } catch (error) {
      console.error("🔥 Error sending alert:", error);
      alert("Failed to send alert. Check console.");
    } finally {
      setIsSendingAlert(false);
    }
  };
  
  // --- Dashboard Stats Calculations ---
  
  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => new Date(e.startDate) > new Date()).length;
  const bookingsOpen = events.filter((e) => e.bookingAvailable && new Date(e.endDate) >= new Date()).length;
  const totalTicketsSold = events.reduce((sum, e) => sum + (e.bookedTickets || 0), 0);
  const totalRevenue = events.reduce((sum, e) => sum + ((e.bookedTickets || 0) * (e.ticketPrice || 0)), 0);
  const ticketTrend = 12.5; // Mock value
  const revenueTrend = 8.3; // Mock value

  // --- Component Render ---

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* Left Sidebar */}
      <div className="w-64 bg-white shadow-xl flex flex-col z-10 sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-wider">
            <span className="text-yellow-600">Monastery</span>360
          </h1>
          <p className="text-xs text-gray-500 mt-1">Event Partner Console</p>
        </div>

        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <img
              src={userSession?.user?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${userSession?.user?.name || 'User'}`}
              alt={userSession?.user?.name || 'User'}
              className="w-12 h-12 rounded-full ring-2 ring-yellow-400 object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">
                {userSession?.user?.name || 'Partner'}
              </p>
              <p className="text-xs text-yellow-600 font-medium truncate">Verified Event Partner</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition duration-200 ${
              activeView === 'dashboard' ? 'bg-yellow-50 text-yellow-700 font-semibold shadow-sm' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveView('my-events')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition duration-200 ${
              activeView === 'my-events' ? 'bg-yellow-50 text-yellow-700 font-semibold shadow-sm' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Calendar size={20} />
            <span>My Events</span>
          </button>

          <button
            onClick={() => setActiveView('list-events')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition duration-200 ${
              activeView === 'list-events' ? 'bg-yellow-50 text-yellow-700 font-semibold shadow-sm' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Plus size={20} />
            <span>Create Event</span>
          </button>
          
          {/* NEW DISASTER ALERT BUTTON */}
          <button
            onClick={() => setActiveView('disaster-alert')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition duration-200 ${
              activeView === 'disaster-alert' ? 'bg-red-50 text-red-600 font-semibold shadow-sm' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <AlertTriangle size={20} />
            <span>Disaster Alert</span>
          </button>

          <button
            onClick={() => setActiveView('verify-service')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition duration-200 ${
              activeView === 'verify-service' ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Zap size={20} />
            <span>Verify Service</span>
          </button>
          
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => {
              alert('Logout functionality would be implemented with NextAuth');
            }} 
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition duration-200 font-medium"
          >
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        
        {/* VIEW: DASHBOARD (Omitted for brevity) */}
        {activeView === 'dashboard' && (
          // ... (Dashboard content as provided previously) ...
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-4xl font-extrabold text-gray-800">👋 Welcome, {userSession?.user?.name?.split(' ')[0]}</h2>
              <p className="text-gray-500 mt-2">Manage your monastery events and track performance at a glance.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
                <p className="text-gray-500 text-sm mb-2 font-medium">Total Events</p>
                <p className="text-4xl font-bold text-gray-800">{totalEvents}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                <p className="text-gray-500 text-sm mb-2 font-medium">Upcoming Events</p>
                <p className="text-4xl font-bold text-blue-600">{upcomingEvents}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                <p className="text-gray-500 text-sm mb-2 font-medium">Bookings Open</p>
                <p className="text-4xl font-bold text-green-600">{bookingsOpen}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-500 text-sm font-medium">Tickets Sold</p>
                  {ticketTrend > 0 && (
                    <span className="flex items-center text-xs font-semibold text-green-600">
                      <TrendingUp size={14} className="mr-1" />
                      {ticketTrend}%
                    </span>
                  )}
                </div>
                <p className="text-4xl font-bold text-purple-600">{totalTicketsSold}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                  {revenueTrend > 0 && (
                    <span className="flex items-center text-xs font-semibold text-green-600">
                      <TrendingUp size={14} className="mr-1" />
                      {revenueTrend}%
                    </span>
                  )}
                </div>
                <p className="text-3xl font-bold text-indigo-600 flex items-center">
                  <IndianRupee size={24} />{totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Recent Events Quick View */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                  <BarChart3 size={24} className="text-yellow-600" />
                  <span>Recent Events Performance</span>
                </h3>
                <button 
                  onClick={() => setActiveView('my-events')}
                  className="text-sm text-yellow-600 hover:text-yellow-700 font-semibold"
                >
                  View All →
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.slice(0, 3).map((event) => {
                  const soldPercentage = event.totaltickets > 
                    0 ? Math.round((event.bookedTickets / event.totaltickets) * 100) : 0;
                  const revenue = event.bookedTickets * event.ticketPrice;
                                    return (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <h4 className="font-bold text-gray-800 mb-2 truncate">{event.eventName}</h4>
                      <p className="text-xs text-yellow-600 mb-3">{event.monasteryName}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-xs text-gray-500">{soldPercentage}% sold</span>
                          <span className="text-sm text-gray-700 font-medium">
                            {event.bookedTickets}/{event.totaltickets} Tickets
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                            <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: `${soldPercentage}%` }}></div>
                        </div>
                        <div className="flex justify-between text-sm pt-2">
                          <span className="text-xs text-gray-500">Total Revenue:</span>
                          {event.ticketPrice > 0 ? (
                            <span className="text-sm font-bold text-green-600 flex items-center">
                              <IndianRupee size={12} />
                              {revenue.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-sm font-bold text-gray-500">Free Event</span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2 pt-4 border-t border-gray-100">
                        <button 
                          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition text-sm font-medium"
                          onClick={() => alert(`Editing event ${event.id}`)}
                        >
                          <Edit size={14} />
                          <span>Edit</span>
                        </button>
                        <button 
                          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {events.length === 0 && (
                <div className="text-center py-20">
                  <Calendar size={64} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No Events Yet</h3>
                  <p className="text-gray-500 mb-6">Start by creating your first monastery event</p>
                  <button
                    onClick={() => setActiveView('list-events')}
                    className="px-8 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-semibold shadow-lg"
                  >
                    Create Your First Event
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: CREATE EVENT (Omitted for brevity) */}
        {activeView === 'list-events' && (
          // ... (Create Event Form content as provided previously) ...
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-4xl font-extrabold text-gray-800">List Your Event ✨</h2>
              <p className="text-gray-500 mt-2">Complete the form below to publish your event.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-xl max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <Plus size={24} className="text-yellow-600" />
                <span>New Event Details</span>
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Select Monastery</label>
                        <div className="relative">
                            <select name="monasteryId" value={formData.monasteryId} onChange={handleInputChange} disabled={isLoadingMonasteries || isSubmitting} className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400" required>
                                <option value="">{isLoadingMonasteries ? 'Loading...' : 'Choose monastery'}</option>
                                {monasteries.map((m) => (<option key={m._id} value={m._id}>{m.name}</option>))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Event Name</label>
                        <input type="text" name="eventName" value={formData.eventName} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400" placeholder="e.g., Losar Festival 2025" required />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400" required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                        <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400" required />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><label className="block text-sm font-semibold text-gray-700 mb-1">Start Time</label><input type="time" name="time" value={formData.time} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400" required /></div>
                    <div><label className="block text-sm font-semibold text-gray-700 mb-1">Duration</label><input type="text" name="duration" value={formData.duration} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400" placeholder="e.g. 2 hours" /></div>
                    <div><label className="block text-sm font-semibold text-gray-700 mb-1">Location</label><input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400" placeholder="Event location" /></div>
                </div>

                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400" placeholder="A detailed description" rows={3} /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Highlights</label><input type="text" name="highlights" value={formData.highlights} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400" placeholder="Key highlights" /></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-gray-700 mb-1">Ticket Price (₹)</label><input type="number" name="ticketPrice" value={formData.ticketPrice} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400" min="0" /></div>
                    <div><label className="block text-sm font-semibold text-gray-700 mb-1">Total Tickets</label><input type="number" name="totaltickets" value={formData.totaltickets} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400" min="0" /></div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Event Images (Max {MAX_IMAGES})</label>
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} multiple accept="image/*" className="hidden" disabled={formData.images.length >= MAX_IMAGES || isSubmitting} />
                    <div className="flex flex-wrap items-center gap-4">
                        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={formData.images.length >= MAX_IMAGES || isSubmitting} className={`w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition duration-200 ${formData.images.length >= MAX_IMAGES ? 'border-gray-300 text-gray-400 cursor-not-allowed' : 'border-yellow-400 text-yellow-600 hover:bg-yellow-50'}`}>
                            <ImagePlus size={24} /><span className="text-xs mt-1">Add Image</span>
                        </button>
                        {formData.images.map((img, index) => (
                            <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden shadow-md group">
                                <img src={img.url} alt={`Event Preview ${index + 1}`} className="w-full h-full object-cover" />
                                <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-bl-lg opacity-0 group-hover:opacity-100 transition duration-150"><X size={14} /></button>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                        <input type="checkbox" name="bookingAvailable" checked={formData.bookingAvailable} onChange={handleInputChange} className="w-5 h-5 text-yellow-600 rounded border-gray-300 focus:ring-yellow-500" />
                        <label className="text-sm font-semibold text-gray-700">Bookings Available (Mark as live/open for booking)</label>
                    </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition duration-200 shadow-md hover:shadow-lg mt-6 flex items-center justify-center disabled:opacity-50">
                    {isSubmitting ? <><Loader2 size={20} className="animate-spin mr-2" /> Publishing Event...</> : 'Publish Event'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW: MY EVENTS (Omitted for brevity) */}
        {activeView === 'my-events' && (
          // ... (My Events content as provided previously) ...
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-4xl font-extrabold text-gray-800">My Listed Events 🗓️</h2>
              <p className="text-gray-500 mt-2">View, manage, and track performance for all your monastery events.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-xl">
              <div className="overflow-x-auto">
                {fetchEventsError && (
                  <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">{fetchEventsError}</div>
                )}
                {events.length === 0 ? (
                  <div className="text-center py-10">
                    <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-bold text-gray-700 mb-2">You Haven't Listed Any Events Yet</h3>
                    <p className="text-gray-500 mb-6">Create your first event to start managing it here.</p>
                    <button
                      onClick={() => setActiveView('list-events')}
                      className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-semibold"
                    >
                      <Plus size={16} className="inline mr-2" />
                      Create New Event
                    </button>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monastery</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tickets Sold</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {events.map((event) => {
                        const revenue = event.bookedTickets * event.ticketPrice;
                        const isUpcoming = new Date(event.startDate) > new Date();
                        const isLive = !isUpcoming && new Date(event.endDate) >= new Date();
                        const isPast = new Date(event.endDate) < new Date();

                        let statusBadge;
                        if (isPast) {
                          statusBadge = <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Completed</span>;
                        } else if (isLive) {
                            statusBadge = <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">In Progress</span>;
                        } else if (event.bookingAvailable) {
                          statusBadge = <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Booking Open</span>;
                        } else {
                          statusBadge = <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Draft/Upcoming</span>;
                        }

                        return (
                          <tr key={event.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {event.eventName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {event.monasteryName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {event.startDate} to {event.endDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className="font-bold">{event.bookedTickets}</span> / {event.totaltickets}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                {event.ticketPrice > 0 ? (
                                    <span className='flex items-center'>
                                        <IndianRupee size={14} className='mr-1' /> {revenue.toLocaleString()}
                                    </span>
                                ) : (
                                    <span className='text-gray-500'>Free</span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                              {statusBadge}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => alert(`Viewing details for ${event.eventName}`)}
                                  title="View Details"
                                  className="text-gray-500 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100 transition"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  onClick={() => alert(`Editing ${event.eventName}`)}
                                  title="Edit Event"
                                  className="text-yellow-600 hover:text-yellow-700 p-2 rounded-lg hover:bg-yellow-50 transition"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteEvent(event.id)}
                                  title="Delete Event"
                                  className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: DISASTER ALERT (NEW SECTION) */}
        {activeView === 'disaster-alert' && (
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-4xl font-extrabold text-gray-800 flex items-center space-x-3">
                <AlertTriangle size={36} className="text-red-600" />
                <span>Trigger Disaster Alert</span>
              </h2>
              <p className="text-gray-500 mt-2">Immediately notify all platform users (tourists, hoteliers, etc.) of critical safety situations in Sikkim.</p>
              <p className='text-gray-500 mt-2'> NH10 closed due to massive landslide. Avoid travel to North Sikkim for 48 hours</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-xl max-w-4xl mx-auto border-t-4 border-red-500">
              <h3 className="text-2xl font-bold text-red-700 mb-6">Alert Parameters</h3>

              <form onSubmit={handleAlertSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Alert Level */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Alert Level</label>
                    <select 
                      name="alertLevel" 
                      value={alertForm.alertLevel} 
                      onChange={handleAlertChange} 
                      disabled={isSendingAlert}
                      className={`w-full px-4 py-2 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 ${
                        alertForm.alertLevel === 'Critical' ? 'border-red-500 text-red-700 font-bold' : 'border-gray-300'
                      }`} 
                      required
                    >
                      <option value="Advisory">Advisory (Low)</option>
                      <option value="Severe">Severe (High Priority)</option>
                      <option value="Critical">Critical (Immediate Action Required)</option>
                    </select>
                  </div>
                  {/* Target Areas */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Target Areas</label>
                    <input 
                      type="text" 
                      name="targetAreas" 
                      value={alertForm.targetAreas} 
                      onChange={handleAlertChange} 
                      disabled={isSendingAlert}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400" 
                      placeholder="e.g. North Sikkim, Teesta Valley" 
                      required
                    />
                  </div>
                </div>

                {/* Alert Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Alert Message</label>
                  <textarea 
                    name="message" 
                    value={alertForm.message} 
                    onChange={handleAlertChange} 
                    disabled={isSendingAlert}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400" 
                    placeholder="E.g., NH10 closed due to massive landslide. Avoid travel to North Sikkim for 48 hours." 
                    rows={4} 
                    required 
                  />
                  <p className="text-xs text-gray-500 mt-1">This message will be sent directly via email to all users.</p>
                </div>
                
                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={isSendingAlert} 
                  className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition duration-200 shadow-md hover:shadow-lg mt-6 flex items-center justify-center disabled:opacity-50"
                >
                  {isSendingAlert ? <><Loader2 size={20} className="animate-spin mr-2" /> Sending Critical Alert...</> : 'SEND IMMEDIATE ALERT'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW: VERIFY SERVICE (NEW SECTION) */}
        {activeView === 'verify-service' && (
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-4xl font-extrabold text-gray-800 flex items-center space-x-3">
                <Zap size={36} className="text-indigo-600" />
                <span>Verify Community Services</span>
              </h2>
              <p className="text-gray-500 mt-2">Review and verify services listed by the community before they go live for travelers.</p>
            </div>

            {isLoadingServices ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-indigo-500" size={48} />
              </div>
            ) : allServices.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <Zap size={64} className="mx-auto mb-4 text-gray-200" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">No Service Requests</h3>
                <p className="text-gray-500">There are no community services pending review at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allServices.map((service) => (
                  <div key={service._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col transition-all hover:shadow-xl">
                    <div className="p-5 border-b border-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          service.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          service.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {service.status}
                        </span>
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                          {service.serviceType}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-800">{service.providerName}</h4>
                      <p className="text-xs text-gray-500">{service.providerEmail}</p>
                    </div>

                    <div className="p-5 flex-1 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Calendar size={14} className="text-gray-400" />
                          <span>{new Date(service.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <MapPin size={14} className="text-gray-400" />
                          <span className="truncate">{service.location || "Sikkim"}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Phone size={14} className="text-gray-400" />
                        <span>{service.phone}</span>
                      </div>

                      {service.description && (
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <p className="text-xs text-gray-600 italic leading-relaxed">
                            "{service.description}"
                          </p>
                        </div>
                      )}
                    </div>

                    {(!service.status || service.status === 'pending') ? (
                      <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                        <button 
                          onClick={() => updateServiceStatus(service._id, 'verified')}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition shadow-sm"
                        >
                          <Check size={16} />
                          Verify
                        </button>
                        <button 
                          onClick={() => updateServiceStatus(service._id, 'rejected')}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-bold hover:bg-red-100 transition"
                        >
                          <Ban size={16} />
                          Reject
                        </button>
                      </div>
                    ) : (
                       <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                          <p className={`text-xs font-bold italic ${service.status === 'verified' ? 'text-green-600' : 'text-red-600'}`}>
                            Action taken: {service.status === 'verified' ? 'Approved & Live' : 'Rejected'}
                          </p>
                       </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Fallback for other views */}
        {/* The 'my-events' and 'list-events' views were already handled in the previous code */}

      </div>
      
    </div>
  );
};

export default MonasteryEventDashboard;