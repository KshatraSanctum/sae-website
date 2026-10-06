/**
 * 3D Game-Style Botanical Easter Egg for Rahul Kumar Mahto (Technical Head & Developer)
 * Uses Three.js WebGL to sprout real 3D low-poly faceted flowers & leaves
 * between the outer border and inner card border upon hover.
 */

import * as THREE from 'three';

interface FlowerInstance {
  group: THREE.Group;
  edge: 'top' | 'right' | 'bottom' | 'left';
  pct: number; // 0 to 1 along edge
  type: 'blossom' | 'daisy' | 'rosebud' | 'leaf';
  color: number;
  centerColor: number;
  scale: number;
  currentProgress: number; // 0 to 1
  delay: number; // delay in seconds
  bloomedZ: number;
  swaySpeed: number;
  swayPhase: number;
  baseRotX: number;
  baseRotY: number;
  baseRotZ: number;
}

const GAME_PALETTE = {
  rose: 0xff3366,
  sakura: 0xff70a6,
  sun: 0xffbe0b,
  amber: 0xfb8500,
  cyan: 0x00f5d4,
  sky: 0x00b4d8,
  violet: 0x7209b7,
  orchid: 0xd946ef,
  coral: 0xff5722,
  white: 0xf8fafc,
  leafMint: 0x2ec4b6,
  leafGreen: 0x38b000,
  leafDark: 0x1e7b1e,
};

// Reusable low-poly materials with cel/flat-shading for game aesthetic
const materialCache = new Map<number, THREE.MeshStandardMaterial>();

function getMaterial(color: number): THREE.MeshStandardMaterial {
  if (!materialCache.has(color)) {
    materialCache.set(
      color,
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.35,
        metalness: 0.12,
        flatShading: true,
      })
    );
  }
  return materialCache.get(color)!;
}

// 3D Flower Geometries
function buildDaisyMesh(petalColor: number, centerColor: number): THREE.Group {
  const group = new THREE.Group();
  const centerMat = getMaterial(centerColor);
  const petalMat = getMaterial(petalColor);

  // Faceted Center Disc
  const discGeo = new THREE.CylinderGeometry(3.6, 3.6, 2.2, 8);
  discGeo.rotateX(Math.PI / 2);
  const disc = new THREE.Mesh(discGeo, centerMat);
  group.add(disc);

  // 8 Volumetric Radial Petals
  const petalGeo = new THREE.ConeGeometry(2, 7.5, 5);
  petalGeo.translate(0, 3.75, 0);
  petalGeo.scale(1.2, 1, 0.4);

  const petalCount = 8;
  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2;
    const petal = new THREE.Mesh(petalGeo, petalMat);
    petal.rotation.z = angle - Math.PI / 2;
    petal.rotation.x = 0.22; // slight forward tilt
    group.add(petal);
  }

  return group;
}

function buildBlossomMesh(petalColor: number, centerColor: number): THREE.Group {
  const group = new THREE.Group();
  const centerMat = getMaterial(centerColor);
  const petalMat = getMaterial(petalColor);

  // Center Stamen Dome
  const stamenGeo = new THREE.SphereGeometry(2.4, 7, 6);
  const stamen = new THREE.Mesh(stamenGeo, centerMat);
  stamen.position.z = 1.2;
  group.add(stamen);

  // 5 Curved Teardrop Petals
  const petalGeo = new THREE.CylinderGeometry(0.9, 3.2, 6.5, 5);
  petalGeo.translate(0, 3.25, 0);
  petalGeo.scale(1.3, 1, 0.45);

  const petalCount = 5;
  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2;
    const petal = new THREE.Mesh(petalGeo, petalMat);
    petal.rotation.z = angle - Math.PI / 2;
    petal.rotation.x = 0.32; // flared saucer cup
    group.add(petal);
  }

  return group;
}

function buildRosebudMesh(petalColor: number): THREE.Group {
  const group = new THREE.Group();
  const petalMat = getMaterial(petalColor);
  const sepalMat = getMaterial(GAME_PALETTE.leafDark);

  // Little stem base / sepal
  const sepalGeo = new THREE.ConeGeometry(2.8, 4, 5);
  sepalGeo.rotateX(Math.PI);
  const sepal = new THREE.Mesh(sepalGeo, sepalMat);
  group.add(sepal);

  // 4 Tight conical overlapping petals
  const coneGeo = new THREE.ConeGeometry(3.2, 7.5, 5);
  coneGeo.translate(0, 3.5, 1);
  const cone1 = new THREE.Mesh(coneGeo, petalMat);
  cone1.rotation.y = 0.4;
  group.add(cone1);

  const cone2 = new THREE.Mesh(coneGeo, petalMat);
  cone2.rotation.y = -0.4;
  cone2.rotation.z = 0.2;
  cone2.scale.set(0.85, 0.9, 0.85);
  group.add(cone2);

  return group;
}

function buildLeafMesh(leafColor: number): THREE.Group {
  const group = new THREE.Group();
  const mat = getMaterial(leafColor);
  const darkMat = getMaterial(GAME_PALETTE.leafDark);

  // Central tiny stem
  const stemGeo = new THREE.CylinderGeometry(0.7, 0.7, 6, 5);
  const stem = new THREE.Mesh(stemGeo, darkMat);
  group.add(stem);

  // Left & Right faceted leaves
  const leafGeo = new THREE.ConeGeometry(2.2, 7, 4);
  leafGeo.translate(0, 3.5, 0);
  leafGeo.scale(1.5, 1, 0.3);

  const leafL = new THREE.Mesh(leafGeo, mat);
  leafL.rotation.z = Math.PI / 3;
  leafL.rotation.x = 0.15;
  group.add(leafL);

  const leafR = new THREE.Mesh(leafGeo, mat);
  leafR.rotation.z = -Math.PI / 3;
  leafR.rotation.x = -0.15;
  group.add(leafR);

  return group;
}

// Elastic overshoot bounce easing for springy game feel
function easeOutBack(x: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

export function generateGardenHtml(): string {
  return `
    <div class="card-3d-garden-wrapper" aria-hidden="true">
      <div class="card-vine-line"></div>
      <canvas class="card-3d-flower-canvas"></canvas>
    </div>
  `;
}

export function initDeveloperEasterEgg(): void {
  const devCard = document.querySelector<HTMLElement>('.team-card-dev');
  if (!devCard) return;

  const canvas = devCard.querySelector<HTMLCanvasElement>('.card-3d-flower-canvas');
  if (!canvas) return;

  // Setup Three.js WebGL Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const fov = 45;
  const camera = new THREE.PerspectiveCamera(fov, 1, 1, 2500);

  // Stylized Game Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.35);
  sunLight.position.set(-80, 160, 220);
  scene.add(sunLight);

  const rimLight = new THREE.PointLight(0x00f5d4, 1.1, 400);
  rimLight.position.set(0, 0, 70);
  scene.add(rimLight);

  const flowerWorldGroup = new THREE.Group();
  scene.add(flowerWorldGroup);

  // Create Flower Instances along the 4 edges
  const flowers: FlowerInstance[] = [];
  const edgeConfigs: Array<{ edge: 'top' | 'right' | 'bottom' | 'left'; pcts: number[] }> = [
    { edge: 'top', pcts: [0.08, 0.20, 0.32, 0.44, 0.56, 0.68, 0.80, 0.92] },
    { edge: 'right', pcts: [0.12, 0.24, 0.36, 0.48, 0.60, 0.72, 0.84, 0.94] },
    { edge: 'bottom', pcts: [0.92, 0.80, 0.68, 0.56, 0.44, 0.32, 0.20, 0.08] },
    { edge: 'left', pcts: [0.94, 0.84, 0.72, 0.60, 0.48, 0.36, 0.24, 0.12] },
  ];

  let cumulativeIndex = 0;
  const colorPool = [
    GAME_PALETTE.rose,
    GAME_PALETTE.sun,
    GAME_PALETTE.cyan,
    GAME_PALETTE.orchid,
    GAME_PALETTE.amber,
    GAME_PALETTE.sky,
    GAME_PALETTE.sakura,
    GAME_PALETTE.violet,
  ];

  edgeConfigs.forEach(ec => {
    ec.pcts.forEach(pct => {
      const isLeaf = cumulativeIndex % 3 === 2;
      const type: FlowerInstance['type'] = isLeaf
        ? 'leaf'
        : cumulativeIndex % 3 === 0
          ? 'daisy'
          : cumulativeIndex % 3 === 1
            ? 'blossom'
            : 'rosebud';

      const color = isLeaf
        ? cumulativeIndex % 2 === 0
          ? GAME_PALETTE.leafGreen
          : GAME_PALETTE.leafMint
        : colorPool[cumulativeIndex % colorPool.length];

      let mesh: THREE.Group;
      switch (type) {
        case 'daisy':
          mesh = buildDaisyMesh(color, GAME_PALETTE.sun);
          break;
        case 'rosebud':
          mesh = buildRosebudMesh(color);
          break;
        case 'leaf':
          mesh = buildLeafMesh(color);
          break;
        case 'blossom':
        default:
          mesh = buildBlossomMesh(color, GAME_PALETTE.sun);
          break;
      }

      mesh.scale.set(0, 0, 0);
      flowerWorldGroup.add(mesh);

      flowers.push({
        group: mesh,
        edge: ec.edge,
        pct,
        type,
        color,
        centerColor: GAME_PALETTE.sun,
        scale: 0.95 + Math.random() * 0.25,
        currentProgress: 0,
        delay: cumulativeIndex * 0.025, // cascading clockwise delay
        bloomedZ: 14 + Math.random() * 14, // 14px to 28px in 3D depth
        swaySpeed: 1.4 + Math.random() * 1.4,
        swayPhase: Math.random() * Math.PI * 2,
        baseRotX: (Math.random() - 0.5) * 0.3,
        baseRotY: (Math.random() - 0.5) * 0.3,
        baseRotZ: (Math.random() - 0.5) * 0.6,
      });

      cumulativeIndex++;
    });
  });

  let cardWidth = 0;
  let cardHeight = 0;
  let isHovered = false;
  let mouseNormX = 0;
  let mouseNormY = 0;
  let animFrameId: number | null = null;
  let lastTime = performance.now();

  function updateLayout(): void {
    const rect = devCard!.getBoundingClientRect();
    cardWidth = Math.round(rect.width);
    cardHeight = Math.round(rect.height);

    if (cardWidth === 0 || cardHeight === 0) return;

    renderer.setSize(cardWidth, cardHeight);
    camera.aspect = cardWidth / cardHeight;
    camera.updateProjectionMatrix();

    // Distance where 1 world unit = 1 pixel at z = 0
    const cameraZ = (cardHeight / 2) / Math.tan(((fov * Math.PI) / 180) / 2);
    camera.position.set(0, 0, cameraZ);
    camera.lookAt(0, 0, 0);

    const gutterDist = 6; // Center of the 12px outer/inner border gap

    flowers.forEach(f => {
      let wx = 0;
      let wy = 0;

      switch (f.edge) {
        case 'top':
          wx = -cardWidth / 2 + f.pct * cardWidth;
          wy = cardHeight / 2 - gutterDist;
          break;
        case 'right':
          wx = cardWidth / 2 - gutterDist;
          wy = cardHeight / 2 - f.pct * cardHeight;
          break;
        case 'bottom':
          wx = -cardWidth / 2 + f.pct * cardWidth;
          wy = -cardHeight / 2 + gutterDist;
          break;
        case 'left':
          wx = -cardWidth / 2 + gutterDist;
          wy = cardHeight / 2 - f.pct * cardHeight;
          break;
      }

      f.group.position.x = wx;
      f.group.position.y = wy;
    });

    renderer.render(scene, camera);
  }

  // Animation Loop
  function tick(now: number): void {
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    let hasActiveMotion = false;
    const target = isHovered ? 1 : 0;
    const speed = isHovered ? 2.6 : 3.2;

    // Interactive 3D Card Parallax Tilt on Cursor
    const targetTiltX = isHovered ? -mouseNormY * 0.14 : 0;
    const targetTiltY = isHovered ? mouseNormX * 0.14 : 0;
    flowerWorldGroup.rotation.x += (targetTiltX - flowerWorldGroup.rotation.x) * 0.1;
    flowerWorldGroup.rotation.y += (targetTiltY - flowerWorldGroup.rotation.y) * 0.1;

    flowers.forEach(f => {
      // Account for staggered start delay
      let desiredProgress = target;
      if (isHovered) {
        const timeSinceHover = (now - hoverStartTime) / 1000;
        if (timeSinceHover < f.delay) {
          desiredProgress = 0;
        }
      }

      const diff = desiredProgress - f.currentProgress;
      if (Math.abs(diff) > 0.002) {
        hasActiveMotion = true;
        f.currentProgress += Math.sign(diff) * Math.min(Math.abs(diff), dt * speed);
        f.currentProgress = Math.max(0, Math.min(1, f.currentProgress));
      }

      if (f.currentProgress > 0) {
        const easedScale = easeOutBack(f.currentProgress) * f.scale;
        f.group.scale.set(easedScale, easedScale, easedScale);

        // Pop forward in 3D Z space
        f.group.position.z = f.currentProgress * f.bloomedZ;

        // Gentle breeze sway in 3D
        const timeSec = now / 1000;
        const sway = Math.sin(timeSec * f.swaySpeed + f.swayPhase) * 0.1;
        f.group.rotation.x = f.baseRotX + sway * 0.5;
        f.group.rotation.y = f.baseRotY + sway * 0.5;
        f.group.rotation.z = f.baseRotZ + sway;
      } else {
        f.group.scale.set(0, 0, 0);
        f.group.position.z = 0;
      }
    });

    renderer.render(scene, camera);

    // Keep running while hovered or while flowers are still transitioning
    if (isHovered || hasActiveMotion) {
      animFrameId = requestAnimationFrame(tick);
    } else {
      animFrameId = null;
    }
  }

  function startLoop(): void {
    lastTime = performance.now();
    if (!animFrameId) {
      animFrameId = requestAnimationFrame(tick);
    }
  }

  let hoverStartTime = 0;

  devCard.addEventListener('mouseenter', () => {
    isHovered = true;
    hoverStartTime = performance.now();
    startLoop();
  });

  devCard.addEventListener('mouseleave', () => {
    isHovered = false;
    mouseNormX = 0;
    mouseNormY = 0;
    startLoop();
  });

  devCard.addEventListener('mousemove', (e: MouseEvent) => {
    const rect = devCard!.getBoundingClientRect();
    mouseNormX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseNormY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
  });

  // Watch for resize
  const resizeObserver = new ResizeObserver(() => {
    updateLayout();
  });
  resizeObserver.observe(devCard);

  // Initial Layout
  updateLayout();
}
