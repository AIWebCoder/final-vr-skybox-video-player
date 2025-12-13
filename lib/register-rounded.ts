// @ts-nocheck
// A-Frame ne supporte pas TS strict, on désactive juste pour ce fichier

export function registerRounded() {
  if (typeof window === "undefined") return;
  if (!window.AFRAME) return;

  const AFRAME = window.AFRAME;
  const THREE = window.THREE;

  // Évite de re-déclarer le composant/primitive en mode Strict ou après un preload
  if (AFRAME.components?.rounded) return;

  // Component responsible for generating rounded geometry
  AFRAME.registerComponent("rounded", {
    schema: {
      radius: { type: "number", default: 0.1 }
    },

    init() {
      const el = this.el;
      const data = this.data;

      const { width, height } = el.getAttribute("geometry");
      const r = data.radius;

      const shape = new THREE.Shape();

      shape.moveTo(-width / 2 + r, -height / 2);
      shape.lineTo(width / 2 - r, -height / 2);
      shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + r);
      shape.lineTo(width / 2, height / 2 - r);
      shape.quadraticCurveTo(width / 2, height / 2, width / 2 - r, height / 2);
      shape.lineTo(-width / 2 + r, height / 2);
      shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - r);
      shape.lineTo(-width / 2, -height / 2 + r);
      shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + r, -height / 2);

      const geometry = new THREE.ShapeGeometry(shape);
      geometry.computeBoundingBox();

      const min = geometry.boundingBox?.min ?? new THREE.Vector3(0, 0, 0);
      const max = geometry.boundingBox?.max ?? new THREE.Vector3(1, 1, 0);
      const range = new THREE.Vector2(
        Math.max(max.x - min.x, 0.0001),
        Math.max(max.y - min.y, 0.0001)
      );

      const posAttr = geometry.attributes.position;
      const uvs: number[] = [];
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const y = posAttr.getY(i);
        uvs.push((x - min.x) / range.x, (y - min.y) / range.y);
      }
      geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
      geometry.attributes.uv.needsUpdate = true;
      geometry.computeVertexNormals();

      const mesh = el.getObject3D("mesh");
      if (mesh) mesh.geometry = geometry;
    }
  });

  // Primitive <a-rounded>
  AFRAME.registerPrimitive("a-rounded", {
    defaultComponents: {
      geometry: { primitive: "plane", width: 1, height: 1 },
      material: { color: "#FFF", shader: "flat", transparent: true },
      rounded: {}
    },
    mappings: {
      width: "geometry.width",
      height: "geometry.height",
      radius: "rounded.radius",
      color: "material.color",
      opacity: "material.opacity",
      src: "material.src"
    }
  });
}
