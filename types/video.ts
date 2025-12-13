export interface VideoItem {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
  
    // --- VR ONLY ---
    positionX?: number;
    positionY?: number;
    positionZ?: number;
  
    rotationY?: number;
  
    width?: number;
    height?: number;
  
    // Optionnel si tu veux lancer une vidéo plus tard
    videoUrl?: string;
  }
  

export interface ChannelItem {
  id: string;
  label: string;
  icon: string;
  iconActive?: string;
}

export interface FavoriteItem {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  addedAt: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  watchedAt: string;
}

