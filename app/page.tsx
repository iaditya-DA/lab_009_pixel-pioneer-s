"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  MapPin,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { AuthModal } from "@/components/auth/AuthModal";
import { useSession, signOut } from "next-auth/react";
import Carousel from "@/components_styling/carousel";

import Monastery360Chatbot from "@/lib/assitantComponents";
import Footer from "@/common/footer";
import { CuratedItineraries } from "@/components/ui/itenary";
import { FeaturedMonasteries } from "@/components_styling/featured_monastery";
import { DownloadAppSection } from "@/components/ui/downloadApp";

interface MonasteryType {
  _id: string;
  name: string;
  location: string | { lat: number; lng: number };
  images: string[];
}

const Monastery360 = () => {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [showExploreDropdown, setShowExploreDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileExplore, setShowMobileExplore] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);

  const monasteries = [
    { name: "Rumtek Monastery", location: "East Sikkim" },
    { name: "Pemayangtse Monastery", location: "West Sikkim" },
    { name: "Tashiding Monastery", location: "West Sikkim" },
    { name: "Enchey Monastery", location: "Gangtok" },
    { name: "Dubdi Monastery", location: "Yuksom" },
  ];

  const exploreLinks = [
    { label: "Historical Archives", path: "/historical-archives" },
    { label: "Cultural Events & Festivals", path: "/cultural-events" },
    { label: "Sikkim", path: "/sikkim" },
    {label:"Cultural Calendar",path:"/calendar"}
  ];

  const getDashboardRoute = (role: string | undefined) => {
    switch (role?.toLowerCase()) {
      case "hotelier":
        return "/hotel-admin";
      case "monasteryadmin":
        return "/monastery-admin";
      case "user":
      default:
        return "/userprofile";
    }
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string | undefined) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-green-500",
      "bg-orange-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-cyan-500",
    ];
    const hash = (name || "").split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    return colors[hash % colors.length];
  };

  const [monastery, setMonastery] = useState<MonasteryType[]>([]);
  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/monastries`);
      const data = await res.json();
      setMonastery(data);
    }
    fetchData();
  }, []);

  // Auto-change video every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % monasteries.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [monasteries.length]);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentVideo) {
          const playPromise = video.play();
          if (playPromise !== undefined) playPromise.catch(() => {});
        } else {
          video.pause();
        }
        video.muted = isMuted;
      }
    });
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentVideo, isMuted]);

  const handleVideoChange = (dir: "next" | "prev") => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    const nextIndex =
      dir === "next"
        ? (currentVideo + 1) % monasteries.length
        : (currentVideo - 1 + monasteries.length) % monasteries.length;

    setCurrentVideo(nextIndex);

    setTimeout(() => setIsTransitioning(false), 800);
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newState = !prev;
      videoRefs.current.forEach((v) => {
        if (v) v.muted = newState;
      });

      if (audioRef.current) {
        if (newState) {
          audioRef.current.pause();
        } else {
          audioRef.current.play().catch(() => {});
        }
      }

      return newState;
    });
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setShowMobileMenu(false);
    setShowMobileExplore(false);
  };

  const currentMonastery = monasteries[currentVideo];
  const userRole = session?.user?.role || "user";
  const userName = session?.user?.name || "User";
  const userImage = session?.user?.image;
  const initials = getInitials(userName);
  const avatarColor = getAvatarColor(userName);

  // Desktop Navbar
  const NavbarContent = () => (
    <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8">
      <div className="text-xl md:text-2xl font-bold tracking-wide">
        <span className="text-white">Travel</span>
        <span className="text-yellow-400">Sync</span>
      </div>

      <div className="hidden md:flex items-center space-x-8">
        <button
          onClick={() => handleNavigation("/model-list")}
          className="hover:text-yellow-400 transition cursor-pointer text-sm"
        >
          Model 360
        </button>
        <button
          onClick={() => handleNavigation("/monasteries")}
          className="hover:text-yellow-400 transition cursor-pointer text-sm"
        >
          Explore India
        </button>
        <button
          onClick={() => handleNavigation("/hotels")}
          className="hover:text-yellow-400 transition cursor-pointer text-sm"
        >
          Hotels
        </button>
         <button
          onClick={() => handleNavigation("/local-transport")}
          className="hover:text-yellow-400 transition cursor-pointer text-sm"
        >
          Local Services
        </button>
        <button
          onClick={() => handleNavigation("/ai-planner")}
          className="hover:text-yellow-400 transition cursor-pointer text-sm"
        >
          Plan Your Trip
        </button>

        <div
          className="relative"
          onMouseEnter={() => setShowExploreDropdown(true)}
          onMouseLeave={() => setShowExploreDropdown(false)}
        >
          <button className="flex items-center space-x-1 hover:text-yellow-400 transition text-sm">
            <span>More</span>
            <ChevronDown
              size={18}
              className={`transition-transform ${showExploreDropdown ? "rotate-180" : ""}`}
            />
          </button>

          {showExploreDropdown && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-gray-900 text-white rounded-lg shadow-xl py-2 z-50 border border-gray-700">
              {exploreLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => {
                    handleNavigation(link.path);
                    setShowExploreDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-yellow-400 hover:text-black transition text-sm"
                >
                  {link.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {session?.user ? (
          <div className="relative">
            {userImage ? (
              <img
                src={userImage}
                alt="avatar"
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-yellow-400"
                onClick={() => setShowDropdown((p) => !p)}
              />
            ) : (
              <div
                className={`w-10 h-10 rounded-full cursor-pointer border-2 border-yellow-400 flex items-center justify-center font-semibold text-white text-sm ${avatarColor}`}
                onClick={() => setShowDropdown((p) => !p)}
              >
                {initials}
              </div>
            )}

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-48 bg-white text-black rounded-xl shadow-xl py-3 z-50">
                <div className="px-4 py-2 font-semibold border-b text-sm">
                  {userName}
                </div>

                <button
                  onClick={() => {
                    handleNavigation(getDashboardRoute(userRole));
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Dashboard
                </button>

                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-yellow-400 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-500 transition text-sm"
          >
            Get Started
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        className="md:hidden text-white z-50"
      >
        {showMobileMenu ? <X size={28} /> : <Menu size={28} />}
      </button>
    </div>
  );

  // Mobile Menu
  const MobileMenu = () => (
    <div className="fixed inset-0 bg-black z-40 pt-20 md:hidden overflow-y-auto">
      <div className="px-4 py-6 space-y-4">
        <button
          onClick={() => handleNavigation("/model-list")}
          className="block w-full text-left py-3 border-b border-gray-700 hover:text-yellow-400 transition"
        >
          Model 360
        </button>
        <button
          onClick={() => handleNavigation("/monasteries")}
          className="block w-full text-left py-3 border-b border-gray-700 hover:text-yellow-400 transition"
        >
          Explore Monastries
        </button>
        <button
          onClick={() => handleNavigation("/local-transport")}
          className="block w-full text-left py-3 border-b border-gray-700 hover:text-yellow-400 transition"
        >
          Local Services
        </button>
        <button
          onClick={() => handleNavigation("/ai-planner")}
          className="block w-full text-left py-3 border-b border-gray-700 hover:text-yellow-400 transition"
        >
          Plan Your Trip
        </button>

        <button
          onClick={() => setShowMobileExplore(!showMobileExplore)}
          className="flex items-center justify-between w-full py-3 border-b border-gray-700 hover:text-yellow-400 transition"
        >
          <span>More</span>
          <ChevronDown
            size={18}
            className={`transition-transform ${showMobileExplore ? "rotate-180" : ""}`}
          />
        </button>

        {showMobileExplore && (
          <div className="pl-4 space-y-2 border-b border-gray-700 pb-4">
            {exploreLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavigation(link.path)}
                className="block w-full text-left py-2 hover:text-yellow-400 transition text-sm"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-gray-700">
          {session?.user ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3 py-2">
                {userImage ? (
                  <img
                    src={userImage}
                    alt="avatar"
                    className="w-10 h-10 rounded-full border-2 border-yellow-400"
                  />
                ) : (
                  <div
                    className={`w-10 h-10 rounded-full border-2 border-yellow-400 flex items-center justify-center font-semibold text-white text-sm ${avatarColor}`}
                  >
                    {initials}
                  </div>
                )}
                <span className="text-sm font-semibold">{userName}</span>
              </div>
              <button
                onClick={() => {
                  handleNavigation(getDashboardRoute(userRole));
                }}
                className="block w-full text-left py-2 hover:text-yellow-400 transition text-sm"
              >
                Dashboard
              </button>
              <button
                onClick={() => signOut()}
                className="block w-full text-left py-2 hover:text-red-400 transition text-sm text-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full bg-yellow-400 text-black px-4 py-3 rounded-full font-semibold hover:bg-yellow-500 transition"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-black text-white overflow-x-hidden">
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          backgroundImagePath="/images/sikkimHe.avif"
        />
      )}

      <audio
        ref={audioRef}
        loop
        muted={isMuted}
        playsInline
      >
        <source src="/audio/landingpage_audiotape.mpeg" type="audio/mpeg" />
      </audio>

      {showSticky && (
        <nav className="fixed top-0 left-0 right-0 z-40 py-4 bg-black border-b border-gray-800 transition-all duration-300">
          <NavbarContent />
        </nav>
      )}

      <div className="relative h-screen w-full overflow-hidden">
        {monasteries.map((monastery, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentVideo ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            <video
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              className="w-full h-full object-cover"
              loop
              muted={isMuted}
              playsInline
            >
              <source
                src={`/videos/monastery-${index + 1}.mp4`}
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
          </div>
        ))}

        <nav className="absolute top-0 left-0 right-0 z-30 py-4 md:py-6">
          <NavbarContent />
        </nav>

        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl">
            <p className="text-yellow-400 text-sm md:text-lg lg:text-xl mb-3 md:mb-4 tracking-widest uppercase">
              Step into the allure of India
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-serif italic mb-4 md:mb-6">
              Incredible Wonders
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto px-2">
              Explore over india through immersive 360° virtual
              experiences.
            </p>
          </div>
        </div>

        <Monastery360Chatbot />

        {showMobileMenu && <MobileMenu />}

        <div className="absolute bottom-0 left-0 right-0 z-30 pb-6 md:pb-12 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0">
              <div className="flex flex-col">
                <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-yellow-400">
                  {currentMonastery.name}
                </div>
                <div className="text-base md:text-lg lg:text-xl font-light text-white opacity-80 mt-2">
                  <MapPin className="inline w-4 h-4 md:w-5 md:h-5 mr-2" />
                  {currentMonastery.location}
                </div>
              </div>

              <div className="flex gap-3 md:gap-4 w-full md:w-auto">
                <button
                  onClick={toggleMute}
                  className="bg-white/20 backdrop-blur-sm p-3 md:p-4 rounded-full hover:bg-white/30 transition flex-1 md:flex-none"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>

                <button
                  onClick={() => handleVideoChange("prev")}
                  disabled={isTransitioning}
                  className="bg-white/20 backdrop-blur-sm p-3 md:p-4 rounded-full hover:bg-white/30 transition flex-1 md:flex-none"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={() => handleVideoChange("next")}
                  disabled={isTransitioning}
                  className="bg-white/20 backdrop-blur-sm p-3 md:p-4 rounded-full hover:bg-white/30 transition flex-1 md:flex-none"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FeaturedMonasteries />
      <CuratedItineraries />
      <DownloadAppSection />
      <Footer />
    </div>
  );
};
export default Monastery360;
