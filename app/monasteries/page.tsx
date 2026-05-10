"use client"

import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Users, Star, Flame, Award } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Location {
  lat: number;
  lng: number;
}

interface IMonastery {
  _id: number;
  name: string;
  description?: string;
  location: Location;
  district: string;
  images: string[];
  history?: string;
  architecture?: string;
  foundedYear?: number;
  villageOrTown?: string;
  state: string;
  googleMapsLink?: string;
  altitude?: string;
  buddhistSect?: string;
  nearbyAttractions?: string[];
}

const Card: React.FC<{
  monastery: IMonastery;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}> = ({ monastery, index, isFavorite, onToggleFavorite }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const visitors = Math.floor(Math.random() * (8000 - 2000 + 1)) + 2000;
  const rating = (Math.random() * (5.0 - 4.7) + 4.7).toFixed(2);
  const isPopular = Math.random() > 0.6;

  return (
    <Link href={`/monastery/${monastery._id}`}>
      <div
        className="group h-full cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          animation: `fadeInUp 0.6s ease-out ${index * 0.08}s both`,
        }}
      >
        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }
          @keyframes pulse-float {
            0%, 100% { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
            50% { box-shadow: 0 8px 32px rgba(0,0,0,0.15); }
          }
        `}</style>

        <div className="relative h-full rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-500 hover:shadow-slate-200">
          {/* Image Container */}
          <div className="relative w-full h-80 overflow-hidden bg-gray-100">
            {monastery.images && monastery.images.length > 0 ? (
              <>
                <img
                  src={monastery.images[0]}
                  alt={monastery.name}
                  onLoad={() => setImageLoaded(true)}
                  className="w-full h-full object-cover transition-transform duration-700"
                  style={{
                    transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                  }}
                />
                {isHovered && (
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
                    style={{ animation: 'fadeIn 0.3s ease-out' }}
                  />
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-gray-500 text-lg font-semibold">Sacred Site</span>
              </div>
            )}

            {/* Popular Badge */}
            {isPopular && (
              <div
                className="absolute top-4 left-4 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-100"
                style={{
                  animation: isHovered ? 'float 2s ease-in-out infinite' : 'none',
                }}
              >
                <Flame size={16} className="text-red-500" />
                <span className="text-gray-900 font-bold text-sm">Trending</span>
              </div>
            )}

            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(monastery._id);
              }}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:bg-gray-50"
            >
              <Heart
                size={24}
                className={`transition-all duration-300 ${
                  isFavorite
                    ? 'fill-red-500 text-red-500'
                    : 'text-gray-700 hover:text-red-500'
                }`}
              />
            </button>

            {/* Stats Overlay - Appears on Hover */}
            <div
              className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              <div className="flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-blue-300" />
                  <span className="text-sm font-semibold">Heritage Site</span>
                </div>
                {monastery.foundedYear && (
                  <span className="text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur">
                    Est. {monastery.foundedYear}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-5">
            {/* Name */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
              {monastery.name}
            </h3>

            {/* Location */}
            <div className="flex items-start gap-2 text-gray-600 mb-3">
              <MapPin size={14} className="mt-0.5 flex-shrink-0 text-gray-400" />
              <span className="text-sm leading-snug">
                {monastery.villageOrTown || monastery.district}, {monastery.state}
              </span>
            </div>

            {/* Buddhist Sect Badge */}
            {monastery.buddhistSect && (
              <div className="mb-4">
                <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-semibold border border-blue-100">
                  {monastery.buddhistSect}
                </span>
              </div>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
              {/* Rating */}
              <div className="text-center group/stat">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-gray-900 text-sm">{rating}</span>
                </div>
                <span className="text-xs text-gray-500">Rating</span>
              </div>

              {/* Visitors */}
              <div className="text-center group/stat">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users size={14} className="text-blue-500" />
                  <span className="font-bold text-gray-900 text-sm">
                    {(visitors / 1000).toFixed(1)}K
                  </span>
                </div>
                <span className="text-xs text-gray-500">Visited</span>
              </div>

              {/* Year */}
              <div className="text-center group/stat">
                <div className="font-bold text-gray-900 text-sm mb-1">
                  {monastery.foundedYear ? monastery.foundedYear : 'N/A'}
                </div>
                <span className="text-xs text-gray-500">Founded</span>
              </div>
            </div>

            {/* Hover CTA */}
            <button
              className="w-full mt-4 bg-gray-900 text-white font-bold py-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-3 group-hover:translate-y-0 hover:bg-gray-800 hover:shadow-lg"
              style={{
                cursor: 'pointer',
              }}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

const MonasteryListings: React.FC = () => {
  const [monasteries, setMonasteries] = useState<IMonastery[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchMonasteries = async () => {
      try {
        const response = await fetch('/api/monastries');
        const data: IMonastery[] = await response.json();
        setMonasteries(data);
      } catch (error) {
        console.error('Error fetching monasteries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonasteries();
  }, []);

  const toggleFavorite = (id: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <style>{`
          @keyframes spin-smooth {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div
          className="h-14 w-14 rounded-full border-4 border-gray-200 border-t-gray-900"
          style={{
            animation: 'spin-smooth 1.5s linear infinite',
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div style={{ animation: 'fadeInUp 0.8s ease-out' }}>
            <div className="flex items-center justify-between">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-3">
                Popular Monasteries
              </h1>
            </div>

            <p className="text-gray-600 text-lg max-w-2xl leading-relaxed mt-4">
              Discover the world's most revered spiritual sanctuaries. Explore ancient
              temples, breathtaking architecture, and profound spiritual heritage.
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {monasteries.map((monastery, index) => (
            <Card
              key={monastery._id}
              monastery={monastery}
              index={index}
              isFavorite={favorites.has(monastery._id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>

        {monasteries.length === 0 && (
          <div className="text-center py-24">
            <p className="text-gray-500 text-xl">No monasteries found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonasteryListings;