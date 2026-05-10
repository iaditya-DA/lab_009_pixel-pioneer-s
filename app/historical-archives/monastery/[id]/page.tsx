"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type DigitalArchive = {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  images: string[];
};

type Monastery = {
  _id: string;
  name: string;
  description: string;
  foundedYear: number;
  images: string[];
};

export default function MonasteryArchivePage() {
  const params = useParams();
  const monasteryId = params.id as string;
  const router = useRouter();

  const [monastery, setMonastery] = useState<Monastery | null>(null);
  const [archives, setArchives] = useState<DigitalArchive[]>([]);

  useEffect(() => {
    const fetchArchives = async () => {
      const res = await fetch(`/api/digitalArchives-monastery/${monasteryId}`);
      const data = await res.json();
      setArchives(data);
    };

    const fetchMonastery = async () => {
      const res = await fetch(`/api/monasteryImg/${monasteryId}`);
      const data = await res.json();
      setMonastery(data);
      console.log(data);
    };

    if (monasteryId) {
      fetchArchives();
      fetchMonastery();
    }
  }, [monasteryId]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 max-w-7xl mx-auto">
          <button
        className="mb-4 text-indigo-600 hover:underline"
        onClick={() => router.back()}
      >
        ← Back
      </button>
      {/* Monastery Info */}
      {monastery && (
        <div className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-md p-6 mb-10 gap-6">
          {/* Main Image */}
          <img
            src={monastery.images?.[0]}
            alt={monastery.name}
            className="w-full md:w-72 h-48 object-cover rounded-lg shadow-md"
          />

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{monastery.name}</h1>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Founded Year:</span> {monastery.foundedYear}
            </p>
            <p className="text-gray-700 line-clamp-4">{monastery.description}</p>
          </div>
        </div>
      )}

      {/* Archives */}
      {archives.length === 0 ? (
        <p className="text-center text-gray-600">No archives found...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {archives.map((archive) => (
            <div
              key={archive._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={archive.images?.[0]}
                alt={archive.title}
                className="w-full h-52 object-cover"
              />

              <div className="p-5">
                <h2 className="text-xl font-semibold mb-2">{archive.title}</h2>

                <p className="text-gray-700 text-sm line-clamp-3 mb-3">{archive.description}</p>

                <div className="flex items-center gap-2">
                  <button
                    className="flex-1 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
                    onClick={() => router.push(`/historical-archives/${archive._id}`)}
                  >
                    View Details
                  </button>
                  <button
                    className="flex-1 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition"
                    onClick={() => window.open(archive.fileUrl, "_blank")}
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
