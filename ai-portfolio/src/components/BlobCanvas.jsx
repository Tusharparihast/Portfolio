import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function MorphingBlob() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // --- Scene ---
    const scene = new THREE.Scene();

    // --- Camera ---
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 3.2;

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // --- Geometry ---
    const geometry = new THREE.IcosahedronGeometry(1.1, 6);

    // Store original positions for morphing
    const positionAttr = geometry.attributes.position;
    const originalPositions = new Float32Array(positionAttr.array.length);
    originalPositions.set(positionAttr.array);

    // --- Shader Material (iridescent lavender-blue) ---
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uCameraPos: { value: camera.position }, // PATCH: Expose camera coordinates as an explicit uniform
        uColorA: { value: new THREE.Color("#c7d2fe") }, // indigo-200
        uColorB: { value: new THREE.Color("#a5b4fc") }, // indigo-300
        uColorC: { value: new THREE.Color("#e0e7ff") }, // indigo-100
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        varying vec3 vNormal;
        varying vec3 vPosition;

        // Simplex-style noise functions
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g  = step(x0.yzx, x0.xyz);
          vec3 l  = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j  = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x  = x_ *ns.x + ns.yyyy;
          vec4 y  = y_ *ns.x + ns.yyyy;
          vec4 h  = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelMatrix * vec4(position, 1.0)).xyz;

          // Mouse influence
          float mouseInfluence = dot(normalize(position), vec3(uMouse, 0.5)) * 0.12;

          // Layered noise for organic morphing
          float noise1 = snoise(position * 1.2 + uTime * 0.28);
          float noise2 = snoise(position * 2.4 - uTime * 0.18) * 0.5;
          float noise3 = snoise(position * 4.0 + uTime * 0.12) * 0.2;

          float displacement = (noise1 + noise2 + noise3) * 0.18 + mouseInfluence;

          vec3 newPos = position + normal * displacement;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uColorC;
        uniform float uTime;
        uniform vec3 uCameraPos; // PATCH: Declare uniform configuration alignment
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          // Fresnel calculation mapping the custom camera uniform reference
          vec3 viewDir = normalize(uCameraPos - vPosition);
          float fresnel = pow(1.0 - max(dot(viewDir, normalize(vNormal)), 0.0), 2.8);

          // Animated color shifts
          float t = sin(uTime * 0.4 + vPosition.y * 1.5) * 0.5 + 0.5;
          vec3 color = mix(uColorA, uColorB, t);
          color = mix(color, uColorC, fresnel * 0.6);

          // Soft rim highlight
          color += vec3(fresnel * 0.18);

          gl_FragColor = vec4(color, 0.82 - fresnel * 0.1);
        }
      `,
      transparent: true,
      side: THREE.FrontSide,
    });

    const blob = new THREE.Mesh(geometry, material);
    scene.add(blob);

    // --- Mouse tracking ---
    const mouse = new THREE.Vector2(0, 0);
    const targetMouse = new THREE.Vector2(0, 0);

    const handleMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      targetMouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetMouse.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // --- Resize ---
    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // --- Animation loop ---
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse lerp
      mouse.x += (targetMouse.x - mouse.x) * 0.04;
      mouse.y += (targetMouse.y - mouse.y) * 0.04;

      // Slow ambient rotation
      blob.rotation.y = elapsed * 0.12;
      blob.rotation.x = Math.sin(elapsed * 0.08) * 0.15;

      // Update uniforms
      material.uniforms.uTime.value = elapsed;
      material.uniforms.uMouse.value.set(mouse.x, mouse.y);
      material.uniforms.uCameraPos.value.copy(camera.position); // Always match target position vectors

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      style={{ minHeight: "100%", minWidth: "100%" }}
    />
  );
}