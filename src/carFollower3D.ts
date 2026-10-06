import * as THREE from 'three';

// ==========================================================================
// 3D FORMULA STUDENT CAR CURSOR FOLLOWER
// Features:
// - Dynamic realistic billowing tire smoke during drifts
// - Tuned speed: snappy, agile, nimble responsiveness
// - Proper wheel rotation around lateral axle (Z-axis)
// - Suspension wishbones, chassis roll & oversteer drift physics
// ==========================================================================

interface SmokeParticle {
  sprite: THREE.Sprite;
  velocity: THREE.Vector3;
  size: number;
  maxSize: number;
  alpha: number;
  decay: number;
  rotSpeed: number;
  active: boolean;
}

interface SkidQuad {
  leftV1: THREE.Vector3;
  leftV2: THREE.Vector3;
  rightV1: THREE.Vector3;
  rightV2: THREE.Vector3;
  alpha: number;
  age: number;
}

export class CarFollower3D {
  private canvas!: HTMLCanvasElement;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;

  // Car 3D hierarchy
  private carRoot = new THREE.Group();
  private suspensionGroup = new THREE.Group();
  private frontLeftWheelGroup = new THREE.Group();
  private frontRightWheelGroup = new THREE.Group();
  private frontLeftWheelMesh!: THREE.Mesh;
  private frontRightWheelMesh!: THREE.Mesh;
  private rearLeftWheelMesh!: THREE.Mesh;
  private rearRightWheelMesh!: THREE.Mesh;
  private underglowLight!: THREE.PointLight;
  private headlightLeft!: THREE.SpotLight;
  private headlightRight!: THREE.SpotLight;

  // Dual Exhausts & Micro Nitro Flames
  private leftFlameMesh!: THREE.Mesh;
  private rightFlameMesh!: THREE.Mesh;
  private flameIntensity = 0;

  // Mobile Scroll Progress Track State
  private isMobile = false;
  private mobileProgress = 0;
  private lastScrollY = 0;
  private scrollDeltaY = 0;
  private mTrackFill: HTMLElement | null = null;
  private mTrackPct: HTMLElement | null = null;

  // Parking State (Option 2: Navbar Pit Bay - Method B: Instant Park Button)
  private parkingState: 'ACTIVE' | 'AUTODOCKING' | 'PARKED' = 'ACTIVE';
  private parkingWorldPos = new THREE.Vector3();
  private navPitBtn: HTMLButtonElement | null = null;
  private navPitLabel: HTMLElement | null = null;
  private navPitSlot: HTMLElement | null = null;
  private dockingStartTime = 0;

  // Physics state
  private carPos = new THREE.Vector3(0, 0, 0);
  private carVel = new THREE.Vector3(0, 0, 0);
  private headingAngle = 0; // Yaw in radians
  private angularVelocity = 0;
  private steerAngle = 0;
  private rollAngle = 0;
  private pitchAngle = 0;
  private speed = 0;

  // Mouse & Target
  private targetWorld = new THREE.Vector3(0, 0, 0);
  private isMouseOnScreen = false;
  private lastMouseMoveTime = 0;
  private mouseHistory: Array<{ x: number; y: number; time: number }> = [];

  // Raycasting to ground
  private raycaster = new THREE.Raycaster();
  private groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private groundHit = new THREE.Vector3();

  // Drift metrics
  private isDrifting = false;
  private driftIntensity = 0;
  private opacity = 0;

  // Skid Marks Quad Mesh
  private maxSkidQuads = 140;
  private skidQuads: SkidQuad[] = [];
  private skidMesh!: THREE.Mesh;
  private skidPositions!: Float32Array;
  private skidAlphas!: Float32Array;
  private lastLeftTirePos = new THREE.Vector3();
  private lastRightTirePos = new THREE.Vector3();
  private hasLastTirePos = false;

  // Billowing Tire Smoke System
  private maxSmoke = 65;
  private smokePool: SmokeParticle[] = [];
  private smokeGroup = new THREE.Group();
  private smokeTexture!: THREE.CanvasTexture;

  private isDestroyed = false;
  private animFrameId: number | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    // Create fixed overlay canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'cursorCarCanvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.inset = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9999';
    this.canvas.style.opacity = '1';
    this.canvas.style.transition = 'opacity 300ms ease';
    document.body.appendChild(this.canvas);

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Three.js WebGLRenderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    // Scene
    this.scene = new THREE.Scene();

    // Perspective Camera at 3D isometric pitch
    this.camera = new THREE.PerspectiveCamera(45, width / height, 10, 3000);
    this.camera.position.set(0, 520, 340);
    this.camera.lookAt(0, 0, 0);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.4);
    keyLight.position.set(250, 450, 200);
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.1);
    rimLight.position.set(-250, 200, -150);
    this.scene.add(rimLight);

    // Build the car, skid marks, and smoke
    this.buildCarModel();
    this.initSkidmarks();
    this.initSmokeSystem();

    // Bind DOM Pit Bay elements
    this.navPitBtn = document.getElementById('navPitBtn') as HTMLButtonElement | null;
    this.navPitLabel = document.getElementById('navPitLabel');
    this.navPitSlot = document.getElementById('navPitSlot');

    if (this.navPitBtn) {
      this.navPitBtn.addEventListener('click', this.onPitBtnClick);
    }
    window.addEventListener('keydown', this.onKeyDown);

    // Mobile Elements & Device Mode
    this.bindMobileElements();
    this.updateDeviceMode();

    // Listeners
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseleave', this.onMouseLeave);
    window.addEventListener('mouseenter', this.onMouseEnter);
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('scroll', this.onScroll, { passive: true });

    if (this.isMobile) {
      this.parkingState = 'ACTIVE';
      this.carRoot.visible = true;
      this.opacity = 1.0;
      this.canvas.style.opacity = '1';
      this.updateMobileScrollProgress();
    } else {
      // Check saved parked state preference for desktop
      const isSavedParked = localStorage.getItem('sae_car_parked') === 'true';
      if (isSavedParked) {
        this.parkingState = 'PARKED';
        const slotPos = this.getSlotWorldPos();
        if (slotPos) {
          this.parkingWorldPos.copy(slotPos);
          this.carPos.copy(this.parkingWorldPos);
          this.carRoot.visible = true;
        } else {
          this.carRoot.visible = false;
        }
        this.headingAngle = 0;
        this.carRoot.position.set(this.carPos.x, 0, this.carPos.z);
        this.carRoot.rotation.y = 0;
        if (this.headlightLeft && this.headlightRight) {
          this.headlightLeft.intensity = 0.15;
          this.headlightRight.intensity = 0.15;
        }
        this.updateUI('PARKED');
      } else {
        this.parkingState = 'ACTIVE';
        this.carRoot.visible = true;
        this.updateTargetFromScreen(width / 2, height / 2);
        this.carPos.copy(this.targetWorld);
        this.updateUI('ACTIVE');
      }
    }

    // Start loop
    this.tick();
  }

  // ===================== 3D CAR MODEL CONSTRUCTION =====================

  private buildCarModel(): void {
    // Compact scale (~26px on screen)
    const scaleFactor = 0.72;
    this.carRoot.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // Materials
    const carMatCarbon = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.25,
      metalness: 0.85,
    });

    const carMatGold = new THREE.MeshStandardMaterial({
      color: 0xf6b719,
      roughness: 0.2,
      metalness: 0.9,
    });

    const carMatTire = new THREE.MeshStandardMaterial({
      color: 0x181e29,
      roughness: 0.85,
      metalness: 0.1,
    });

    const carMatMetal = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.3,
      metalness: 0.95,
    });

    // Ground Shadow under car
    const shadowGeo = new THREE.PlaneGeometry(38, 24);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.2;
    this.carRoot.add(shadowMesh);

    // Underglow point light (activated dynamically during drift)
    this.underglowLight = new THREE.PointLight(0xf6b719, 0, 75);
    this.underglowLight.position.set(0, 3, 0);
    this.carRoot.add(this.underglowLight);

    // Suspension group (for chassis roll & pitch)
    this.suspensionGroup.position.set(0, 3.5, 0);
    this.carRoot.add(this.suspensionGroup);

    // 1. Chassis Body (tapered low-poly monocoque)
    const chassisGeo = new THREE.BoxGeometry(26, 4.5, 9);
    const posAttr = chassisGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      if (x > 5) {
        const taper = 1 - (x - 5) / 10;
        posAttr.setZ(i, z * Math.max(0.35, taper));
      }
    }
    chassisGeo.computeVertexNormals();

    const chassisMesh = new THREE.Mesh(chassisGeo, carMatCarbon);
    chassisMesh.position.set(0, 2.25, 0);
    this.suspensionGroup.add(chassisMesh);

    // 2. Nose Cone (Gold Racing Nose)
    const noseGeo = new THREE.ConeGeometry(3.6, 11, 4);
    noseGeo.rotateZ(-Math.PI / 2);
    const noseMesh = new THREE.Mesh(noseGeo, carMatGold);
    noseMesh.position.set(16, 2.0, 0);
    noseMesh.scale.set(1, 0.8, 1);
    this.suspensionGroup.add(noseMesh);

    // 3. Front Wing
    const frontWingGeo = new THREE.BoxGeometry(2.6, 1.1, 25);
    const frontWing = new THREE.Mesh(frontWingGeo, carMatCarbon);
    frontWing.position.set(18, 1.2, 0);
    this.suspensionGroup.add(frontWing);

    // Front Wing Endplates (Gold)
    const endplateGeo = new THREE.BoxGeometry(5.5, 3.4, 0.8);
    const leftFrontEndplate = new THREE.Mesh(endplateGeo, carMatGold);
    leftFrontEndplate.position.set(18, 2.2, -12.5);
    this.suspensionGroup.add(leftFrontEndplate);

    const rightFrontEndplate = new THREE.Mesh(endplateGeo, carMatGold);
    rightFrontEndplate.position.set(18, 2.2, 12.5);
    this.suspensionGroup.add(rightFrontEndplate);

    // 4. Rear Wing
    const rearWingGeo = new THREE.BoxGeometry(3.8, 1.2, 23);
    const rearWing = new THREE.Mesh(rearWingGeo, carMatCarbon);
    rearWing.position.set(-15, 8.8, 0);
    this.suspensionGroup.add(rearWing);

    // Rear Wing Pylons
    const pylonGeo = new THREE.CylinderGeometry(0.5, 0.5, 6.5, 4);
    const pylon1 = new THREE.Mesh(pylonGeo, carMatMetal);
    pylon1.position.set(-14, 5.5, -3.2);
    this.suspensionGroup.add(pylon1);

    const pylon2 = new THREE.Mesh(pylonGeo, carMatMetal);
    pylon2.position.set(-14, 5.5, 3.2);
    this.suspensionGroup.add(pylon2);

    // Rear Wing Endplates (Gold)
    const rearEndplateGeo = new THREE.BoxGeometry(7.5, 5.5, 0.8);
    const leftRearEndplate = new THREE.Mesh(rearEndplateGeo, carMatGold);
    leftRearEndplate.position.set(-15, 8.8, -11.5);
    this.suspensionGroup.add(leftRearEndplate);

    const rightRearEndplate = new THREE.Mesh(rearEndplateGeo, carMatGold);
    rightRearEndplate.position.set(-15, 8.8, 11.5);
    this.suspensionGroup.add(rightRearEndplate);

    // 5. Cockpit & Driver Helmet
    const cockpitGeo = new THREE.BoxGeometry(7, 2.4, 5.5);
    const cockpitMesh = new THREE.Mesh(cockpitGeo, carMatMetal);
    cockpitMesh.position.set(-1, 4.3, 0);
    this.suspensionGroup.add(cockpitMesh);

    // Driver Helmet
    const helmetGeo = new THREE.SphereGeometry(2.1, 8, 8);
    const helmetMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.6,
    });
    const helmet = new THREE.Mesh(helmetGeo, helmetMat);
    helmet.position.set(-1, 5.7, 0);
    this.suspensionGroup.add(helmet);

    // Helmet Visor
    const visorGeo = new THREE.BoxGeometry(1.4, 0.9, 2.5);
    const visorMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1 });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0.6, 5.7, 0);
    this.suspensionGroup.add(visor);

    // Roll Hoop / Engine Air Intake
    const intakeGeo = new THREE.CylinderGeometry(1.2, 2.2, 4.5, 6);
    const intake = new THREE.Mesh(intakeGeo, carMatCarbon);
    intake.position.set(-4.5, 6.2, 0);
    intake.rotation.z = -0.22;
    this.suspensionGroup.add(intake);

    // 6. Sidepods
    const podGeo = new THREE.BoxGeometry(13, 3.8, 3.5);
    const leftPod = new THREE.Mesh(podGeo, carMatCarbon);
    leftPod.position.set(-2, 2.5, -6.5);
    this.suspensionGroup.add(leftPod);

    const rightPod = new THREE.Mesh(podGeo, carMatCarbon);
    rightPod.position.set(-2, 2.5, 6.5);
    this.suspensionGroup.add(rightPod);

    // Gold stripes on sidepods
    const podStripeGeo = new THREE.BoxGeometry(12, 0.6, 3.6);
    const leftStripe = new THREE.Mesh(podStripeGeo, carMatGold);
    leftStripe.position.set(-2, 3.8, -6.5);
    this.suspensionGroup.add(leftStripe);

    const rightStripe = new THREE.Mesh(podStripeGeo, carMatGold);
    rightStripe.position.set(-2, 3.8, 6.5);
    this.suspensionGroup.add(rightStripe);

    // 7. Headlight Beams
    const headlampGeo = new THREE.SphereGeometry(0.8, 6, 6);
    const headlampMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb });

    const leftLamp = new THREE.Mesh(headlampGeo, headlampMat);
    leftLamp.position.set(17, 2.2, -2.5);
    this.suspensionGroup.add(leftLamp);

    const rightLamp = new THREE.Mesh(headlampGeo, headlampMat);
    rightLamp.position.set(17, 2.2, 2.5);
    this.suspensionGroup.add(rightLamp);

    this.headlightLeft = new THREE.SpotLight(0xfff7ed, 3.5, 140, Math.PI / 6, 0.5);
    this.headlightLeft.position.set(18, 3, -2.5);
    this.headlightLeft.target.position.set(100, 0, -2.5);
    this.carRoot.add(this.headlightLeft);
    this.carRoot.add(this.headlightLeft.target);

    this.headlightRight = new THREE.SpotLight(0xfff7ed, 3.5, 140, Math.PI / 6, 0.5);
    this.headlightRight.position.set(18, 3, 2.5);
    this.headlightRight.target.position.set(100, 0, 2.5);
    this.carRoot.add(this.headlightRight);
    this.carRoot.add(this.headlightRight.target);

    // 8. Suspension A-arms / Wishbone Struts
    const armGeo = new THREE.CylinderGeometry(0.35, 0.35, 6.5, 4);
    armGeo.rotateZ(Math.PI / 2);

    const addWishbone = (x: number, y: number, z: number, angleZ: number) => {
      const arm = new THREE.Mesh(armGeo, carMatMetal);
      arm.position.set(x, y, z);
      arm.rotation.y = angleZ;
      this.carRoot.add(arm);
    };

    addWishbone(10, 1.8, -7.5, 0.15);
    addWishbone(10, 1.8, 7.5, -0.15);
    addWishbone(-10, 1.8, -8.0, -0.1);
    addWishbone(-10, 1.8, 8.0, 0.1);

    // 9. Wheels & Hubs
    const tireRadius = 3.6;
    const tireWidth = 3.0;
    const tireGeo = new THREE.CylinderGeometry(tireRadius, tireRadius, tireWidth, 14);
    tireGeo.rotateX(Math.PI / 2);

    const rimGeo = new THREE.CylinderGeometry(2.0, 2.0, tireWidth + 0.25, 8);
    rimGeo.rotateX(Math.PI / 2);

    const createWheel = (): THREE.Mesh => {
      const wheel = new THREE.Mesh(tireGeo, carMatTire);
      const rim = new THREE.Mesh(rimGeo, carMatGold);
      wheel.add(rim);
      return wheel;
    };

    // Front Left
    this.frontLeftWheelGroup.position.set(11, 0.4, -11);
    this.frontLeftWheelMesh = createWheel();
    this.frontLeftWheelGroup.add(this.frontLeftWheelMesh);
    this.carRoot.add(this.frontLeftWheelGroup);

    // Front Right
    this.frontRightWheelGroup.position.set(11, 0.4, 11);
    this.frontRightWheelMesh = createWheel();
    this.frontRightWheelGroup.add(this.frontRightWheelMesh);
    this.carRoot.add(this.frontRightWheelGroup);

    // Rear Left
    this.rearLeftWheelMesh = createWheel();
    this.rearLeftWheelMesh.position.set(-11, 0.4, -11.5);
    this.carRoot.add(this.rearLeftWheelMesh);

    // Rear Right
    this.rearRightWheelMesh = createWheel();
    this.rearRightWheelMesh.position.set(-11, 0.4, 11.5);
    this.carRoot.add(this.rearRightWheelMesh);

    // 10. Dual Titanium Exhaust Tips & Animated Nitro Flame Cones
    const exhaustGeo = new THREE.CylinderGeometry(0.75, 0.75, 2.8, 6);
    exhaustGeo.rotateZ(Math.PI / 2);
    const exhaustMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.9,
      roughness: 0.2,
    });

    const leftExhaust = new THREE.Mesh(exhaustGeo, exhaustMat);
    leftExhaust.position.set(-14.8, 2.7, -2.4);
    this.carRoot.add(leftExhaust);

    const rightExhaust = new THREE.Mesh(exhaustGeo, exhaustMat);
    rightExhaust.position.set(-14.8, 2.7, 2.4);
    this.carRoot.add(rightExhaust);

    // Nitro Flame Cones (pointing backwards in -X direction)
    const flameGeo = new THREE.ConeGeometry(1.2, 5.5, 6);
    flameGeo.rotateZ(Math.PI / 2); // points -X
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    this.leftFlameMesh = new THREE.Mesh(flameGeo, flameMat);
    this.leftFlameMesh.position.set(-18.5, 2.7, -2.4);
    this.leftFlameMesh.scale.set(0, 0, 0);
    this.carRoot.add(this.leftFlameMesh);

    this.rightFlameMesh = new THREE.Mesh(flameGeo, flameMat.clone());
    this.rightFlameMesh.position.set(-18.5, 2.7, 2.4);
    this.rightFlameMesh.scale.set(0, 0, 0);
    this.carRoot.add(this.rightFlameMesh);

    this.scene.add(this.carRoot);
  }

  // ===================== SKIDMARKS (QUAD RIBBON) =====================

  private initSkidmarks(): void {
    const totalVertices = this.maxSkidQuads * 12;
    this.skidPositions = new Float32Array(totalVertices * 3);
    this.skidAlphas = new Float32Array(totalVertices * 4);

    const skidGeo = new THREE.BufferGeometry();
    skidGeo.setAttribute('position', new THREE.BufferAttribute(this.skidPositions, 3));
    skidGeo.setAttribute('color', new THREE.BufferAttribute(this.skidAlphas, 4));

    const skidMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    this.skidMesh = new THREE.Mesh(skidGeo, skidMat);
    this.scene.add(this.skidMesh);
  }

  // ===================== BILLOWING TIRE SMOKE =====================

  private createSmokeTexture(): THREE.CanvasTexture {
    const cvs = document.createElement('canvas');
    cvs.width = 64;
    cvs.height = 64;
    const ctx = cvs.getContext('2d')!;

    const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    grad.addColorStop(0, 'rgba(240, 245, 255, 0.9)');
    grad.addColorStop(0.25, 'rgba(220, 230, 245, 0.6)');
    grad.addColorStop(0.65, 'rgba(190, 205, 225, 0.22)');
    grad.addColorStop(1, 'rgba(180, 200, 220, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const tex = new THREE.CanvasTexture(cvs);
    tex.needsUpdate = true;
    return tex;
  }

  private initSmokeSystem(): void {
    this.smokeTexture = this.createSmokeTexture();
    this.scene.add(this.smokeGroup);

    // Pre-allocate Sprite particle pool
    for (let i = 0; i < this.maxSmoke; i++) {
      const mat = new THREE.SpriteMaterial({
        map: this.smokeTexture,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.NormalBlending,
      });

      const sprite = new THREE.Sprite(mat);
      sprite.visible = false;
      this.smokeGroup.add(sprite);

      this.smokePool.push({
        sprite,
        velocity: new THREE.Vector3(),
        size: 3,
        maxSize: 18,
        alpha: 0,
        decay: 0.02,
        rotSpeed: 0,
        active: false,
      });
    }
  }

  private spawnSmokePuff(worldPos: THREE.Vector3): void {
    // Find an inactive particle in the pool
    const p = this.smokePool.find(item => !item.active);
    if (!p) return;

    p.active = true;
    p.sprite.visible = true;

    // Small jitter around contact patch
    p.sprite.position.set(
      worldPos.x + (Math.random() - 0.5) * 1.5,
      worldPos.y + 0.3,
      worldPos.z + (Math.random() - 0.5) * 1.5
    );

    // Cloud expands from small to big
    p.size = 2.5 + Math.random() * 1.5;
    p.maxSize = 14.0 + Math.random() * 8.0;
    p.sprite.scale.set(p.size, p.size, 1);

    // Velocity: carries residual momentum + upward buoyant rise + turbulence
    p.velocity.set(
      this.carVel.x * 0.22 + (Math.random() - 0.5) * 0.7,
      0.45 + Math.random() * 0.65,
      this.carVel.z * 0.22 + (Math.random() - 0.5) * 0.7
    );

    // Opacity based on drift sharpness
    p.alpha = Math.min(0.68 * this.driftIntensity, 0.72);
    p.sprite.material.opacity = p.alpha;
    p.decay = 0.016 + Math.random() * 0.012; // Lingers ~1.2s

    // Subtle rotation
    p.sprite.material.rotation = Math.random() * Math.PI * 2;
    p.rotSpeed = (Math.random() - 0.5) * 0.04;
  }

  private updateSmoke(): void {
    for (let i = 0; i < this.smokePool.length; i++) {
      const p = this.smokePool[i];
      if (!p.active) continue;

      // Update position & buoyancy
      p.sprite.position.add(p.velocity);
      p.velocity.y += 0.008; // Gentle thermal rise
      p.velocity.x *= 0.96;
      p.velocity.z *= 0.96;

      // Billow & expand outward
      p.size += (p.maxSize - p.size) * 0.075;
      p.sprite.scale.set(p.size, p.size, 1);

      // Fade out
      p.alpha -= p.decay;
      p.sprite.material.opacity = Math.max(0, p.alpha);
      p.sprite.material.rotation += p.rotSpeed;

      if (p.alpha <= 0) {
        p.active = false;
        p.sprite.visible = false;
      }
    }
  }

  // ===================== DUAL NITRO FLAMES =====================

  private updateNitroFlames(intensity: number): void {
    if (!this.leftFlameMesh || !this.rightFlameMesh) return;
    if (intensity <= 0.05) {
      this.leftFlameMesh.scale.set(0, 0, 0);
      this.rightFlameMesh.scale.set(0, 0, 0);
      return;
    }

    const jitter = 0.8 + Math.random() * 0.4;
    const lMat = this.leftFlameMesh.material as THREE.MeshBasicMaterial;
    const rMat = this.rightFlameMesh.material as THREE.MeshBasicMaterial;

    if (Math.random() < 0.25) {
      lMat.color.setHex(0xff6b00);
      rMat.color.setHex(0xff6b00);
    } else {
      lMat.color.setHex(0x00f0ff);
      rMat.color.setHex(0x00f0ff);
    }

    this.leftFlameMesh.scale.set(intensity * (1.2 + Math.random() * 0.5), intensity * jitter, intensity * jitter);
    this.rightFlameMesh.scale.set(intensity * (1.2 + Math.random() * 0.5), intensity * jitter, intensity * jitter);
  }

  // ===================== MOBILE SCROLL PROGRESS TRACK RUNNER =====================

  private updateDeviceMode(): void {
    this.isMobile = window.innerWidth < 1024 || window.matchMedia('(pointer: coarse)').matches;
    if (this.isMobile) {
      // Significantly smaller micro car (~35px, 0.36x scale)
      this.carRoot.scale.set(0.36, 0.36, 0.36);
    } else {
      this.carRoot.scale.set(0.72, 0.72, 0.72);
    }
  }

  private bindMobileElements(): void {
    this.mTrackFill = document.getElementById('mTrackFill');
    this.mTrackPct = document.getElementById('mTrackPct');
  }

  private onScroll = (): void => {
    const currentY = window.scrollY;
    this.scrollDeltaY = currentY - this.lastScrollY;
    this.lastScrollY = currentY;
  };

  private updateMobileScrollProgress(): void {
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const scrollY = window.scrollY;
    const rawProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
    this.mobileProgress += (rawProgress - this.mobileProgress) * 0.22;

    if (this.mTrackFill) {
      this.mTrackFill.style.width = (this.mobileProgress * 100).toFixed(1) + '%';
    }
    if (this.mTrackPct) {
      this.mTrackPct.textContent = Math.round(this.mobileProgress * 100) + '%';
    }
  }

  private updateMobilePhysics(_dt: number): void {
    // Friction decay on scroll delta
    this.scrollDeltaY *= 0.86;

    this.updateMobileScrollProgress();

    const w = window.innerWidth;
    const h = window.innerHeight;
    const startX = 26;
    const endX = w - 26;
    const currentScreenX = startX + this.mobileProgress * (endX - startX);
    const currentScreenY = h - 14;

    const targetWorld = this.screenToWorld(currentScreenX, currentScreenY);
    if (targetWorld) {
      this.carPos.copy(targetWorld);
      this.carRoot.position.set(this.carPos.x, 0, this.carPos.z);
    }

    this.headingAngle = 0;
    this.carRoot.rotation.y = 0;

    // Roll wheels with scroll delta
    const wheelRoll = this.scrollDeltaY * 0.045;
    this.frontLeftWheelMesh.rotation.z -= wheelRoll;
    this.frontRightWheelMesh.rotation.z -= wheelRoll;
    this.rearLeftWheelMesh.rotation.z -= wheelRoll;
    this.rearRightWheelMesh.rotation.z -= wheelRoll;

    // Suspension pitch forward/backward
    const targetPitch = THREE.MathUtils.clamp(this.scrollDeltaY * 0.002, -0.05, 0.05);
    this.pitchAngle = THREE.MathUtils.lerp(this.pitchAngle, targetPitch, 0.2);
    this.suspensionGroup.rotation.z = -this.pitchAngle;

    // Micro idle engine vibration
    const idleVibe = Math.sin(performance.now() * 0.009) * 0.008;
    this.suspensionGroup.rotation.x = idleVibe;

    // Micro nitro flames & underglow when flicking / scrolling quickly
    const isFastScroll = Math.abs(this.scrollDeltaY) > 6;
    if (isFastScroll) {
      this.flameIntensity = THREE.MathUtils.lerp(this.flameIntensity, 0.65, 0.3);
      this.underglowLight.intensity = 1.2;
      this.underglowLight.color.setHex(0x00f0ff);
    } else {
      this.flameIntensity = THREE.MathUtils.lerp(this.flameIntensity, 0, 0.2);
      this.underglowLight.intensity = 0.55;
      this.underglowLight.color.setHex(0xf6b719);
    }
    this.updateNitroFlames(this.flameIntensity);
  }

  // ===================== MOUSE EVENT HANDLERS =====================

  private onMouseMove = (e: MouseEvent): void => {
    this.isMouseOnScreen = true;
    this.lastMouseMoveTime = performance.now();

    const now = performance.now();
    this.mouseHistory.push({ x: e.clientX, y: e.clientY, time: now });
    if (this.mouseHistory.length > 12) {
      this.mouseHistory.shift();
    }

    this.updateTargetFromScreen(e.clientX, e.clientY);
  };

  private onMouseLeave = (): void => {
    this.isMouseOnScreen = false;
  };

  private onMouseEnter = (): void => {
    this.isMouseOnScreen = true;
    this.lastMouseMoveTime = performance.now();
  };

  private onWindowResize = (): void => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.updateDeviceMode();

    if (this.isMobile) {
      this.updateMobileScrollProgress();
    } else if (this.parkingState === 'PARKED') {
      const slotPos = this.getSlotWorldPos();
      if (slotPos) {
        this.parkingWorldPos.copy(slotPos);
        this.carPos.copy(this.parkingWorldPos);
        this.carRoot.visible = true;
      } else {
        this.carRoot.visible = false;
      }
    }
  };

  private updateTargetFromScreen(clientX: number, clientY: number): void {
    const hit = this.screenToWorld(clientX, clientY);
    if (hit) {
      this.targetWorld.copy(hit);
    }
  }

  // ===================== PIT BAY DOCKING & WORLD PROJECTION =====================

  public screenToWorld(clientX: number, clientY: number): THREE.Vector3 | null {
    const ndcX = (clientX / window.innerWidth) * 2 - 1;
    const ndcY = -(clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), this.camera);
    if (this.raycaster.ray.intersectPlane(this.groundPlane, this.groundHit)) {
      return this.groundHit.clone();
    }
    return null;
  }

  public getSlotWorldPos(): THREE.Vector3 | null {
    const slot = this.navPitSlot || document.getElementById('navPitSlot') || this.navPitBtn;
    if (slot) {
      const rect = slot.getBoundingClientRect();
      // Ensure the slot is currently visible within the screen viewport (not scrolled away!)
      if (rect.bottom > 4 && rect.top < window.innerHeight && rect.width > 0 && rect.height > 0) {
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        return this.screenToWorld(cx, cy);
      }
    }
    return null;
  }

  public togglePark(): void {
    if (this.parkingState === 'ACTIVE') {
      this.startAutoDocking();
    } else {
      this.releaseCar();
    }
  }

  public startAutoDocking(): void {
    this.parkingState = 'AUTODOCKING';
    this.dockingStartTime = performance.now();
    const slotPos = this.getSlotWorldPos();
    if (slotPos) {
      this.parkingWorldPos.copy(slotPos);
    }
    this.updateUI('AUTODOCKING');
  }

  public completeParking(): void {
    this.parkingState = 'PARKED';
    const slotPos = this.getSlotWorldPos();
    if (slotPos) {
      this.parkingWorldPos.copy(slotPos);
      this.carPos.copy(this.parkingWorldPos);
      this.carRoot.visible = true;
    } else {
      this.carRoot.visible = false;
    }
    this.carVel.set(0, 0, 0);
    this.headingAngle = 0; // Aligned horizontally to the right
    this.speed = 0;
    this.steerAngle = 0;
    this.rollAngle = 0;
    this.pitchAngle = 0;
    this.frontLeftWheelGroup.rotation.y = 0;
    this.frontRightWheelGroup.rotation.y = 0;
    this.suspensionGroup.rotation.set(0, 0, 0);
    this.hasLastTirePos = false;
    localStorage.setItem('sae_car_parked', 'true');
    this.updateUI('PARKED');
  }

  public releaseCar(): void {
    this.parkingState = 'ACTIVE';
    this.carRoot.visible = true;
    this.canvas.style.opacity = '1';
    localStorage.setItem('sae_car_parked', 'false');
    this.updateUI('ACTIVE');

    // Turn headlights back up
    if (this.headlightLeft && this.headlightRight) {
      this.headlightLeft.intensity = 2.4;
      this.headlightRight.intensity = 2.4;
    }
    if (this.underglowLight) {
      this.underglowLight.intensity = 1.0;
    }

    // Exhaust rev & tire smoke puffs from rear wheels
    const leftTirePos = new THREE.Vector3();
    const rightTirePos = new THREE.Vector3();
    this.rearLeftWheelMesh.getWorldPosition(leftTirePos);
    this.rearRightWheelMesh.getWorldPosition(rightTirePos);
    for (let i = 0; i < 4; i++) {
      this.spawnSmokePuff(leftTirePos);
      this.spawnSmokePuff(rightTirePos);
    }

    // Launch burst velocity towards cursor
    const launchDir = new THREE.Vector3().subVectors(this.targetWorld, this.carPos);
    if (launchDir.length() > 5) {
      launchDir.normalize();
      this.carVel.copy(launchDir).multiplyScalar(7.0);
      this.headingAngle = Math.atan2(launchDir.z, launchDir.x);
    } else {
      this.carVel.set(0, 0, 5.0);
      this.headingAngle = Math.PI / 2;
    }
  }

  private updateUI(state: 'ACTIVE' | 'AUTODOCKING' | 'PARKED'): void {
    const btn = this.navPitBtn || document.getElementById('navPitBtn') as HTMLButtonElement | null;
    const label = this.navPitLabel || document.getElementById('navPitLabel');

    if (btn) {
      btn.classList.remove('is-docking', 'is-parked');
    }

    if (state === 'ACTIVE') {
      if (label) label.textContent = 'PARK CAR';
      if (btn) btn.setAttribute('aria-label', 'Park car in Pit Stop');
    } else if (state === 'AUTODOCKING') {
      if (btn) btn.classList.add('is-docking');
      if (label) label.textContent = 'DOCKING';
    } else if (state === 'PARKED') {
      if (btn) btn.classList.add('is-parked');
      if (label) label.textContent = 'RELEASE';
      if (btn) btn.setAttribute('aria-label', 'Release car from Pit Stop');
    }
  }

  private onPitBtnClick = (e: MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    this.togglePark();
  };

  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'p' || e.key === 'P') {
      const activeTag = (document.activeElement as HTMLElement)?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || (document.activeElement as HTMLElement)?.isContentEditable) {
        return;
      }
      this.togglePark();
    }
  };

  // ===================== CURVATURE & DRIFT PHYSICS =====================

  private calculatePathCurvature(): number {
    if (this.mouseHistory.length < 5) return 0;

    const p1 = this.mouseHistory[0];
    const p2 = this.mouseHistory[Math.floor(this.mouseHistory.length / 2)];
    const p3 = this.mouseHistory[this.mouseHistory.length - 1];

    const dx1 = p2.x - p1.x;
    const dy1 = p2.y - p1.y;
    const dx2 = p3.x - p2.x;
    const dy2 = p3.y - p2.y;

    const len1 = Math.hypot(dx1, dy1);
    const len2 = Math.hypot(dx2, dy2);
    if (len1 < 6 || len2 < 6) return 0;

    const a1 = Math.atan2(dy1, dx1);
    const a2 = Math.atan2(dy2, dx2);
    let diff = a2 - a1;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;

    return diff;
  }

  private updatePhysics(dt: number): void {
    if (!this.carRoot) return;

    if (this.isMobile) {
      this.updateMobilePhysics(dt);
      return;
    }

    // 1. PARKED STATE: Fixed stationary inside the navbar slot
    if (this.parkingState === 'PARKED') {
      const slotPos = this.getSlotWorldPos();

      // If the slot has scrolled off the screen or is not visible, hide the parked car completely!
      if (!slotPos) {
        this.carRoot.visible = false;
        this.canvas.style.opacity = '0';
        return;
      }

      this.carRoot.visible = true;
      this.opacity = 1.0;
      this.canvas.style.opacity = '1';

      this.parkingWorldPos.copy(slotPos);
      this.carPos.copy(this.parkingWorldPos);
      this.carVel.set(0, 0, 0);
      this.speed = 0;
      this.headingAngle = 0;
      this.steerAngle = 0;
      this.rollAngle = 0;
      this.pitchAngle = 0;
      this.frontLeftWheelGroup.rotation.y = 0;
      this.frontRightWheelGroup.rotation.y = 0;
      this.suspensionGroup.rotation.set(0, 0, 0);

      this.carRoot.position.set(this.carPos.x, 0, this.carPos.z);
      this.carRoot.rotation.y = -this.headingAngle;

      if (this.headlightLeft && this.headlightRight) {
        this.headlightLeft.intensity = 0.15;
        this.headlightRight.intensity = 0.15;
      }
      if (this.underglowLight) {
        this.underglowLight.intensity = 0.22 + 0.1 * Math.sin(performance.now() * 0.003);
      }
      return;
    }

    // 2. AUTODOCKING STATE: Drive into navbar slot and brake smoothly
    if (this.parkingState === 'AUTODOCKING') {
      this.carRoot.visible = true;
      this.opacity = 1.0;
      this.canvas.style.opacity = '1';

      const slotPos = this.getSlotWorldPos();
      if (slotPos) {
        this.parkingWorldPos.copy(slotPos);
      }
      const toSlot = new THREE.Vector3().subVectors(this.parkingWorldPos, this.carPos);
      const distToSlot = toSlot.length();
      const elapsedSec = (performance.now() - this.dockingStartTime) / 1000;

      // Completion check: Close to slot OR low speed near slot OR safeguard timeout (>1.8s)
      if (distToSlot < 2.5 || (distToSlot < 8.0 && this.speed < 1.0) || elapsedSec > 1.8) {
        this.completeParking();
        return;
      }

      const desiredHeading = Math.atan2(toSlot.z, toSlot.x);
      let headingDiff = desiredHeading - this.headingAngle;
      while (headingDiff > Math.PI) headingDiff -= Math.PI * 2;
      while (headingDiff < -Math.PI) headingDiff += Math.PI * 2;

      this.angularVelocity = headingDiff * 10.0;
      this.headingAngle += this.angularVelocity * dt;

      const targetSteer = THREE.MathUtils.clamp(headingDiff * 1.3, -0.48, 0.48);
      this.steerAngle += (targetSteer - this.steerAngle) * 0.25;
      this.frontLeftWheelGroup.rotation.y = -this.steerAngle;
      this.frontRightWheelGroup.rotation.y = -this.steerAngle;

      if (distToSlot > 18) {
        // Cruise towards bay
        const accel = Math.min(distToSlot * 0.16, 22.0);
        const forwardVec = new THREE.Vector3(Math.cos(this.headingAngle), 0, Math.sin(this.headingAngle));
        this.carVel.addScaledVector(forwardVec, accel * dt);
        this.carVel.multiplyScalar(0.92);
      } else {
        // Continuous smooth deceleration right into the bay (never stalls!)
        const targetGlideSpeed = Math.max(distToSlot * 0.55, 2.0);
        const dir = toSlot.clone().normalize();
        this.carVel.lerp(dir.multiplyScalar(targetGlideSpeed), 0.22);
        this.steerAngle *= 0.6;

        let alignDiff = 0 - this.headingAngle;
        while (alignDiff > Math.PI) alignDiff -= Math.PI * 2;
        while (alignDiff < -Math.PI) alignDiff += Math.PI * 2;
        this.headingAngle += alignDiff * 0.22;

        this.pitchAngle += (-0.03 - this.pitchAngle) * 0.2;
        this.suspensionGroup.rotation.z = -this.pitchAngle;
      }

      this.speed = this.carVel.length();
      this.carPos.add(this.carVel);
      this.carRoot.position.set(this.carPos.x, 0, this.carPos.z);
      this.carRoot.rotation.y = -this.headingAngle;

      const wheelRot = this.speed * 0.36;
      this.frontLeftWheelMesh.rotation.z -= wheelRot;
      this.frontRightWheelMesh.rotation.z -= wheelRot;
      this.rearLeftWheelMesh.rotation.z -= wheelRot;
      this.rearRightWheelMesh.rotation.z -= wheelRot;

      if (this.underglowLight) {
        this.underglowLight.intensity = 0.6;
      }
      return;
    }

    // 3. ACTIVE STATE: Normal cursor follower
    const toTarget = new THREE.Vector3().subVectors(this.targetWorld, this.carPos);
    const distToTarget = toTarget.length();

    // Sleep when mouse is idle
    const idleTime = performance.now() - this.lastMouseMoveTime;
    const isIdle = idleTime > 4000 || !this.isMouseOnScreen;

    const targetOpacity = isIdle ? 0.15 : 1.0;
    this.opacity += (targetOpacity - this.opacity) * 0.1;
    this.canvas.style.opacity = this.opacity.toFixed(3);

    // Target direction angle
    const desiredHeading = Math.atan2(toTarget.z, toTarget.x);

    // Path Curvature from mouse
    const curvature = this.calculatePathCurvature();
    const isPointerCurving = Math.abs(curvature) > 0.24;

    // --- TUNED SPEED & ACCELERATION ---
    // Snappier, quicker response ("a little bit fast, not too much")
    if (distToTarget > 10) {
      const accelFactor = Math.min(distToTarget * 0.14, 22.0); // Boosted from 16.0
      const forwardVec = new THREE.Vector3(Math.cos(this.headingAngle), 0, Math.sin(this.headingAngle));
      this.carVel.addScaledVector(forwardVec, accelFactor * dt);
    }

    // Drag / friction: slightly reduced drag so it glides faster
    const drag = this.isDrifting ? 0.95 : 0.925;
    this.carVel.multiplyScalar(drag);
    this.speed = this.carVel.length();

    // Angle difference between current heading and target
    let headingDiff = desiredHeading - this.headingAngle;
    while (headingDiff > Math.PI) headingDiff -= Math.PI * 2;
    while (headingDiff < -Math.PI) headingDiff += Math.PI * 2;

    // Velocity angle vs Heading angle (Sideslip)
    const velocityAngle = Math.atan2(this.carVel.z, this.carVel.x);
    let slipAngle = velocityAngle - this.headingAngle;
    while (slipAngle > Math.PI) slipAngle -= Math.PI * 2;
    while (slipAngle < -Math.PI) slipAngle += Math.PI * 2;

    // DRIFT CONDITION:
    // Only drifts when the path CURVES or takes a sharp arc!
    const isTurningSharp = Math.abs(headingDiff) > 0.30 && isPointerCurving;
    const isSideslipping = Math.abs(slipAngle) > 0.25;

    if ((isTurningSharp || isSideslipping) && this.speed > 3.0 && distToTarget > 30) {
      this.isDrifting = true;
      const targetIntensity = Math.min(Math.abs(slipAngle) * 2.2 + Math.abs(curvature) * 0.9, 1.0);
      this.driftIntensity += (targetIntensity - this.driftIntensity) * 0.32;
    } else {
      this.isDrifting = false;
      this.driftIntensity += (0 - this.driftIntensity) * 0.18;
    }

    // Yaw rotation: agile turning
    const turnRate = this.isDrifting ? 11.2 : 8.6;
    this.angularVelocity = headingDiff * turnRate;
    this.headingAngle += this.angularVelocity * dt;

    // Oversteer drift kick
    if (this.isDrifting && this.driftIntensity > 0.12) {
      const oversteer = (headingDiff > 0 ? 1 : -1) * this.driftIntensity * 0.05;
      this.headingAngle += oversteer;

      // Deposit wide tire skidmarks
      this.recordTireSkidmarks();

      // Spawn real billowing tire smoke puffs from both rear tires
      const leftTirePos = new THREE.Vector3();
      const rightTirePos = new THREE.Vector3();
      this.rearLeftWheelMesh.getWorldPosition(leftTirePos);
      this.rearRightWheelMesh.getWorldPosition(rightTirePos);

      this.spawnSmokePuff(leftTirePos);
      this.spawnSmokePuff(rightTirePos);
    } else {
      this.hasLastTirePos = false;
    }

    // Front Wheel Steering Angle (Steers left/right around Y axis)
    const targetSteer = THREE.MathUtils.clamp(headingDiff * 1.35, -0.48, 0.48);
    this.steerAngle += (targetSteer - this.steerAngle) * 0.25;
    this.frontLeftWheelGroup.rotation.y = -this.steerAngle;
    this.frontRightWheelGroup.rotation.y = -this.steerAngle;

    // WHEEL ROLLING FORWARD (Fixed: Rotate around lateral axle Z-axis!)
    const wheelRot = this.speed * 0.36;
    this.frontLeftWheelMesh.rotation.z -= wheelRot;
    this.frontRightWheelMesh.rotation.z -= wheelRot;
    this.rearLeftWheelMesh.rotation.z -= wheelRot;
    this.rearRightWheelMesh.rotation.z -= wheelRot;

    // SUSPENSION DYNAMICS:
    // 1. Chassis Roll: body leans into corner under lateral G-forces
    const targetRoll = -this.angularVelocity * 0.045 * (1.0 + this.driftIntensity * 1.4);
    this.rollAngle += (targetRoll - this.rollAngle) * 0.25;
    this.suspensionGroup.rotation.x = this.rollAngle;

    // 2. Chassis Pitch: dips under braking / lifts under acceleration
    const targetPitch = THREE.MathUtils.clamp((distToTarget - 90) * 0.0014, -0.06, 0.09);
    this.pitchAngle += (targetPitch - this.pitchAngle) * 0.22;
    this.suspensionGroup.rotation.z = -this.pitchAngle;

    // Update position
    this.carPos.add(this.carVel);

    // Apply to Three.js object
    this.carRoot.position.set(this.carPos.x, 0, this.carPos.z);
    this.carRoot.rotation.y = -this.headingAngle;

    // Dynamic underglow
    if (this.underglowLight) {
      this.underglowLight.intensity = this.driftIntensity * 3.4;
    }
  }

  // ===================== WIDE TIRE SKIDMARKS =====================

  private recordTireSkidmarks(): void {
    const curLeftTire = new THREE.Vector3();
    const curRightTire = new THREE.Vector3();
    this.rearLeftWheelMesh.getWorldPosition(curLeftTire);
    this.rearRightWheelMesh.getWorldPosition(curRightTire);
    curLeftTire.y = 0.22;
    curRightTire.y = 0.22;

    if (this.hasLastTirePos) {
      const tireWidth = 1.2;
      const cosH = Math.cos(-this.headingAngle);
      const sinH = Math.sin(-this.headingAngle);
      const perpX = -sinH * (tireWidth / 2);
      const perpZ = cosH * (tireWidth / 2);

      this.skidQuads.push({
        leftV1: new THREE.Vector3(this.lastLeftTirePos.x - perpX, 0.22, this.lastLeftTirePos.z - perpZ),
        leftV2: new THREE.Vector3(this.lastLeftTirePos.x + perpX, 0.22, this.lastLeftTirePos.z + perpZ),
        rightV1: new THREE.Vector3(this.lastRightTirePos.x - perpX, 0.22, this.lastRightTirePos.z - perpZ),
        rightV2: new THREE.Vector3(this.lastRightTirePos.x + perpX, 0.22, this.lastRightTirePos.z + perpZ),
        alpha: Math.min(this.driftIntensity * 0.72, 0.72),
        age: 0,
      });

      if (this.skidQuads.length > this.maxSkidQuads) {
        this.skidQuads.shift();
      }
    }

    this.lastLeftTirePos.copy(curLeftTire);
    this.lastRightTirePos.copy(curRightTire);
    this.hasLastTirePos = true;
  }

  private updateSkidmarks(): void {
    let vIdx = 0;
    const pos = this.skidPositions;
    const col = this.skidAlphas;

    for (let i = 0; i < this.skidQuads.length - 1; i++) {
      const q1 = this.skidQuads[i];
      const q2 = this.skidQuads[i + 1];

      q1.age += 1;
      q1.alpha *= 0.97;

      const addQuad = (
        v1: THREE.Vector3,
        v2: THREE.Vector3,
        v3: THREE.Vector3,
        v4: THREE.Vector3,
        a1: number,
        a2: number
      ) => {
        const setVertex = (v: THREE.Vector3, alpha: number) => {
          pos[vIdx * 3] = v.x;
          pos[vIdx * 3 + 1] = v.y;
          pos[vIdx * 3 + 2] = v.z;
          col[vIdx * 4] = 0.96; // Golden/rubber tone
          col[vIdx * 4 + 1] = 0.72;
          col[vIdx * 4 + 2] = 0.1;
          col[vIdx * 4 + 3] = alpha;
          vIdx++;
        };

        setVertex(v1, a1);
        setVertex(v2, a1);
        setVertex(v3, a2);

        setVertex(v2, a1);
        setVertex(v4, a2);
        setVertex(v3, a2);
      };

      addQuad(q1.leftV1, q1.leftV2, q2.leftV1, q2.leftV2, q1.alpha, q2.alpha);
      addQuad(q1.rightV1, q1.rightV2, q2.rightV1, q2.rightV2, q1.alpha, q2.alpha);
    }

    for (let i = vIdx; i < this.maxSkidQuads * 12; i++) {
      col[i * 4 + 3] = 0;
    }

    this.skidMesh.geometry.attributes.position.needsUpdate = true;
    this.skidMesh.geometry.attributes.color.needsUpdate = true;
  }

  // ===================== ANIMATION LOOP =====================

  private tick = (): void => {
    if (this.isDestroyed) return;

    const dt = 1 / 60;
    this.updatePhysics(dt);
    this.updateSkidmarks();
    this.updateSmoke();

    this.renderer.render(this.scene, this.camera);
    this.animFrameId = requestAnimationFrame(this.tick);
  };

  public destroy(): void {
    this.isDestroyed = true;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.navPitBtn) {
      this.navPitBtn.removeEventListener('click', this.onPitBtnClick);
    }
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseleave', this.onMouseLeave);
    window.removeEventListener('mouseenter', this.onMouseEnter);
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('scroll', this.onScroll);
    if (this.canvas && this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
    }
    this.renderer.dispose();
  }
}

export function initCarFollower3D(): CarFollower3D | null {
  try {
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!gl) return null;
  } catch (_) {
    return null;
  }

  return new CarFollower3D();
}
