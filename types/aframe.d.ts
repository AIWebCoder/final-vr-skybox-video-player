/// <reference types="react" />

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-assets': any;
      'a-asset-item': any;
      'a-entity': any;
      'a-box': any;
      'a-plane': any;
      'a-sphere': any;
      'a-cylinder': any;
      'a-cone': any;
      'a-torus': any;
      'a-text': any;
      'a-image': any;
      'a-video': any;
      'a-sound': any;
      'a-light': any;
      'a-shader': any;
      'a-camera': any;
      'a-cursor': any;
      'a-animation': any;
      'a-sky': any;
      'a-videosphere': any;
      'a-gltf-model': any;
      'a-obj-model': any;
      'a-collada-model': any;
      'a-rounded': any;
    }
  }
}

declare module "aframe" {
  const AFRAME: any;
  export default AFRAME;
}

export {};
