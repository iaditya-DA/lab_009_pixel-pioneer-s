"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, Ticket, AlertCircle, X, Tag } from 'lucide-react';

interface IEvent {
  _id: string;
  eventName: string;
  startDate: string;
  endDate?: string;
  time?: string;
  duration?: string;
  location?: string;
  description?: string;
  highlights?: string | string[];
  images?: string[];
  bookingAvailable: boolean;
  ticketPrice?: number;
  totaltickets?: number;
  bookedTickets: number;
  category?: string;
}

type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const MonasteryCalendar: React.FC = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  // Fetch events from API
  const fetchEvents = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/events');

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const data = await response.json();
      setEvents(Array.isArray(data) ? data : data.events || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load events';
      setError(errorMessage);
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Check if event occurs on a specific date
  const isEventOnDate = (eventDate: string, day: number): boolean => {
    const dateStr: string = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Parse the event start date (YYYY-MM-DD format)
    const eventStart = eventDate;
    
    // If there's an end date, check the range
    if (eventDate.includes('-') && eventDate.split('-').length === 3) {
      return dateStr === eventStart;
    }
    
    return dateStr === eventStart;
  };

  const getEventsForDate = (day: number): IEvent[] => {
    const dateStr: string = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    return events.filter((event: IEvent) => {
      const eventStart: string = event.startDate;
      
      // Only show if date matches the start date
      return dateStr === eventStart;
    });
  };

  const handlePreviousMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedEvent(null);
  };

  const handleNextMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedEvent(null);
  };

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): DayOfWeek => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay() as DayOfWeek;
  };

  const monthName: string = currentDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const totalDays: number = getDaysInMonth(currentDate);
  const firstDay: number = getFirstDayOfMonth(currentDate);
  const days: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  const colorPalette = [
    { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-900', dot: 'bg-blue-400' },
    { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-900', dot: 'bg-emerald-400' },
    { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-900', dot: 'bg-purple-400' },
    { bg: 'bg-pink-50', border: 'border-pink-300', text: 'text-pink-900', dot: 'bg-pink-400' },
    { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-900', dot: 'bg-amber-400' },
    { bg: 'bg-cyan-50', border: 'border-cyan-300', text: 'text-cyan-900', dot: 'bg-cyan-400' },
    { bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-900', dot: 'bg-rose-400' },
    { bg: 'bg-indigo-50', border: 'border-indigo-300', text: 'text-indigo-900', dot: 'bg-indigo-400' },
  ];

  const getEventColor = (index: number): { bg: string; border: string; text: string; dot: string } => {
    return colorPalette[index % colorPalette.length];
  };

  const getCategoryColor = (category?: string): string => {
    const categoryMap: { [key: string]: string } = {
      festival: 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800',
      ritual: 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800',
      cultural: 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800',
      ceremony: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800',
    };
    return categoryMap[category || 'festival'] || 'bg-gray-100 text-gray-800';
  };

  const parseHighlights = (highlights: string | string[] | undefined): string[] => {
    if (!highlights) return [];
    if (Array.isArray(highlights)) return highlights;
    
    // Parse string format like: '"Item1", "Item2", "Item3"'
    const cleaned = highlights.replace(/["']/g, '').split(',').filter(h => h.trim());
    return cleaned.map(h => h.trim());
  };

  const availableTickets: number = selectedEvent
    ? (selectedEvent.totaltickets || 0) - selectedEvent.bookedTickets
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Monastery Events</h1>
            <p className="text-slate-600 text-sm mt-1">Discover and book spiritual experiences</p>
          </div>
          <button
            onClick={fetchEvents}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
              {/* Calendar Header */}
              <div className="p-8 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
                <h2 className="text-3xl font-bold text-slate-900">{monthName}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handlePreviousMonth}
                    className="p-3 hover:bg-slate-200 rounded-xl transition-colors"
                    aria-label="Previous month"
                  >
                    <svg
                      className="w-6 h-6 text-slate-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-3 hover:bg-slate-200 rounded-xl transition-colors"
                    aria-label="Next month"
                  >
                    <svg
                      className="w-6 h-6 text-slate-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border-b border-red-200 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="p-20 text-center">
                  <div className="inline-block animate-spin">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-600 rounded-full"></div>
                  </div>
                  <p className="text-slate-600 mt-4 font-medium">Loading events...</p>
                </div>
              )}

              {/* Calendar Grid */}
              {!loading && (
                <div className="p-8" ref={calendarRef}>


                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-3">
                    {days.map((day: number | null, index: number) => {
                      const dayEvents: IEvent[] = day ? getEventsForDate(day) : [];
                      const isToday = day === new Date().getDate() && 
                                     currentDate.getMonth() === new Date().getMonth() &&
                                     currentDate.getFullYear() === new Date().getFullYear();

                      const getDateColor = (eventCount: number): { bg: string; textColor: string; dayColor: string } => {
                        if (eventCount === 0) return { bg: 'bg-white', textColor: 'text-slate-600', dayColor: 'text-slate-700' };
                        if (eventCount === 1) return { bg: 'bg-gradient-to-br from-blue-100 to-blue-50', textColor: 'text-blue-700', dayColor: 'text-blue-900' };
                        if (eventCount === 2) return { bg: 'bg-gradient-to-br from-emerald-100 to-emerald-50', textColor: 'text-emerald-700', dayColor: 'text-emerald-900' };
                        if (eventCount === 3) return { bg: 'bg-gradient-to-br from-purple-100 to-purple-50', textColor: 'text-purple-700', dayColor: 'text-purple-900' };
                        return { bg: 'bg-gradient-to-br from-pink-100 to-pink-50', textColor: 'text-pink-700', dayColor: 'text-pink-900' };
                      };

                      const dateColor = getDateColor(dayEvents.length);

                      return (
                        <div
                          key={index}
                          className={`min-h-40 border-2 rounded-xl p-3 transition-all ${
                            day
                              ? `${dayEvents.length > 0 ? dateColor.bg + ' border-slate-300 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'} ${isToday ? 'ring-2 ring-blue-400 border-blue-300' : ''}`
                              : 'border-transparent bg-slate-50/50'
                          }`}
                        >
                          {day && (
                            <>
                              <div className="flex items-center gap-2 mb-3">
                                <p className={`text-lg font-bold px-3 py-1.5 rounded-lg ${dayEvents.length > 0 ? dateColor.textColor + ' bg-white/60 backdrop-blur-sm' : dateColor.dayColor}`}>
                                  {day}
                                </p>
                              </div>
                              <div className="space-y-1.5 max-h-32 overflow-y-auto scrollbar-hide">
                                {dayEvents.map((event: IEvent, eventIndex: number) => {
                                  const colors = getEventColor(eventIndex);
                                  return (
                                    <button
                                      key={event._id}
                                      onClick={() => setSelectedEvent(event)}
                                      className={`w-full text-left text-xs font-semibold px-2.5 py-1.5 rounded-lg border-2 transition-all hover:shadow-md ${colors.bg} ${colors.border} ${colors.text} truncate`}
                                      title={event.eventName}
                                    >
                                      <div className="flex items-center gap-1">
                                        <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}></div>
                                        <span className="truncate">{event.eventName}</span>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Event Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 sticky top-24 overflow-hidden max-h-[calc(100vh-120px)]">
              {selectedEvent ? (
                <div className="h-full flex flex-col">
                  {/* Close Button */}
                  <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
                    <h3 className="font-bold text-slate-900 text-lg">Event Details</h3>
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>

                  {/* Event Image */}
                  <div className="relative h-48 bg-gradient-to-br from-slate-300 to-slate-400 overflow-hidden">
                    {selectedEvent.images && selectedEvent.images.length > 0 ? (
                      <img
                        src={selectedEvent.images[0]}
                        alt={selectedEvent.eventName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Ticket className="w-16 h-16 text-slate-200" />
                      </div>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="p-5 flex-1 overflow-y-auto space-y-4">
                    {/* Category Badge */}
                    {selectedEvent.category && (
                      <div className="flex gap-2">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${getCategoryColor(selectedEvent.category)}`}>
                          {selectedEvent.category.toUpperCase()}
                        </span>
                      </div>
                    )}

                    <div>
                      <h4 className="text-xl font-bold text-slate-900 leading-tight">{selectedEvent.eventName}</h4>
                    </div>

                    {selectedEvent.description && (
                      <div>
                        <p className="text-sm text-slate-600 leading-relaxed">{selectedEvent.description}</p>
                      </div>
                    )}

                    <div className="space-y-3 pt-3 border-t border-slate-200">
                      {selectedEvent.startDate && (
                        <div className="flex items-start gap-3">
                          <Clock className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase">Date</p>
                            <p className="text-sm font-medium text-slate-900">
                              {new Date(selectedEvent.startDate).toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedEvent.time && (
                        <div className="flex items-start gap-3">
                          <Clock className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase">Time</p>
                            <p className="text-sm font-medium text-slate-900">{selectedEvent.time}</p>
                          </div>
                        </div>
                      )}

                      {selectedEvent.location && (
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase">Location</p>
                            <p className="text-sm font-medium text-slate-900">{selectedEvent.location}</p>
                          </div>
                        </div>
                      )}

                      {selectedEvent.duration && (
                        <div className="flex items-start gap-3">
                          <Tag className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase">Duration</p>
                            <p className="text-sm font-medium text-slate-900">{selectedEvent.duration}</p>
                          </div>
                        </div>
                      )}

                      {parseHighlights(selectedEvent.highlights).length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Highlights</p>
                          <ul className="space-y-1.5">
                            {parseHighlights(selectedEvent.highlights).map((highlight: string, i: number) => (
                              <li key={i} className="text-sm text-slate-700 flex gap-2">
                                <span className="text-slate-400 flex-shrink-0">✓</span>
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {selectedEvent.bookingAvailable && (
                      <div className="pt-3 border-t border-slate-200 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-600">Price per ticket</span>
                          <span className="font-bold text-slate-900">${selectedEvent.ticketPrice || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-600">Available tickets</span>
                          <span className={`font-bold ${availableTickets > 10 ? 'text-emerald-600' : availableTickets > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                            {availableTickets}
                          </span>
                        </div>
                        <button className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all text-sm mt-4">
                          Book Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-96 flex flex-col items-center justify-center p-6 text-center">
                  <Ticket className="w-16 h-16 text-slate-200 mb-3" />
                  <p className="text-slate-500 font-medium">Click on an event to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonasteryCalendar;