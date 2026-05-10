"use client";
import Hls from "hls.js";
import { useEffect, useRef } from "react";

type Props = {
  playbackUrl: string;
};

export default function LivePlayer({ playbackUrl }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!playbackUrl) return;

    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;
    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(playbackUrl);
      hls.attachMedia(video);
    } else {
      video.src = playbackUrl;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [playbackUrl]);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      className="w-full rounded-lg bg-black"
    />
  );
}
