import { ChannelItem, FavoriteItem, HistoryItem, VideoItem } from "@/types/video";

export const channels: ChannelItem[] = [
  { id: "home", label: "Home", icon: "/icons/home.png", iconActive: "/icons/home-active.png" },
  { id: "vr-video", label: "VR Video", icon: "/icons/vr.png", iconActive: "/icons/vr-active.png" },
  { id: "local-network", label: "Local Network", icon: "/icons/network.png", iconActive: "/icons/network-active.png" },
  { id: "airscreen", label: "AirScreen", icon: "/icons/air.png", iconActive: "/icons/air-active.png" },
  { id: "hidden-files", label: "Hidden Files", icon: "/icons/hidden.png", iconActive: "/icons/hidden-active.png" }
];

export const videos: VideoItem[] = [
  {
    id: "thailand",
    title: "Thailand",
    thumbnail: "/thumbnails/thailand.jpg",
    duration: "00:25",
    videoUrl: "/videos/Thailand.mp4",
    width: 0.9,
    height: 0.6
  },

];

export const favorites: FavoriteItem[] = [
  {
    id: "thailand",
    title: "Thailand",
    thumbnail: "/thumbnails/thailand.jpg",
    duration: "00:25",
    addedAt: "2024-02-01"
  }
];

export const history: HistoryItem[] = [
  {
    id: "thailand",
    title: "thailand",
    thumbnail: "/thumbnails/thailand.jpg",
    duration: "00:25",
    watchedAt: "2024-02-02"
  }
];

