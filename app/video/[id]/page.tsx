// @ts-nocheck
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { videos } from "@/data/videos";
import { registerRounded } from "@/lib/register-rounded";

export default function VideoPage({ params }: { params: { id: string } }) {
  const video = videos.find((v) => v.id === params.id);
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const seekBarRef = useRef<any>(null);
  const volumeBarRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const seekWidth = 0.9;
  const volumeWidth = 0.4;

  useEffect(() => {
    let cancelled = false;
    async function init() {
      if (typeof window === "undefined") return;
      if (!window.AFRAME) {
        await import("aframe");
      }
      registerRounded();
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
    // Lie la balise vidéo A-Frame pour piloter lecture/seek/volume.
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

  const goBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  const getRatioFromPlaneClick = (event: any, ref: any, width: number) => {
    // Convertit une intersection de raycaster en ratio (0-1) sur une barre 2D.
    const intersection = event?.detail?.intersection;
    const mesh = ref.current?.object3D;
    if (!intersection || !mesh) return null;
    const localPoint = mesh.worldToLocal(intersection.point.clone());
    const ratio = localPoint.x / width + 0.5;
    return Math.min(1, Math.max(0, ratio));
  };

  const handleSeekBarClick = (event: any) => {
    if (!duration) return;
    const ratio = getRatioFromPlaneClick(event, seekBarRef, seekWidth);
    if (ratio === null) return;
    handleSeek(duration * ratio);
  };

  const handleVolumeBarClick = (event: any) => {
    const ratio = getRatioFromPlaneClick(event, volumeBarRef, volumeWidth);
    if (ratio === null) return;
    handleVolume(ratio);
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

  const progressRatio = duration ? Math.min(currentTime / duration, 1) : 0;
  const progressWidth = seekWidth * progressRatio;
  const volumeRatio = Math.min(Math.max(volume, 0), 1);
  const volumeFillWidth = volumeWidth * volumeRatio;

  return (
    <div style={{ width: "100%", height: "100vh", background: "#0d0f12", color: "#fff" }}>

      {ready ? (
        <a-scene renderer="antialias: true" vr-mode-ui="enabled: true">
          <a-assets>
            <img id="icon-play" src="/icons/play.png" />
            <img id="icon-pause" src="/icons/pause.png" />
            <img id="icon-sound" src="/icons/sound.png" />
            <img id="icon-back" src="/icons/back-arrow.png" />
            <img id="icon-settings" src="/icons/setting.png" />
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

          <a-entity camera look-controls position="0 1.6 0">
            <a-entity
              id="mouse-cursor"
              cursor="rayOrigin: mouse; fuse: false"
              raycaster="objects: .ui-clickable; far: 30"
            ></a-entity>

            {/* Panneau d’UI 2D fixé à la caméra (play, temps, seek, volume). */}
            <a-entity id="ui-panel" position="0 -0.25 -0.8" rotation="0 0 0">
              <a-rounded
                width="1.2"
                height="0.32"
                radius="0.04"
                color="#0f1117"
                opacity="0.75"
                material="shader: flat; transparent: true"
                position="0 0 0"
              ></a-rounded>

              <a-entity class="ui-clickable" onClick={goBack} position="-0.35 0.08 0.01">
                <a-image
                  class="ui-clickable"
                  src="#icon-back"
                  width="0.055"
                  height="0.055"
                  position="-0.15 0 0.01"
                  material="shader: flat; transparent: true"
                ></a-image>
              </a-entity>

              <a-entity class="ui-clickable" onClick={togglePlay} position="0 0.08 0.01">
                {isPlaying ? (
                  <a-image
                    class="ui-clickable"
                    src="#icon-pause"
                    width="0.075"
                    height="0.075"
                    position="0 0 0.01"
                    material="shader: flat; transparent: true"
                  ></a-image>
                ) : (
                  <a-image
                    class="ui-clickable"
                    src="#icon-play"
                    width="0.075"
                    height="0.075"
                    position="0 0 0.01"
                    material="shader: flat; transparent: true"
                  ></a-image>
                )}
              </a-entity>

              <a-entity class="ui-clickable" position="0.35 0.08 0.01">
                <a-image
                  class="ui-clickable"
                  src="#icon-settings"
                  width="0.055"
                  height="0.055"
                  position="0.15 0 0.01"
                  material="shader: flat; transparent: true"
                ></a-image>
              </a-entity>

              <a-entity position="-0.07 -0.01 0.01">
                <a-rounded
                  ref={seekBarRef}
                  class="ui-clickable"
                  width={seekWidth}
                  height="0.025"
                  radius="0.01"
                  color="#ffffff"
                  opacity="0.25"
                  material="shader: flat; side: double; transparent: true"
                  onClick={handleSeekBarClick}
                ></a-rounded>
                {progressWidth > 0.0001 && (
                  <a-rounded
                    width={progressWidth}
                    height="0.025"
                    radius="0.01"
                    color="#ffffff"
                    material="shader: flat; side: double"
                    position={`${-seekWidth / 2 + progressWidth / 2} 0 0.001`}
                  ></a-rounded>
                )}
                <a-text
                  value={`${formatTime(currentTime)} / ${formatTime(duration)}`}
                  color="#cfd3dc"
                  position={`${seekWidth / 2 + 0.03} 0.004 0.01`}
                  align="left"
                  width="1.2"
                  font="https://cdn.aframe.io/fonts/Roboto-msdf.json"
                  scale="0.4 0.35 0.35"
                ></a-text>
              </a-entity>

              <a-entity position="-0.10 -0.08 0.01">
                <a-rounded
                  ref={volumeBarRef}
                  class="ui-clickable"
                  width={volumeWidth}
                  height="0.012"
                  radius="0.01"
                  color="#ffffff"
                  opacity="0.25"
                  material="shader: flat; side: double; transparent: true"
                  position="-0.12 0 0"
                  onClick={handleVolumeBarClick}
                ></a-rounded>
                {volumeFillWidth > 0.0001 && (
                  <a-rounded
                    width={volumeFillWidth}
                    height="0.012"
                    radius="0.01"
                    color="#ffffff"
                    material="shader: flat; side: double"
                    position={`${-volumeWidth / 2 + volumeFillWidth / 2 - 0.12} 0 0.001`}
                  ></a-rounded>
                )}
                <a-image
                  src="#icon-sound"
                  width="0.045"
                  height="0.045"
                  position="-0.39 0 0.01"
                  material="shader: flat; transparent: true"
                ></a-image>
              </a-entity>
            </a-entity>
          </a-entity>

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

    </div>
  );
}

