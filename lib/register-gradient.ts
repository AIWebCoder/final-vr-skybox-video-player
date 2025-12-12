// @ts-nocheck
// Disable TS because A-Frame types are incomplete

export function registerGradient() {
  if (typeof window === "undefined") return;
  if (!window.AFRAME || !window.THREE) return;

  const AFRAME = window.AFRAME;
  const THREE = window.THREE;

  // Avoid re-registering
  if (AFRAME.components?.gradient) return;

  // ---- 1. Register Shader ----
  AFRAME.registerShader("gradient-shader", {
    schema: {
      topColor:  { type: "color", default: "#ffffff" },
      bottomColor: { type: "color", default: "#000000" }
    },

    init(data) {
      this.material = new THREE.ShaderMaterial({
        uniforms: {
          topColor:    { value: new THREE.Color(data.topColor) },
          bottomColor: { value: new THREE.Color(data.bottomColor) }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform vec3 topColor;
          uniform vec3 bottomColor;

          void main() {
            vec3 color = mix(bottomColor, topColor, vUv.y);
            gl_FragColor = vec4(color, 1.0);
          }
        `,
        transparent: false
      });
    },

    update(data) {
      this.material.uniforms.topColor.value.set(data.topColor);
      this.material.uniforms.bottomColor.value.set(data.bottomColor);
    }
  });

  // ---- 2. Gradient Component ----
  AFRAME.registerComponent("gradient", {
    schema: {
      topColor:    { type: "color", default: "#ffffff" },
      bottomColor: { type: "color", default: "#000000" }
    },

    update() {
      this.el.setAttribute("material", {
        shader: "gradient-shader",
        topColor: this.data.topColor,
        bottomColor: this.data.bottomColor
      });
    }
  });

  // ---- 3. <a-gradient> Primitive ----
  AFRAME.registerPrimitive("a-gradient", {
    defaultComponents: {
      geometry: { primitive: "plane", width: 1, height: 1 },
      material: { shader: "gradient-shader" },
      gradient: {}
    },
    mappings: {
      width: "geometry.width",
      height: "geometry.height",
      topcolor: "gradient.topColor",
      bottomcolor: "gradient.bottomColor",
      opacity: "material.opacity"
    }
  });
}
