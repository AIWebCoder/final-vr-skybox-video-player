// @ts-nocheck
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { videos } from "@/data/videos";

export default function VideoPage({ params }: { params: { id: string } }) {
  const video = videos.find((v) => v.id === params.id);
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      if (typeof window === "undefined") return;
      if (!window.AFRAME) {
        await import("aframe");
      }
      if (!cancelled) setReady(true);
    }
    init();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready || !video) return;
    const el = document.getElementById(`video-${video.id}`) as HTMLVideoElement | null;
    if (!el) return;
    videoRef.current = el;

    const onLoaded = () => setDuration(el.duration || 0);
    const onTime = () => setCurrentTime(el.currentTime);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);

    el.play().catch(() => {});

    return () => {
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, [ready, video]);

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  };

  const handleSeek = (value: number) => {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = value;
    setCurrentTime(value);
  };

  const handleVolume = (value: number) => {
    const el = videoRef.current;
    if (!el) return;
    el.volume = value;
    setVolume(value);
  };

  const formatTime = (t: number) => {
    if (!isFinite(t)) return "0:00";
    const m = Math.floor(t / 60)
      .toString()
      .padStart(1, "0");
    const s = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!video) {
    return (
      <div style={{ padding: "24px", color: "#fff", background: "#0f1114", minHeight: "100vh" }}>
        <h1>Vidéo introuvable</h1>
        <Link href="/" style={{ color: "#FEE49F" }}>
          Retour à l’accueil
        </Link>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100vh", background: "#0d0f12", color: "#fff" }}>
      <div style={{ position: "absolute", top: 16, left: 16, zIndex: 2 }}>
        <Link href="/" style={{ color: "#FEE49F", fontWeight: 600 }}>
          ← Retour
        </Link>
      </div>
      <div style={{ position: "absolute", top: 16, right: 16, zIndex: 2 }}>
        <button
          onClick={() => {
            const sceneEl = document.querySelector("a-scene") as any;
            if (sceneEl && sceneEl.exitVR) sceneEl.exitVR();
          }}
          style={{
            background: "#FEE49F",
            color: "#111",
            border: "none",
            borderRadius: 6,
            padding: "6px 12px",
            cursor: "pointer",
            fontWeight: 700
          }}
        >
          Quit VR
        </button>
      </div>

      {ready ? (
        <a-scene renderer="antialias: true" vr-mode-ui="enabled: true">
          <a-assets>
            <video
              id={`video-${video.id}`}
              src={video.videoUrl}
              crossOrigin="anonymous"
              preload="auto"
              loop
              playsInline
              webkit-playsinline="true"
            ></video>
          </a-assets>

          <a-entity camera look-controls position="0 1.6 0"></a-entity>

          <a-videosphere
            src={`#video-${video.id}`}
            rotation="0 -90 0"
            segments-height="64"
            segments-width="128"
            material="shader: flat; side: back"
          ></a-videosphere>
        </a-scene>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          Chargement de la scène...
        </div>
      )}

      {/* Barre de contrôle native simplifiée, sans deuxième vidéo */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          zIndex: 2
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(0,0,0,0.5)",
            padding: "10px 14px",
            borderRadius: 10,
            backdropFilter: "blur(6px)",
            width: "80%",
            maxWidth: 900
          }}
        >
          <button
            onClick={togglePlay}
            style={{
              background: "#FEE49F",
              color: "#111",
              border: "none",
              borderRadius: 6,
              padding: "6px 12px",
              cursor: "pointer",
              fontWeight: 700
            }}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>

          <span style={{ minWidth: 40, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
            {formatTime(currentTime)}
          </span>

          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(currentTime, duration || 0)}
            onChange={(e) => handleSeek(Number(e.target.value))}
            style={{ flex: 1 }}
          />

          <span style={{ minWidth: 40, textAlign: "left", fontVariantNumeric: "tabular-nums" }}>
            {formatTime(duration)}
          </span>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => handleVolume(Number(e.target.value))}
            style={{ width: 100 }}
          />
        </div>
      </div>

    </div>
  );
}

