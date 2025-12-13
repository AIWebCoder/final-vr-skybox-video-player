"use client";

import { useEffect, useState } from "react";
import { channels, favorites, history, videos } from "@/data/videos";
import { registerRounded } from "@/lib/register-rounded";

declare global {
  interface Window {
    AFRAME?: any;
  }
}

function registerClickAction() {
  const AFRAME = window.AFRAME;
  if (!AFRAME || AFRAME.components["click-action"]) return;

  AFRAME.registerComponent("click-action", {
    schema: {
      defaultColor: { type: "color", default: "#ffffff" },
      hoverColor: { type: "color", default: "#ffffff" }
    },

    init: function () {
      const material = this.el.getAttribute("material") || {};
      this.baseColor = material.color || this.data.defaultColor;

      this.onEnter = this.handleEnter.bind(this);
      this.onLeave = this.handleLeave.bind(this);
      this.onClick = this.handleClick.bind(this);

      this.el.setAttribute("material", { color: this.baseColor });
      this.el.addEventListener("mouseenter", this.onEnter);
      this.el.addEventListener("mouseleave", this.onLeave);
      this.el.addEventListener("click", this.onClick);
    },

    remove: function () {
      this.el.removeEventListener("mouseenter", this.onEnter);
      this.el.removeEventListener("mouseleave", this.onLeave);
      this.el.removeEventListener("click", this.onClick);
    },

    handleEnter: function () {
      // Keep original color to avoid tinting textures.
      this.el.setAttribute("material", "color", this.baseColor);
    },

    handleLeave: function () {
      this.el.setAttribute("material", "color", this.baseColor);
    },

    handleClick: function () {
      console.log("Clickable element activated");
      triggerClickAction(this.el);
    }
  });

  function triggerClickAction(entity: any) {
    console.log("Action exécutée pour", entity);
  }
}

export function AframeScene() {
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState<"favorites" | "history">("favorites");
  const [selectedChannel, setSelectedChannel] = useState<string>( channels[0]?.id ?? "" );
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const pauseVideo = (videoId: string | null) => {
    if (!videoId) return;
    const videoEl = document.getElementById(`video-${videoId}`) as HTMLVideoElement | null;
    if (!videoEl) return;
    videoEl.pause();
    videoEl.currentTime = 0;
  };

  const playVideo = (videoId: string) => {
    const videoEl = document.getElementById(`video-${videoId}`) as HTMLVideoElement | null;
    if (!videoEl) return;
    videoEl.currentTime = 0;
    videoEl.play().catch(() => {});
  };

  const handlePlayVideo = (videoId: string) => {
    if (activeVideoId && activeVideoId !== videoId) pauseVideo(activeVideoId);
    setActiveVideoId(videoId);
    requestAnimationFrame(() => playVideo(videoId));
  };

  const handleCloseVideo = () => {
    pauseVideo(activeVideoId);
    setActiveVideoId(null);
  };

  useEffect(() => {
    let cancelled = false;
    async function initAframe() {
      if (typeof window === "undefined") return;
      if (!window.AFRAME) {
        await import("aframe");
      }
      registerRounded();
      registerClickAction();
      if (!cancelled) setReady(true);
    }
    initAframe();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div className="scene-frame">
        {ready ? (
          <a-scene id="scene-root" renderer="antialias: true" vr-mode-ui="enabled: true">
            <a-assets>
              {videos.map((video) => (
                <img key={video.id} id={`thumb-${video.id}`} src={video.thumbnail} />
              ))}
              {videos.map((video) => (
                <video
                  key={`video-${video.id}`}
                  id={`video-${video.id}`}
                  src={video.videoUrl}
                  crossOrigin="anonymous"
                  preload="auto"
                  playsInline
                  webkit-playsinline="true"
                ></video>
              ))}
              <img id="channel-arrow-right" src="/icons/right-arrow.png" />
              {channels.flatMap((channel) => {
                const assets = [
                  <img key={`channel-icon-${channel.id}-inactive`} id={`channel-icon-${channel.id}-inactive`} src={channel.icon} />
                ];
                if (channel.iconActive) {
                  assets.push(
                    <img key={`channel-icon-${channel.id}-active`} id={`channel-icon-${channel.id}-active`} src={channel.iconActive} />
                  );
                }
                return assets;
              })}
            </a-assets>

            <a-entity id="light-ambient" light="type: ambient; color: #dfe4eb"></a-entity>
            <a-entity id="light-directional" light="type: directional; color: #ffffff; intensity: 0.6" position="0 4 3" ></a-entity>

            <a-sky id="sky" color="#222426"></a-sky>
            <a-plane id="ground" rotation="-90 0 0" width="50" height="50" color="#1a1a1b" material="shader: flat" ></a-plane>

            <a-entity id="rig" position="0 1.6 0">
              <a-entity id="head" camera look-controls wasd-controls="acceleration: 25" >
                <a-entity id="gaze-cursor" cursor="fuse: false" raycaster="objects: .clickable; far: 20" position="0 0 -0.5"
                  geometry="primitive: ring; radiusInner: 0.007; radiusOuter: 0.012"
                  material="color: #ffffff; shader: flat; transparent: true; opacity: 0"
                  visible="false"
                ></a-entity>
                <a-entity id="mouse-cursor" cursor="rayOrigin: mouse; fuse: false" raycaster="objects: .clickable; far: 20" visible="false" ></a-entity>
              </a-entity>
            </a-entity>
            <a-entity laser-controls="hand: right" raycaster="objects: .clickable; far: 20" line="color: #cfd8e6; opacity: 0.7" ></a-entity>

            {/* Left Panel - Channels */}
            <a-entity id="left-panel" position="-3 1.5 -3" rotation="0 10 0" animation__float="property: position; to: -3 1.6 -3; dur: 3000; easing: easeInOutSine; loop: true; dir: alternate" >

              <a-rounded id="left-panel-bg" width="1.5" height="2.5" color="#2a2c2f" material="shader: flat;" radius="0.15"/>

              {channels.map((channel, index) => (
                <a-entity
                  key={channel.id}
                  id={`channel-${channel.id}`}
                  position={`0 ${0.8 - index * 0.4} 0.01`}
                  class="clickable"
                  onClick={() => {
                    setSelectedChannel(channel.id);
                  }}
                >
                  <a-image
                    src={`#channel-icon-${channel.id}-${selectedChannel === channel.id && channel.iconActive ? "active" : "inactive"}`}
                    width="0.24"
                    height="0.24"
                    position="-0.5 0 0.01"
                    material="shader: flat; transparent: true"
                  ></a-image>
                  <a-text
                    value={channel.label}
                    color={selectedChannel === channel.id ? "#FEE49F" : "#ffffff"}
                    align="left"
                    position="-0.25 0 0.01"
                    width="3"
                    font="https://cdn.aframe.io/fonts/Roboto-msdf.json"
                    scale="0.8 0.8 0.8"
                  ></a-text>
                  <a-image
                    src="#channel-arrow-right"
                    width="0.12"
                    height="0.12"
                    position="0.55 0 0.01"
                    material={`shader: flat; transparent: true; color: ${selectedChannel === channel.id ? "#FEE49F" : "#ffffff"}`}
                  ></a-image>
                  <a-animation attribute="scale" to="1.05 1.05 1.05" dur="200" begin="mouseenter" fill="forwards" />
                  <a-animation attribute="scale" to="1 1 1" dur="200" begin="mouseleave" fill="forwards" />
                  <a-animation attribute="position" to="0 0.8 0.01" dur="200" begin="mouseenter" fill="forwards" />
                  <a-animation attribute="position" to={`0 ${0.8 - index * 0.4} 0.01`} dur="200" begin="mouseleave" fill="forwards" />
                </a-entity>
              ))}
            </a-entity>

            {/* Center Panel - Videos */}
            <a-entity
              id="center-panel"
              position="0 1.5 -3"
              animation__float="property: position; to: 0 1.6 -3; dur: 3000; easing: easeInOutSine; loop: true; dir: alternate"
            >
              <a-rounded
                id="center-panel-bg"
                width="3.5"
                height="2.5"
                radius="0.15"
                color="#2a2c2f"
                material="shader: flat; roughness: 0.3; metalness: 0.05; transparent: true"
              ></a-rounded>
              {videos.slice(0, 6).map((video, index) => {
                const row = Math.floor(index / 3);
                const col = index % 3;
                const x = -1 + col * 1;
                const y = 0.7 - row * 1.1;
                const itemWidth = 0.8;
                const itemHeight = 0.45;
                return (
                  <a-entity
                    key={video.id}
                    id={`thumb-wrap-${video.id}`}
                    position={`${x} ${y} 0.02`}
                    class="clickable"
                    onClick={() => handlePlayVideo(video.id)}
                  >
                    <a-rounded
                      id={`thumb-img-${video.id}`}
                      class="clickable"
                      width={video.width ?? itemWidth}
                      height={video.height ?? itemHeight}
                      radius="0.04"
                      position="0 0 0"
                      src={`#thumb-${video.id}`}
                      material="shader: flat; transparent: true; side: double"
                      click-action
                      animation__hover="property: scale; to: 1.05 1.05 1; startEvents: mouseenter; dur: 150; easing: easeOutQuad"
                      animation__leave="property: scale; to: 1 1 1; startEvents: mouseleave; dur: 150; easing: easeOutQuad"
                    ></a-rounded>
                    <a-text
                      value={video.title}
                      align="left"
                      color="#f5f5f5"
                      width="3"
                      position="-0.45 -0.4 0.01"
                      font="https://cdn.aframe.io/fonts/Roboto-msdf.json"
                      scale="0.6 0.6 0.6"
                    ></a-text>
                    <a-text
                      value={video.duration}
                      align="left"
                      color="#c8ccd4"
                      width="3"
                      position="-0.45 -0.52 0.01"
                      font="https://cdn.aframe.io/fonts/Roboto-msdf.json"
                      scale="0.5 0.5 0.5"
                    ></a-text>
                  </a-entity>
                );
              })}
            </a-entity>

            {/* Right Panel - Favorites & History */}
            <a-entity id="right-panel" position="3 1.5 -3" rotation="0 -20 0" animation__float="property: position; to: 3 1.6 -3; dur: 3000; easing: easeInOutSine; loop: true; dir: alternate" >
              <a-rounded
                id="right-panel-bg"
                width="1.5"
                height="2.5"
                radius="0.15"
                color="#2a2c2f"
                material="shader: flat"
              ></a-rounded>

              <a-entity position="0 1 0.02">
                <a-text
                  id="tab-favorites"
                  value="Favorites"
                  color={activeTab === "favorites" ? "#FEE49F" : "#888888"}
                  align="center"
                  position="-0.3 0 0.01"
                  width="3"
                  font="https://cdn.aframe.io/fonts/Roboto-msdf.json"
                  scale="0.7 0.7 0.7"
                  class="clickable"
                  onClick={() => setActiveTab("favorites")}
                ></a-text>
                <a-text
                  id="tab-history"
                  value="History"
                  color={activeTab === "history" ? "#FEE49F" : "#888888"}
                  align="center"
                  position="0.3 0 0.01"
                  width="3"
                  font="https://cdn.aframe.io/fonts/Roboto-msdf.json"
                  scale="0.7 0.7 0.7"
                  class="clickable"
                  onClick={() => setActiveTab("history")}
                ></a-text>
              </a-entity>

              {(activeTab === "favorites" ? favorites : history)
                .slice(0, 6)
                .map((item, index) => (
                  <a-entity
                    key={item.id}
                    id={`${activeTab}-${item.id}`}
                    position={`0 ${0.5 - index * 0.35} 0.03`}
                    class="clickable"
                    onClick={() => handlePlayVideo(item.id)}
                  >
                    <a-rounded
                      width="0.25"
                      height="0.15"
                      radius="0.02"
                      position="-0.5 0 0.04"
                      src={`#thumb-${item.id}`}
                      material="shader: flat; transparent: true; side: double"
                    ></a-rounded>
                    <a-text
                      value={item.title}
                      color="#ffffff"
                      align="left"
                      position="-0.26 0.05 0.01"
                      width="4"
                      font="https://cdn.aframe.io/fonts/Roboto-msdf.json"
                      scale="0.5 0.5 0.5"
                    ></a-text>
                    <a-text
                      value={item.duration}
                      color="#888888"
                      align="left"
                      position="-0.26 -0.05 0.01"
                      width="4"
                      font="https://cdn.aframe.io/fonts/Roboto-msdf.json"
                      scale="0.4 0.4 0.4"
                    ></a-text>
                    <a-animation attribute="scale" to="1.05 1.05 1.05" dur="200" begin="mouseenter" fill="forwards" ></a-animation>
                    <a-animation attribute="scale" to="1 1 1" dur="200" begin="mouseleave" fill="forwards" ></a-animation>
                  </a-entity>
                ))}
            </a-entity>

            {activeVideoId && (
              <a-entity id="video-player" position="0 1.6 -2.2">
                <a-rounded
                  width="3.4"
                  height="2"
                  radius="0.08"
                  color="#0f1114"
                  material="shader: flat; opacity: 0.9"
                ></a-rounded>
                <a-video
                  src={`#video-${activeVideoId}`}
                  width="3.2"
                  height="1.8"
                  position="0 0 0.05"
                  autoplay="true"
                  loop="true"
                  playsinline="true"
                ></a-video>
                <a-entity position="1.6 0.9 0.06">
                  <a-rounded
                    class="clickable"
                    width="0.2"
                    height="0.2"
                    radius="0.04"
                    color="#30343a"
                    material="shader: flat; opacity: 0.9; transparent: true"
                    onClick={handleCloseVideo}
                  ></a-rounded>
                  <a-text
                    value="X"
                    align="center"
                    position="0 0 0.01"
                    color="#ffffff"
                    width="1"
                    scale="0.5 0.5 0.5"
                  ></a-text>
                </a-entity>
              </a-entity>
            )}

          </a-scene>
        ) : (
          <div className="loading">Chargement de la scène...</div>
        )}
      </div>
    </>
  );
}

