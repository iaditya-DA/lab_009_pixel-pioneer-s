"use client";
import { useState, useEffect } from "react";
import LivePlayer from "@/components/LivePlayer";

export default function DashboardLive() {
  const [monasteryId, setMonasteryId] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!monasteryId) return;
    fetchLivestream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monasteryId]);

  async function fetchLivestream() {
    setLoading(true);
    try {
      const res = await fetch(`/api/livestream/get?monasteryId=${encodeURIComponent(monasteryId)}`);
      const json = await res.json();
      if (json.success) setData(json.livestream);
      else setMessage(json.message || "Failed to fetch");
    } catch (err) {
      console.error(err);
      setMessage("Error fetching livestream");
    } finally {
      setLoading(false);
    }
  }

  async function saveCreds() {
    if (!monasteryId) return alert("Enter monasteryId");
    const streamKey = prompt("Enter stream key:");
    const rtmpUrl = prompt("Enter RTMP URL:", "rtmp://live-ingest-01.vd0.co:1935/livestream");
    const playbackUrl = prompt("Enter playback URL (HLS):", "https://example.com/live.m3u8");
    if (!streamKey || !rtmpUrl || !playbackUrl) return alert("All fields required");

    setLoading(true);
    try {
      const res = await fetch(`/api/livestream/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monasteryId, streamKey, rtmpUrl, playbackUrl }),
      });
      const json = await res.json();
      if (json.success) {
        setData(json.livestream);
        alert("Saved livestream credentials");
      } else {
        alert(json.message || "Save failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving credentials");
    } finally {
      setLoading(false);
    }
  }

  async function setLive(state: boolean) {
    if (!monasteryId) return alert("Enter monasteryId");
    setLoading(true);
    try {
      const res = await fetch(`/api/livestream/set-live?monasteryId=${encodeURIComponent(monasteryId)}&state=${state}`);
      const json = await res.json();
      if (json.success) {
        setData(json.livestream);
        alert(`Set live = ${state}`);
      } else {
        alert(json.message || "Failed to set live");
      }
    } catch (err) {
      console.error(err);
      alert("Error setting live state");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Go Live (Admin)</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Monastery ID</label>
        <input value={monasteryId} onChange={(e) => setMonasteryId(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" />
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={saveCreds} className="px-4 py-2 bg-yellow-500 text-white rounded">Save Credentials</button>
        <button onClick={() => setLive(true)} className="px-4 py-2 bg-green-600 text-white rounded">Set Live ON</button>
        <button onClick={() => setLive(false)} className="px-4 py-2 bg-red-600 text-white rounded">Set Live OFF</button>
        <button onClick={fetchLivestream} className="px-4 py-2 bg-gray-200 rounded">Refresh</button>
      </div>

      {loading && <p>Loading...</p>}

      {data ? (
        <div className="space-y-3">
          <p><strong>RTMP Server URL:</strong> {data.rtmpUrl}</p>
          <p><strong>Stream Key:</strong> {data.streamKey}</p>
          <p><strong>Playback URL:</strong> {data.playbackUrl}</p>
          <p><strong>isLive:</strong> {String(data.isLive)}</p>

          {data.isLive && data.playbackUrl && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Live Preview</h3>
              <LivePlayer playbackUrl={data.playbackUrl} />
            </div>
          )}
        </div>
      ) : (
        <p>No livestream configured for this monastery ID.</p>
      )}

      {message && <p className="text-red-500">{message}</p>}
    </div>
  );
}
