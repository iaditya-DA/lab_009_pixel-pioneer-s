"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MonasteryImage = {
  _id: string;
  title: string;
  iframe: string;
};

export default function MonasteryPage() {
  const { id } = useParams();
  const [monasteryViews, setMonasteryViews] = useState<MonasteryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchMonasteryViews = async () => {
      try {
        const res = await fetch(`/api/monastery-view/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        console.log("Final fetched data:", data);

        setMonasteryViews(data.data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMonasteryViews();
  }, [id]);

  if (loading) return <p className="text-center py-12">Loading...</p>;

  return (
    <main className="min-h-screen relative py-12 px-4 md:px-8">
      {/* Background Image Behind Whole Page */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-white">
        <img
          src="/images/vecteezy_set-of-islamic-ornamental-artistic-decoration-and_7233525.jpg"
          alt="Background Texture"
          className="h-full w-full object-cover opacity-30"
        />
      </div>

      <header className="text-center mb-4 relative z-10">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-2">
          Virtual Tour
        </p>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-serif">
          Monastery
        </h1>

        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
          Explore this monastery through immersive 360° views
        </p>
      </header>

      <section className="max-w-4xl mx-auto flex flex-col gap-2 relative z-10">
        {monasteryViews.map((view) => (
          <Card
            key={view._id}
            className="overflow-hidden shadow-sm bg-card/80 backdrop-blur-sm"
          >
            <CardContent className="p-0">
              <div className="aspect-video w-full relative flex items-center justify-center bg-black/10 overflow-hidden">

                <img
                  src="/images/vecteezy_set-of-islamic-ornamental-artistic-decoration-and_7233525.jpg" // <-- CHANGE THIS TO YOUR IMAGE
                  alt="Iframe Background"
                  className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm"
                />

   
                <div
                  className="relative z-10 w-full h-full flex items-center justify-center
                  [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:object-cover"
                  dangerouslySetInnerHTML={{ __html: view.iframe }}
                />
              </div>
            </CardContent>

            <CardHeader className="text-center py-2">
              <CardTitle className="text-lg font-medium font-serif">
                {view.title}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>

      <footer className="mt-16 text-center relative z-10">
        <p className="text-sm text-muted-foreground">Sikkim, India · Est. 1701</p>
      </footer>
    </main>
  );
}
