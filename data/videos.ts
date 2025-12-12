import { ChannelItem, FavoriteItem, HistoryItem, VideoItem } from "@/types/video";

export const channels: ChannelItem[] = [
  { id: "home", label: "Home", icon: "/icons/home.png" },
  { id: "vr-video", label: "VR Video", icon: "/icons/vr.png" },
  { id: "local-network", label: "Local Network", icon: "/icons/network.png" },
  { id: "airscreen", label: "AirScreen", icon: "/icons/air.png" },
  { id: "hidden-files", label: "Hidden Files", icon: "/icons/hidden.png" }
];

export const videos: VideoItem[] = [
  {
    id: "1",
    title: "Nature Documentary",
    thumbnail: "/thumbnails/video1.jpg",
    duration: "45:32",
    positionX: -1.2,
    positionY: 1.5,
    positionZ: -2,
    rotationY: 10,
    width: 0.9,
    height: 0.6
  },
  {
    id: "2",
    title: "Space Exploration",
    thumbnail: "/thumbnails/video2.jpg",
    duration: "32:15",
    positionX: 0,
    positionY: 1.5,
    positionZ: -2,
    rotationY: 0,
    width: 0.9,
    height: 0.6
  },
  {
    id: "3",
    title: "Ocean Depths",
    thumbnail: "/thumbnails/video3.jpg",
    duration: "28:47",
    positionX: 1.2,
    positionY: 1.5,
    positionZ: -2,
    rotationY: -10,
    width: 0.9,
    height: 0.6
  },
  {
    id: "4",
    title: "Mountain Adventure",
    thumbnail: "/thumbnails/video4.jpg",
    duration: "51:20",
    width: 0.9,
    height: 0.6
  },
  {
    id: "5",
    title: "City Life",
    thumbnail: "/thumbnails/video5.jpg",
    duration: "38:12",
    width: 0.9,
    height: 0.6
  },
  {
    id: "6",
    title: "Desert Journey",
    thumbnail: "/thumbnails/video6.jpg",
    duration: "42:05",
    width: 0.9,
    height: 0.6
  }
];

export const favorites: FavoriteItem[] = [
  {
    id: "1",
    title: "Nature Documentary",
    thumbnail: "/thumbnails/video1.jpg",
    duration: "45:32",
    addedAt: "2024-01-15"
  },
  {
    id: "3",
    title: "Ocean Depths",
    thumbnail: "/thumbnails/video3.jpg",
    duration: "28:47",
    addedAt: "2024-01-20"
  },
  {
    id: "5",
    title: "City Life",
    thumbnail: "/thumbnails/video5.jpg",
    duration: "38:12",
    addedAt: "2024-01-22"
  }
];

export const history: HistoryItem[] = [
  {
    id: "2",
    title: "Space Exploration",
    thumbnail: "/thumbnails/video2.jpg",
    duration: "32:15",
    watchedAt: "2024-01-25"
  },
  {
    id: "4",
    title: "Mountain Adventure",
    thumbnail: "/thumbnails/video4.jpg",
    duration: "51:20",
    watchedAt: "2024-01-24"
  },
  {
    id: "6",
    title: "Desert Journey",
    thumbnail: "/thumbnails/video6.jpg",
    duration: "42:05",
    watchedAt: "2024-01-23"
  }
];

