"use client"

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Building2,
  Calendar,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  Bell,
  X,
  MapPin,
  Star,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Upload,
  Trash,
  ImagePlus,
} from 'lucide-react';

// TypeScript Interfaces
interface Hotel {
  _id: string;
  name: string;
  description?: string;
  images: string[];
  address: string;
  pricePerNight: number;
  rating?: number;
  available: boolean;
  owner: string;
  closestMonastery?: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  googleMapsEmbedUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AdminProfile {
  name: string;
  email: string;
  avatar?: string;
  notifications?: number;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface AddHotelFormData {
  name: string;
  description: string;
  address: string;
  pricePerNight: number;
  rating: number;
  available: boolean;
  closestMonastery: string;
  googleMapsEmbedUrl: string;
  locationLng: number;
  locationLat: number;
  images: string[];
}

type DashboardView = 'dashboard' | 'hotels' | 'bookings' | 'customers' | 'reports' | 'settings';

// Modal Component
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-slate-600" />
          </button>
        </div>
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

// Add Hotel Form
const AddHotelForm: React.FC<{
  onSubmit: (data: Partial<Hotel>) => Promise<void>;
  onClose: () => void;
}> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<AddHotelFormData>({
    name: '',
    description: '',
    address: '',
    pricePerNight: 0,
    rating: 0,
    available: true,
    closestMonastery: '',
    googleMapsEmbedUrl: '',
    locationLng: 0,
    locationLat: 0,
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const inputElement = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? inputElement.checked
          : type === 'number'
          ? Number(value)
          : value,
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      const newFiles = Array.from(files).slice(0, 5 - uploadedFiles.length);
      setUploadedFiles((prev) => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const convertFilesToBase64 = async (): Promise<string[]> => {
    const base64Images: string[] = [];

    for (const file of uploadedFiles) {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result);
        };
        reader.readAsDataURL(file);
      });
      base64Images.push(await base64Promise);
    }

    return base64Images;
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.address ||
      formData.pricePerNight <= 0 ||
      !formData.locationLng ||
      !formData.locationLat
    ) {
      alert('Please fill in all required fields');
      return;
    }

