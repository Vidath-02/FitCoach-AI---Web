/**
 * Procedurally samples points over a stylised human figure (A-pose, the classic
 * body-scan stance). Built from tapered elliptical "capsules" so there's no model
 * file to load. Swap this for a GLTF scan later via `useGLTF` + `MeshSurfaceSampler`.
 */

type Vec3 = [number, number, number];

interface Segment {
  a: Vec3;
  b: Vec3;
  /** radius at a / b along local x (width) */
  rx: [number, number];
  /** radius at a / b along local z (depth) */
  rz: [number, number];
}

interface Blob {
  c: Vec3;
  r: Vec3;
}

const mirror = (s: Segment): Segment => ({
  ...s,
  a: [-s.a[0], s.a[1], s.a[2]],
  b: [-s.b[0], s.b[1], s.b[2]],
});

const limbs: Segment[] = [
  // upper arm, forearm
  { a: [0.44, 1.06, 0], b: [0.6, 0.5, 0.02], rx: [0.085, 0.065], rz: [0.085, 0.065] },
  { a: [0.6, 0.5, 0.02], b: [0.72, 0.0, 0.06], rx: [0.062, 0.045], rz: [0.058, 0.04] },
  // thigh, shin
  { a: [0.16, -0.02, 0], b: [0.19, -0.86, 0.01], rx: [0.135, 0.085], rz: [0.14, 0.09] },
  { a: [0.19, -0.86, 0.01], b: [0.21, -1.6, -0.01], rx: [0.08, 0.05], rz: [0.085, 0.055] },
  // foot
  { a: [0.21, -1.66, -0.03], b: [0.23, -1.68, 0.17], rx: [0.05, 0.045], rz: [0.04, 0.035] },
];

const segments: Segment[] = [
  // neck
  { a: [0, 1.14, 0], b: [0, 1.28, 0.01], rx: [0.07, 0.065], rz: [0.07, 0.065] },
  // chest → shoulders (wider at top)
  { a: [0, 0.6, 0], b: [0, 1.12, 0], rx: [0.29, 0.39], rz: [0.18, 0.2] },
  // waist → ribcage
  { a: [0, 0.12, 0], b: [0, 0.6, 0], rx: [0.3, 0.29], rz: [0.17, 0.18] },
  // pelvis
  { a: [0, -0.1, 0], b: [0, 0.12, 0], rx: [0.3, 0.3], rz: [0.18, 0.17] },
  ...limbs,
  ...limbs.map(mirror),
];

const blobs: Blob[] = [
  { c: [0, 1.48, 0.01], r: [0.165, 0.21, 0.185] }, // head
  { c: [0.42, 1.07, 0], r: [0.11, 0.1, 0.11] }, // shoulders
  { c: [-0.42, 1.07, 0], r: [0.11, 0.1, 0.11] },
  { c: [0.74, -0.09, 0.07], r: [0.045, 0.075, 0.035] }, // hands
  { c: [-0.74, -0.09, 0.07], r: [0.045, 0.075, 0.035] },
];

// Deterministic PRNG so the figure is identical on every render.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function segArea(s: Segment) {
  const len = Math.hypot(s.b[0] - s.a[0], s.b[1] - s.a[1], s.b[2] - s.a[2]);
  const r = (s.rx[0] + s.rx[1] + s.rz[0] + s.rz[1]) / 4;
  return len * r;
}

function blobArea(b: Blob) {
  return ((b.r[0] + b.r[1] + b.r[2]) / 3) ** 2 * 2.2;
}

export function generateBodyPoints(count: number) {
  const rand = mulberry32(7);
  const positions = new Float32Array(count * 3);
  const randoms = new Float32Array(count);

  const shapes = [
    ...segments.map((s) => ({ kind: "seg" as const, s, w: segArea(s) })),
    ...blobs.map((b) => ({ kind: "blob" as const, b, w: blobArea(b) })),
  ];
  const total = shapes.reduce((acc, s) => acc + s.w, 0);

  let i = 0;
  for (const shape of shapes) {
    const n = shape === shapes[shapes.length - 1] ? count - i : Math.round((shape.w / total) * count);
    for (let k = 0; k < n && i < count; k++, i++) {
      let x: number, y: number, z: number;
      if (shape.kind === "seg") {
        const { a, b, rx, rz } = shape.s;
        const t = rand();
        const theta = rand() * Math.PI * 2;
        // axis + an orthonormal basis around it
        const ax = b[0] - a[0];
        const ay = b[1] - a[1];
        const az = b[2] - a[2];
        const len = Math.hypot(ax, ay, az) || 1;
        const dx = ax / len;
        const dy = ay / len;
        const dz = az / len;
        // u = normalize(cross(d, Z)) approx → use world X projected for stability
        let ux = 1 - dx * dx;
        let uy = -dx * dy;
        let uz = -dx * dz;
        const ul = Math.hypot(ux, uy, uz) || 1;
        ux /= ul;
        uy /= ul;
        uz /= ul;
        const vx = dy * uz - dz * uy;
        const vy = dz * ux - dx * uz;
        const vz = dx * uy - dy * ux;
        const rX = rx[0] + (rx[1] - rx[0]) * t;
        const rZ = rz[0] + (rz[1] - rz[0]) * t;
        const cx = a[0] + ax * t;
        const cy = a[1] + ay * t;
        const cz = a[2] + az * t;
        const c = Math.cos(theta) * rX;
        const s = Math.sin(theta) * rZ;
        x = cx + ux * c + vx * s;
        y = cy + uy * c + vy * s;
        z = cz + uz * c + vz * s;
      } else {
        const { c, r } = shape.b;
        const u = rand() * 2 - 1;
        const phi = rand() * Math.PI * 2;
        const sq = Math.sqrt(1 - u * u);
        x = c[0] + r[0] * sq * Math.cos(phi);
        y = c[1] + r[1] * u;
        z = c[2] + r[2] * sq * Math.sin(phi);
      }
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      randoms[i] = rand();
    }
  }

  return { positions, randoms };
}

export const BODY_MIN_Y = -1.72;
export const BODY_MAX_Y = 1.72;
