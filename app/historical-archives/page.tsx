"use client";
import React, { useEffect, useState } from "react";
import { Mountain, Archive, Globe, CornerRightUp, Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
type Monastery = {
  _id: string;
  name: string;
  images: string[];
  shortDescription?: string;
};

type DigitalArchive = {
  _id: string;
  monasteryId: string;
  title: string;
  description: string;
  fileUrl: string;
  images: string[];
};

const ArchiveCarousel: React.FC<{ archives: DigitalArchive[] }> = ({ archives }) => {
  if (archives.length === 0) {
    return (
      <p className="text-gray-500 text-sm p-3 bg-gray-50 rounded-lg italic">
        No featured digital archives available for this location.
      </p>
    );
  }
  return (
    <div className="flex overflow-x-auto space-x-4 pb-4 -mx-6 px-6 scrollbar-hide">
      {archives.map((archive) => (
        <div
          key={archive._id}
          className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-300 transform hover:scale-[1.03]"
        >
          <div className="w-full h-32 overflow-hidden rounded-t-xl bg-gray-100 flex items-center justify-center">
            {archive.images && archive.images.length > 0 ? (
              <img
                src={archive.images[0]}
                alt={archive.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="text-gray-400 text-xs">No Image Available</div>
            )}
          </div>
          <div className="p-4">
            <h4 className="font-semibold text-indigo-700 text-base mb-1 line-clamp-1">{archive.title}</h4>
            <p className="text-gray-600 text-xs line-clamp-2">{archive.description}</p>
            <a
              href={archive.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center text-indigo-600 text-xs font-semibold hover:text-indigo-800 transition"
            >
              View Document
              <CornerRightUp className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

const MonasteriesWithArchives: React.FC = () => {
  const [monasteries, setMonasteries] = useState<Monastery[]>([]);
  const [archives, setArchives] = useState<DigitalArchive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    async function fetchData() {
      try {
        const [resMonasteries, resArchives] = await Promise.all([
          fetch("/api/monasteryImg"),
          fetch("/api/digitalarchives"),
        ]);

        if (!resMonasteries.ok) throw new Error(`Monasteries fetch failed: ${resMonasteries.status}`);
        if (!resArchives.ok) throw new Error(`Archives fetch failed: ${resArchives.status}`);

        const dataMonasteries: Monastery[] = await resMonasteries.json();
        const dataArchives: DigitalArchive[] = await resArchives.json();

        const updatedMonasteries = dataMonasteries.map((m) => ({
          ...m,
          shortDescription:
            m.shortDescription ||
            `Explore the ancient history and profound spiritual significance of ${m.name}. A treasure trove of culture and heritage.`,
        }));

        setMonasteries(updatedMonasteries);
        setArchives(dataArchives);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error while fetching data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="mt-4 text-2xl font-semibold text-gray-700">Loading Heritage Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20 p-8 border-2 border-red-500 bg-red-50 rounded-xl shadow-2xl max-w-2xl mx-auto">
        <XCircle className="w-12 h-12 mx-auto text-red-600 mb-4" />
        <p className="text-2xl font-bold text-red-800 mb-2">Error: Connection Failed</p>
        <p className="text-md text-red-700">API Error Details: {error}</p>
        <p className="text-sm mt-3 text-red-600">Please check the backend server status for the digital archives.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative h-[60vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/djeospbqe/image/upload/v1764152141/gojmanu5_vxy2gl.webp')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-4xl text-center px-6">
          <h2 className="text-5xl font-extrabold text-white drop-shadow-lg mb-4 leading-tight">
            Witness History. Preserve Heritage.
          </h2>
          <p className="text-xl text-white font-light drop-shadow-md mb-8">
            The Official Digital Archive of Ancient Monasteries. Discover timeless stories and sacred documents.
          </p>
          
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-6">
        <h2
          id="monastery-list"
          className="text-4xl font-bold text-indigo-900 mb-10 border-b border-indigo-300 pb-4 flex items-center gap-3"
        >
          <Mountain className="w-8 h-8 text-indigo-600" />
          Featured Monasteries
        </h2>

        {monasteries.length === 0 ? (
          <p className="text-center text-gray-500 text-lg py-10">No monasteries found. The list is currently empty.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {monasteries.map((monastery) => (
              <div
                key={monastery._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-indigo-400/50 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="h-56 overflow-hidden">
                  <img
                    src={monastery.images && monastery.images.length > 0 ? monastery.images[0] : "/placeholder.png"}
                    alt={monastery.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    loading="lazy"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-indigo-900 mb-2">{monastery.name}</h3>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{monastery.shortDescription}</p>

                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <div className="flex items-center text-indigo-700 font-semibold mb-2">
                      <Archive className="w-4 h-4 mr-1" />
                      Archives Preview
                    </div>
                    <ArchiveCarousel
                    
                      archives={archives.filter((archive) => archive.monasteryId === monastery._id)}
                    />
                  </div>

                  <button
                    className="w-full mt-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300"
                    // Replace with actual routing logic or Link component as needed
                    onClick={() => router.push(`historical-archives/monastery/${monastery._id}`)}
                  >
                    View Full Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 mt-16 bg-indigo-900 text-indigo-100">
        <p className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
          <Globe className="w-5 h-5" />
          Digital Heritage Project
        </p>
        <p className="text-sm max-w-md mx-auto">
          © 2025 All Rights Reserved. Dedicated to the preservation of cultural artifacts.
        </p>
      </footer>
    </div>
  );
};

export default MonasteriesWithArchives;