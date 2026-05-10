// "use client";
// import React, { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";

// type ArchiveDetail = {
//   _id: string;
//   monasteryId: string;
//   title: string;
//   type: string;
//   description: string;
//   fileUrl: string;
//   images: string[];
// };

// export default function ArchiveDetailPage() {
//   const params = useParams();
//   const archiveId = params.id 
//   const router = useRouter();

//   const [archive, setArchive] = useState<ArchiveDetail | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchArchive() {
//       try {
//         console.log(archiveId);
//         const res = await fetch(`/api/digitalarchives/${archiveId}`);
//         console.log(res);
//         if (!res.ok) throw new Error("Failed to fetch archive");
//         const data = await res.json();
//         console.log(data);
        
//         setArchive(data);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     if (archiveId) fetchArchive();
//   }, [archiveId]);

//   if (loading) return <p className="text-center mt-10">Loading...</p>;
//   if (!archive) return <p className="text-center mt-10">Archive not found.</p>;
//   return (
//     <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md my-10">
//       <button
//         className="mb-4 text-indigo-600 hover:underline"
//         onClick={() => router.back()}
//       >
//         ← Back
//       </button>

//       <h1 className="text-3xl font-bold mb-4">{archive.title}</h1>
//       <p className="text-gray-600 italic mb-4">Type: {archive.type}</p>

//       Images gallery
//       <div className="flex overflow-x-auto gap-4 mb-6">
//         {archive.images.map((imgUrl, i) => (
//           <img
//             key={i}
//             src={imgUrl}
//             alt={`${archive.title} - image ${i + 1}`}
//             className="w-64 h-40 object-cover rounded-lg flex-shrink-0"
//           />
//         ))}
//       </div>

//       <p className="mb-6 text-gray-700 whitespace-pre-line">{archive.description}</p>

//       <a
//         href={archive.fileUrl}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
//       >
//         View / Download PDF
//       </a>
//     </div>
//   );
// }

"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type ArchiveDetail = {
  _id: string;
  monasteryId: string;
  title: string;
  type: string;
  description: string;
  fileUrl: string;
  images: string[];
};

export default function ArchiveDetailPage() {
  const params = useParams();
  const archiveId = params.id;
  const router = useRouter();

  const [archive, setArchive] = useState<ArchiveDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // This state keeps track of which image is currently displayed large
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    async function fetchArchive() {
      try {
        const res = await fetch(`/api/digitalarchives/${archiveId}`);
        if (!res.ok) throw new Error("Failed to fetch archive");
        const data = await res.json();
        setArchive(data);
        setSelectedImageIndex(0); // reset to first image on new data
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    if (archiveId) fetchArchive();
  }, [archiveId]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!archive) return <p className="text-center mt-10">Archive not found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md my-10">
      <button
        className="mb-4 text-indigo-600 hover:underline"
        onClick={() => router.back()}
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-4">{archive.title}</h1>
      <p className="text-gray-600 italic mb-4">Type: {archive.type}</p>

      {/* Large selected image */}
      <div className="mb-6">
        <img
          src={archive.images[selectedImageIndex]}
          alt={`${archive.title} - image ${selectedImageIndex + 1}`}
          className="w-full max-h-[500px] object-contain rounded-lg shadow-md"
        />
      </div>

      {/* Thumbnail images */}
      <div className="flex space-x-4 overflow-x-auto">
        {archive.images.map((imgUrl, i) => (
          <img
            key={i}
            src={imgUrl}
            alt={`${archive.title} thumbnail ${i + 1}`}
            onClick={() => setSelectedImageIndex(i)}
            className={`w-24 h-16 object-cover rounded-md cursor-pointer border-2 ${
              selectedImageIndex === i
                ? "border-indigo-600"
                : "border-transparent"
            } hover:border-indigo-400 transition`}
          />
        ))}
      </div>

      <p className="mt-6 mb-6 text-gray-700 whitespace-pre-line">{archive.description}</p>

      <a
        href={archive.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
      >
        View / Download PDF
      </a>
    </div>
  );
}