    if (uploadedFiles.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    setLoading(true);
    try {
      // Instead of base64, we pass the raw files
      const hotelData: any = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        pricePerNight: formData.pricePerNight,
        rating: formData.rating,
        available: formData.available,
        closestMonastery: formData.closestMonastery,
        googleMapsEmbedUrl: formData.googleMapsEmbedUrl,
        lng: formData.locationLng,
        lat: formData.locationLat,
        images: uploadedFiles, // Pass raw files
      };

      await onSubmit(hotelData);
      onClose();
    } catch (error) {
      console.error('Error adding hotel:', error);
      alert('Error adding hotel. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Hotel Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter hotel name"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Address *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter hotel address"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter hotel description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Price Per Night * ($)
          </label>
          <input
            type="number"
            name="pricePerNight"
            value={formData.pricePerNight}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Rating
          </label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            min="0"
            max="5"
            step="0.1"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0 - 5"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Available
          </label>
          <select
            name="available"
            value={formData.available ? 'true' : 'false'}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                available: e.target.value === 'true',
              }))
            }
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Closest Monastery
          </label>
          <input
            type="text"
            name="closestMonastery"
            value={formData.closestMonastery}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter closest monastery name"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Google Maps Embed URL
          </label>
          <input
            type="text"
            name="googleMapsEmbedUrl"
            value={formData.googleMapsEmbedUrl}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://www.google.com/maps/embed?..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Longitude *
          </label>
          <input
            type="number"
            name="locationLng"
            value={formData.locationLng}
            onChange={handleChange}
            step="0.0001"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 77.1025"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Latitude *
          </label>
          <input
            type="number"
            name="locationLat"
            value={formData.locationLat}
            onChange={handleChange}
            step="0.0001"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 23.1815"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-3">
          Hotel Images * ({uploadedFiles.length}/5)
        </label>
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploadedFiles.length >= 5}
            className="hidden"
            id="file-input"
          />
          <label
            htmlFor="file-input"
            className="cursor-pointer block"
          >
            <ImagePlus className="mx-auto mb-2 text-slate-400" size={32} />
            <p className="font-medium text-slate-700">
              Click to upload or drag images
            </p>
            <p className="text-sm text-slate-500 mt-1">
              PNG, JPG up to {5 - uploadedFiles.length} remaining
            </p>
          </label>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-slate-900">
              Uploaded Files ({uploadedFiles.length}/5):
            </p>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-xs font-semibold text-blue-600">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="p-2 hover:bg-red-100 text-red-600 rounded transition-colors"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-6">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 disabled:from-yellow-200 disabled:to-amber-200 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-yellow-100"
        >
          {loading ? 'Processing...' : 'Confirm & Add Hotel'}
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-3 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// Main Dashboard Component
const HotelAdminDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<DashboardView>('hotels');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [adminProfile, setAdminProfile] = useState<AdminProfile>({
    name: 'Admin',
    email: 'admin@hotels.com',
    notifications: 0,
  });

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'hotels', label: 'Hotels', icon: <Building2 size={20} /> },
    { id: 'bookings', label: 'Bookings', icon: <Calendar size={20} /> },
    { id: 'customers', label: 'Customers', icon: <Users size={20} /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  useEffect(() => {
    fetchAdminProfile();
    fetchHotels();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const session = await response.json();
        if (session && session.user) {
          setAdminProfile({
            name: session.user.name || 'A',
            email: session.user.email || 'admin@hotels.com',
            avatar: session.user.image,
            notifications: 0,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      setAdminProfile({
        name: 'A',
        email: 'admin@hotels.com',
        notifications: 0,
      });
    }
  };

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/get-hotel', { method: 'GET' });

      if (response.ok) {
        const hotelsData: Hotel[] = await response.json();
        setHotels(Array.isArray(hotelsData) ? hotelsData : []);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHotel = async (data: Partial<Hotel>) => {
    console.log("here is the formdata ",FormData)
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'images') {
          (data[key] as File[]).forEach(file => {
            formData.append('images', file);
          });
        } else {
          formData.append(key, String(data[key]));
        }
      });

      const response = await fetch('/api/book-hotel', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await fetchHotels();
        alert("Hotel added successfully!");
        setShowAddModal(false);
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        alert(`Error: ${errorData.message || errorData.error || 'Failed to add hotel'}`);
      }
    } catch (error) {
      console.error('Error adding hotel:', error);
      alert('Error adding hotel. Please try again.');
    }
  };

  const handleDeleteHotel = async (hotelId: string) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) {
      return;
    }

    try {
      const response = await fetch(`/api/hotels/${hotelId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchHotels();
      } else {
        alert('Failed to delete hotel');
      }
    } catch (error) {
      console.error('Error deleting hotel:', error);
      alert('Error deleting hotel');
    }
  };

  const filteredHotels = hotels.filter((hotel) =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvatarInitial = (): string => {
    return adminProfile.name?.charAt(0).toUpperCase() || 'A';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-slate-600 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 shadow-sm fixed h-full flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold">
            <span className="text-gray-800">TravelSync</span>
            <span className="text-yellow-500"> Admin</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">Accommodations Portal</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as DashboardView)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                activeView === item.id
                  ? 'bg-yellow-50 text-yellow-700 border-l-4 border-yellow-500 shadow-sm'
                  : 'text-slate-600 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
          <div className="px-8 py-4 flex justify-between items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search hotels by name or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative">
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
                  <Bell size={20} className="text-slate-600" />
                  {adminProfile.notifications && adminProfile.notifications > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{adminProfile.name}</p>
                  <p className="text-xs text-slate-500">{adminProfile.email}</p>
                </div>
                {adminProfile.avatar ? (
                  <img
                    src={adminProfile.avatar}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white font-semibold shadow-inner">
                    {getAvatarInitial()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Dashboard View */}
          {activeView === 'dashboard' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
                <p className="text-slate-600 mt-1">
                  Welcome back, {adminProfile.name}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <p className="text-sm text-slate-600 font-medium">Total Hotels</p>
                  <p className="text-3xl font-bold text-slate-900 mt-3">
                    {hotels.length}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <p className="text-sm text-slate-600 font-medium">Available</p>
                  <p className="text-3xl font-bold text-slate-900 mt-3">
                    {hotels.filter((h) => h.available).length}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <p className="text-sm text-slate-600 font-medium">Avg Rating</p>
                  <p className="text-3xl font-bold text-slate-900 mt-3">
                    {hotels.length > 0
                      ? (
                          hotels.reduce((sum, h) => sum + (h.rating || 0), 0) /
                          hotels.length
                        ).toFixed(1)
                      : 0}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <p className="text-sm text-slate-600 font-medium">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mt-3">
                    ${hotels.reduce((sum, h) => sum + h.pricePerNight, 0)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Hotels View */}
          {activeView === 'hotels' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Hotels</h2>
                  <p className="text-slate-600 mt-1">
                    Manage your hotel properties ({filteredHotels.length})
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-yellow-200 transition-all active:scale-95"
                >
                  <Plus size={24} />
                  Add New Hotel
                </button>
              </div>

              {filteredHotels.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredHotels.map((hotel) => (
                    <div
                      key={hotel._id}
                      className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold text-slate-900">
                                {hotel.name}
                              </h3>
                              {hotel.rating && (
                                <div className="flex items-center gap-1">
                                  <Star
                                    size={16}
                                    className="text-amber-400 fill-amber-400"
                                  />
                                  <span className="text-sm font-semibold text-slate-900">
                                    {hotel.rating}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                              <MapPin size={16} />
                              <span className="text-sm">{hotel.address}</span>
                            </div>
                          </div>
                          <div className="relative group">
                            <button className="p-2 hover:bg-slate-100 rounded-lg">
                              <MoreVertical
                                size={18}
                                className="text-slate-600"
                              />
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                              <button className="w-full flex items-center gap-2 px-4 py-3 text-slate-700 hover:bg-slate-50">
                                <Edit size={16} />
                                Edit
                              </button>
                              <button className="w-full flex items-center gap-2 px-4 py-3 text-slate-700 hover:bg-slate-50">
                                <Eye size={16} />
                                View Details
                              </button>
                              <button
                                onClick={() => handleDeleteHotel(hotel._id)}
                                className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>

                        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                          {hotel.description || 'No description'}
                        </p>

                        {hotel.closestMonastery && (
                          <div className="bg-blue-50 rounded p-2 mb-4 border border-blue-100">
                            <p className="text-xs text-blue-700 font-medium">
                              🏛️ {hotel.closestMonastery}
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-y border-slate-100">
                          <div>
                            <p className="text-xs text-slate-500 font-medium">
                              Price/Night
                            </p>
                            <p className="text-lg font-bold text-slate-900 mt-1">
                              ${hotel.pricePerNight}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 font-medium">
                              Status
                            </p>
                            <div className="mt-1">
                              {hotel.available ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full font-semibold">
                                  <CheckCircle size={14} />
                                  Available
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 text-xs rounded-full font-semibold">
                                  <AlertCircle size={14} />
                                  Unavailable
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {hotel.images && hotel.images.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs text-slate-500 font-medium mb-2">
                              Images ({hotel.images.length})
                            </p>
                            <div className="flex gap-2">
                              {hotel.images.slice(0, 3).map((img, idx) => (
                                <div
                                  key={idx}
                                  className="w-12 h-12 rounded border border-slate-200 overflow-hidden bg-slate-100"
                                >
                                  <img
                                    src={img}
                                    alt={`${hotel.name} ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                              {hotel.images.length > 3 && (
                                <div className="w-12 h-12 rounded border border-slate-200 bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600">
                                  +{hotel.images.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {hotel.location && (
                          <div className="text-xs text-slate-500">
                            📍 Lat: {hotel.location.coordinates[1]?.toFixed(4)}, Lng:{' '}
                            {hotel.location.coordinates[0]?.toFixed(4)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                  <Building2 className="mx-auto mb-4 text-slate-300" size={48} />
                  <p className="text-slate-600 font-medium">
                    {searchTerm
                      ? 'No hotels found matching your search'
                      : 'No hotels yet'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Other Views Placeholders */}
          {(activeView === 'bookings' ||
            activeView === 'customers' ||
            activeView === 'reports' ||
            activeView === 'settings') && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 capitalize">
                  {activeView}
                </h2>
                <p className="text-slate-600 mt-1">
                  {activeView === 'bookings' && 'Manage hotel bookings'}
                  {activeView === 'customers' && 'Manage customer information'}
                  {activeView === 'reports' && 'View analytics and reports'}
                  {activeView === 'settings' && 'Configure system settings'}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <p className="text-slate-600 font-medium">Coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Hotel Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Hotel"
      >
        <AddHotelForm
          onSubmit={handleAddHotel}
          onClose={() => setShowAddModal(false)}
        />
      </Modal>
    </div>
  );
};

export default HotelAdminDashboard;