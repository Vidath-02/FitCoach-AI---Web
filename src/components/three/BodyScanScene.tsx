"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { BODY_MAX_Y, BODY_MIN_Y, generateBodyPoints } from "./bodyPoints";

const VOLT = new THREE.Color("#c8ff3d");
const CYAN = new THREE.Color("#3de0ff");
const BASE = new THREE.Color("#7f8cff");

const bodyVertex = /* glsl */ `
  uniform float uTime;
  uniform float uScan;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute float aRandom;
  varying float vGlow;
  varying float vRandom;
  varying float vHeight;

  void main() {
    vec3 p = position;
    float d = abs(p.y - uScan);
    float glow = smoothstep(0.22, 0.0, d);

    // push points slightly outward where the scan beam passes
    vec2 radial = p.xz;
    float rl = length(radial);
    if (rl > 0.0001) p.xz += (radial / rl) * glow * 0.035;

    // gentle "breathing" shimmer
    p += 0.006 * vec3(
      sin(uTime * 1.7 + aRandom * 40.0),
      cos(uTime * 1.3 + aRandom * 30.0),
      sin(uTime * 1.1 + aRandom * 20.0)
    );

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.55 + aRandom * 0.7 + glow * 1.9) / -mv.z;

    vGlow = glow;
    vRandom = aRandom;
    vHeight = (position.y + 1.72) / 3.44;
  }
`;

const bodyFragment = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uCyan;
  uniform vec3 uVolt;
  varying float vGlow;
  varying float vRandom;
  varying float vHeight;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, r);
    vec3 base = mix(uBase, uCyan, vHeight * 0.8 + vRandom * 0.2);
    vec3 col = mix(base, uVolt, vGlow);
    float alpha = soft * (0.32 + vRandom * 0.25 + vGlow * 0.9);
    gl_FragColor = vec4(col, alpha);
  }
`;

function BodyCloud({ count = 11000 }: { count?: number }) {
  const { positions, randoms } = useMemo(() => generateBodyPoints(count), [count]);
  const dpr = useThree((s) => s.viewport.dpr);
  const material = useRef<THREE.ShaderMaterial>(null);
  const ring = useRef<THREE.Mesh>(null);
  const beam = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScan: { value: 0 },
      uSize: { value: 15 },
      uPixelRatio: { value: 1 },
      uBase: { value: BASE },
      uCyan: { value: CYAN },
      uVolt: { value: VOLT },
    }),
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // ease the scan up and down the body
    const phase = (Math.sin(t * 0.55) + 1) / 2;
    const eased = phase * phase * (3 - 2 * phase);
    const y = BODY_MIN_Y + 0.05 + eased * (BODY_MAX_Y - BODY_MIN_Y - 0.1);
    if (material.current) {
      material.current.uniforms.uTime.value = t;
      material.current.uniforms.uScan.value = y;
      material.current.uniforms.uPixelRatio.value = dpr;
    }
    if (ring.current) ring.current.position.y = y;
    if (beam.current) beam.current.position.y = y;
  });

  return (
    <group>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aRandom" args={[randoms, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={material}
          vertexShader={bodyVertex}
          fragmentShader={bodyFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* scan ring */}
      <mesh ref={ring} rotation-x={Math.PI / 2} scale={[1.55, 0.75, 1]}>
        <torusGeometry args={[0.62, 0.0035, 8, 128]} />
        <meshBasicMaterial color={VOLT} transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* scan plane glow */}
      <mesh ref={beam} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[1.05, 64]} />
        <meshBasicMaterial
          color={VOLT}
          transparent
          opacity={0.05}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function FloorRings() {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.z += dt * 0.15;
  });
  return (
    <group ref={group} position={[0, BODY_MIN_Y - 0.02, 0]} rotation-x={-Math.PI / 2}>
      {[0.55, 0.85, 1.2].map((r, i) => (
        <mesh key={r}>
          <ringGeometry args={[r, r + 0.006, 128, 1, 0, Math.PI * (i === 1 ? 1.5 : 2)]} />
          <meshBasicMaterial
            color={i === 0 ? VOLT : CYAN}
            transparent
            opacity={0.35 - i * 0.08}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function Dust({ count = 700 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.2 + Math.random() * 2.6;
      const a = Math.random() * Math.PI * 2;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 5;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, [count]);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y -= dt * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.012}
        color={CYAN}
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ pointer }, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.22;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.y * 0.08, 0.05);
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, pointer.x * 0.08, 0.05);
  });
  return <group ref={group}>{children}</group>;
}

export default function BodyScanScene({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.05, 6.4], fov: 36 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Rig>
        <BodyCloud />
        <FloorRings />
      </Rig>
      <Dust />
    </Canvas>
  );
}
