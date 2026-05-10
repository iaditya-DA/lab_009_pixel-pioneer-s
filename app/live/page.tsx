"use client";
import { useEffect, useState } from "react";
import LivePlayer from "@/components/LivePlayer";

export default function LivePage() {
  const [live, setLive] = useState<{ isLive: boolean; playbackUrl?: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchCurrent() {
      try {
        const res = await fetch(`/api/livestream/current`);
        const json = await res.json();
        if (mounted) setLive(json);
      } catch (err) {
        console.error(err);
        if (mounted) setLive({ isLive: false });
      }
    }
    fetchCurrent();
    const interval = setInterval(fetchCurrent, 15_000); // poll every 15s
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  if (!live) return <p>Loading...</p>;

  if (!live.isLive) return <p className="p-6">⚪ No livestream currently.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Live Stream</h1>
      {live.playbackUrl ? (
        <LivePlayer playbackUrl={live.playbackUrl} />
      ) : (
        <p>No playback URL provided.</p>
      )}
    </div>
  );
}
