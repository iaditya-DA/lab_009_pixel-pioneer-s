"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { 
  Search, 
  Send, 
  Trash2, 
  UserPlus, 
  MessageSquare, 
  Users,
  ChevronLeft,
  Loader2,
  X,
  Paperclip,
  FileText,
  Image as ImageIcon,
  Download,
  Plus
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Message {
  sender: string;
  content?: string;
  fileUrl?: string;
  fileType?: "text" | "image" | "pdf";
  timestamp: string;
}

interface Trip {
  _id: string;
  name?: string;
  participants: string[];
  messages: Message[];
  updatedAt: string;
}

export default function TripTogetherPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [groupName, setGroupName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [addingMember, setAddingMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [error, setError] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Polling every 500ms
  useEffect(() => {
    if (!session) return;
    
    fetchTrips(true); // Initial fetch without loading state

    const interval = setInterval(() => {
      fetchTrips(false);
    }, 500);

    return () => clearInterval(interval);
  }, [session, selectedTrip?._id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedTrip?.messages?.length]);

  const fetchTrips = async (showLoading = false) => {
    if (showLoading && trips.length === 0) setLoading(true);
    try {
      const res = await fetch("/api/trips");
      const data = await res.json();
      if (data.success) {
        setTrips(data.trips);
        // Update selected trip if it's currently open to reflect new messages or members
        if (selectedTrip) {
          const updated = data.trips.find((t: Trip) => t._id === selectedTrip._id);
          if (updated && JSON.stringify(updated) !== JSON.stringify(selectedTrip)) {
            setSelectedTrip(updated);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch trips", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleSearchUser = async () => {
    if (!searchEmail) return;
    setSearching(true);
    setError("");
    try {
      const res = await fetch(`/api/users/search?email=${searchEmail}`);
      const data = await res.json();
      if (data.success) {
        if (data.user.email === session?.user?.email) {
          setError("You cannot start a trip with yourself");
          setSearching(false);
          return;
        }
        // Create trip
        const tripRes = await fetch("/api/trips", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            participantEmail: data.user.email,
            tripName: groupName 
          }),
        });
        const tripData = await tripRes.json();
        if (tripData.success) {
          setTrips(prev => [tripData.trip, ...prev]);
          setSelectedTrip(tripData.trip);
          setSearchEmail("");
          setGroupName("");
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setSearching(false);
    }
  };

  const handleAddMember = async (emailInput?: string) => {
    const emailToAdd = emailInput || newMemberEmail;
    if (!emailToAdd || !selectedTrip) return;
    setAddingMember(true);
    try {
      const res = await fetch("/api/trips", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          tripId: selectedTrip._id,
          participantEmail: emailToAdd 
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedTrip(data.trip);
        setNewMemberEmail("");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Failed to add member");
    } finally {
      setAddingMember(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent, fileData?: { url: string, type: string }) => {
    e?.preventDefault();
    if (!selectedTrip || (!message.trim() && !fileData)) return;

    const payload = {
        tripId: selectedTrip._id,
        content: message.trim() || undefined,
        fileUrl: fileData?.url,
        fileType: fileData?.type || "text"
    };

    setMessage("");

    try {
      const res = await fetch("/api/trips/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        const updatedMsg = data.message;
        setSelectedTrip(prev => {
          if (!prev) return null;
          return {
            ...prev,
            messages: [...prev.messages, updatedMsg]
          };
        });
      }
    } catch (err) {
      console.error("Failed to send message");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedTrip) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/trips/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        handleSendMessage(undefined, { url: data.fileUrl, type: data.fileType });
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error", err);
      alert("Something went wrong during upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (!confirm("Are you sure you want to delete this trip group?")) return;

    try {
      const res = await fetch("/api/trips", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId }),
      });
      const data = await res.json();
      if (data.success) {
        setTrips(prev => prev.filter(t => t._id !== tripId));
        if (selectedTrip?._id === tripId) setSelectedTrip(null);
      }
    } catch (err) {
      console.error("Failed to delete trip");
    }
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <Loader2 className="animate-spin text-yellow-500 mb-4" size={32} />
        <p className="text-gray-600">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar - Trip List */}
      <div className={`w-full md:w-80 border-r border-gray-200 flex flex-col bg-gray-50 transition-all duration-300 ${selectedTrip ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="text-yellow-500" />
              Trip Together
            </h1>
            <button onClick={() => router.push("/userprofile")} className="text-gray-500 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Group Name (Optional)" 
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full pl-4 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-yellow-400 outline-none transition-all text-xs shadow-sm"
              />
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Friend's Email..." 
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchUser()}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-yellow-400 outline-none transition-all text-sm shadow-inner"
              />
              <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <button 
                onClick={handleSearchUser}
                disabled={searching || !searchEmail}
                className="absolute right-2 top-2 p-1.5 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors disabled:opacity-30"
              >
                {searching ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
              </button>
            </div>
          </div>
          {error && <p className="text-xs text-red-500 mt-2 ml-1 animate-pulse">{error}</p>}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading && trips.length === 0 ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-yellow-500" />
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-gray-300" size={32} />
              </div>
              <p className="text-sm text-gray-500 font-medium">No active trips</p>
              <p className="text-xs text-gray-400 mt-1">Start a group with a friend!</p>
            </div>
          ) : (
            trips.map(trip => {
              const otherParticipants = trip.participants.filter(p => p !== session.user?.email);
              const lastMessage = trip.messages[trip.messages.length - 1];
              return (
                <div 
                  key={trip._id}
                  onClick={() => setSelectedTrip(trip)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${selectedTrip?._id === trip._id ? 'bg-white border-yellow-400 shadow-md transform scale-[1.02]' : 'bg-transparent border-transparent hover:bg-white hover:border-gray-200'}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white font-bold shadow-sm shrink-0">
                        {(trip.name || otherParticipants[0])?.[0].toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-sm text-gray-900 truncate max-w-[140px]">
                          {trip.name || otherParticipants.join(', ')}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[140px] font-light">
                          {lastMessage ? (lastMessage.fileType !== 'text' ? `Sent an ${lastMessage.fileType}` : lastMessage.content) : "Start chatting..."}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteTrip(trip._id); }}
                      className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className={`flex-1 flex flex-col bg-white ${!selectedTrip ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
        {selectedTrip ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-3 flex-1 overflow-hidden">
                <button onClick={() => setSelectedTrip(null)} className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <ChevronLeft />
                </button>
                <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                  {(selectedTrip.name || selectedTrip.participants.find(p => p !== session.user?.email))?.[0].toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <h2 className="font-bold text-gray-900 truncate">
                    {selectedTrip.name || selectedTrip.participants.filter(p => p !== session.user?.email).join(', ')}
                  </h2>
                  <p className="text-[10px] text-gray-500 truncate font-medium uppercase tracking-tight">
                    {selectedTrip.participants.length} travel members
                  </p>
                </div>
              </div>
              
              {/* Add Member Input in Header */}
              <div className="flex items-center gap-2 ml-4">
                <div className="relative hidden lg:block">
                  <input 
                    type="text" 
                    placeholder="Add by email..." 
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                    className="w-40 pl-3 pr-8 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:border-yellow-400 outline-none transition-all shadow-sm"
                  />
                  <button 
                    onClick={() => handleAddMember()}
                    disabled={addingMember || !newMemberEmail}
                    className="absolute right-1 top-1 p-1 text-yellow-600 hover:bg-yellow-100 rounded transition-colors disabled:opacity-30"
                  >
                    {addingMember ? <Loader2 size={12} className="animate-spin" /> : <Plus size={14} />}
                  </button>
                </div>
                <button 
                  onClick={() => {
                    const email = prompt("Enter email to add to group:");
                    if (email) {
                        handleAddMember(email);
                    }
                  }}
                  className="lg:hidden p-2 text-yellow-600 hover:bg-yellow-50 rounded-full"
                >
                    <UserPlus size={20} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f8f9fa] pattern-dots">
              {selectedTrip.messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <MessageSquare size={32} className="opacity-20" />
                  </div>
                  <p className="font-medium">No messages yet</p>
                  <p className="text-xs text-gray-400 mt-1">Start planning your monastery visit together!</p>
                </div>
              ) : (
                selectedTrip.messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === session.user?.email ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-4 rounded-2xl text-sm shadow-sm ${msg.sender === session.user?.email ? 'bg-yellow-400 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}`}>
                      {msg.sender !== session.user?.email && (
                        <p className="text-[10px] font-bold text-yellow-600 mb-1 opacity-80 uppercase tracking-tighter">
                          {msg.sender.split('@')[0]}
                        </p>
                      )}
                      {msg.fileUrl && (
                        <div className="mb-2">
                          {msg.fileType === "image" ? (
                            <img src={msg.fileUrl} alt="attachment" className="rounded-xl max-h-60 w-full object-cover shadow-sm border border-black/5" />
                          ) : (
                            <div className={`flex items-center gap-3 p-3 rounded-xl border ${msg.sender === session.user?.email ? 'bg-yellow-500/20 border-yellow-300' : 'bg-gray-50 border-gray-200'}`}>
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <FileText className="text-red-500" size={20} />
                              </div>
                              <div className="flex-1 overflow-hidden">
                                <p className={`text-xs font-bold truncate ${msg.sender === session.user?.email ? 'text-white' : 'text-gray-900'}`}>PDF Document</p>
                                <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className={`text-[10px] flex items-center gap-1 mt-1 ${msg.sender === session.user?.email ? 'text-yellow-100 hover:text-white' : 'text-blue-500 hover:text-blue-600'} transition-colors`}>
                                  <Download size={10} /> Download PDF
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {msg.content && <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>}
                      <p className={`text-[9px] mt-2 font-medium ${msg.sender === session.user?.email ? 'text-yellow-100' : 'text-gray-400'} text-right`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
              <form onSubmit={handleSendMessage} className="flex gap-3 max-w-5xl mx-auto items-center">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                  className="hidden"
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="p-3 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-2xl transition-all disabled:opacity-50"
                  title="Attach Image or PDF"
                >
                  {uploading ? <Loader2 size={20} className="animate-spin text-yellow-500" /> : <Paperclip size={20} />}
                </button>
                
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your trip plans..." 
                  className="flex-1 px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-yellow-400 outline-none transition-all shadow-inner text-sm"
                />
                
                <button 
                  type="submit"
                  disabled={!message.trim() && !uploading}
                  className="p-3.5 bg-yellow-400 text-white rounded-2xl hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-yellow-200 active:scale-95 flex items-center justify-center"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="text-center p-8 max-w-sm">
            <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner ring-4 ring-white">
              <Users size={48} className="text-yellow-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Trip Together</h2>
            <p className="text-gray-500 mb-8 font-light leading-relaxed">
              Plan your sacred monastery visits with friends and family. Create a named group or search for an email to start.
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-600 text-sm flex items-center gap-3">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600">1</div>
                <p className="text-left font-medium">Create named groups</p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-600 text-sm flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">2</div>
                <p className="text-left font-medium">Add multiple members</p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-600 text-sm flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">3</div>
                <p className="text-left font-medium">Real-time collaboration</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .pattern-dots {
          background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}
