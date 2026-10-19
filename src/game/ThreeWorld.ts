import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { AvatarSettings, LevelConfig } from '../types/game';

export interface GameCallbacks {
  onStarCollect: (count: number) => void;
  onReachDilemma: (dilemmaIndex: number) => void;
  onProgressDistance: (distance: number, target: number) => void;
  onLevelComplete: () => void;
  onPlayerHitObstacle: () => void;
}

export class ThreeWorld {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private animationFrameId: number | null = null;
  private clock: THREE.Clock;

  // Player & Entities
  private playerGroup: THREE.Group;
  private playerBodyMesh!: THREE.Mesh;
  private playerHeadwearGroup!: THREE.Group;
  private playerAccessoryGroup!: THREE.Group;
  private leftLeg!: THREE.Mesh;
  private rightLeg!: THREE.Mesh;
  private leftArm!: THREE.Mesh;
  private rightArm!: THREE.Mesh;
  private wingsGroup!: THREE.Group;

  // Game Track & Environment
  private trackGroup: THREE.Group;
  private starsGroup: THREE.Group;
  private obstaclesGroup: THREE.Group;
  private checkpointGates: THREE.Group[] = [];

  // Physics / State
  private playerLane: number = 0; // -1: left, 0: center, 1: right
  private targetPlayerX: number = 0;
  private playerY: number = 0;
  private playerVelocityY: number = 0;
  private isGrounded: boolean = true;
  private playerZ: number = 0;
  private runSpeed: number = 18; // units per second
  private distanceTraveled: number = 0;
  private isPaused: boolean = false;
  private targetDistance: number = 500;
  private currentLevelConfig: LevelConfig;
  private callbacks: GameCallbacks;

  // Collision tracking
  private dilemmaTriggeredIndices: Set<number> = new Set();
  private collectedStarIndices: Set<number> = new Set();
  private starsCount: number = 0;

  // Controls
  private keysHeld: Record<string, boolean> = {};

  constructor(container: HTMLElement, level: LevelConfig, avatar: AvatarSettings, callbacks: GameCallbacks) {
    this.container = container;
    this.currentLevelConfig = level;
    this.targetDistance = level.targetDistance;
    this.callbacks = callbacks;
    this.clock = new THREE.Clock();

    const isHeadless = typeof navigator !== 'undefined' && 
      (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent));

    // Scene & Fog
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.getSkyColor(level.environmentTheme));
    this.scene.fog = new THREE.Fog(this.scene.background, 35, 120);

    // Camera
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 200);
    this.camera.position.set(0, 4.5, 9);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: !isHeadless,
      alpha: false
    });
    this.renderer.setSize(width, height);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio || 1, 2));

    if (!isHeadless) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    container.appendChild(this.renderer.domElement);

    // Studio Environment map
    try {
      const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
      this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch {
      // Fallback
    }

    // Lighting Rig
    this.setupLighting(isHeadless);

    // Groups
    this.trackGroup = new THREE.Group();
    this.starsGroup = new THREE.Group();
    this.obstaclesGroup = new THREE.Group();
    this.scene.add(this.trackGroup);
    this.scene.add(this.starsGroup);
    this.scene.add(this.obstaclesGroup);

    // Build World & Player
    this.playerGroup = new THREE.Group();
    this.buildProceduralPlayer(avatar);
    this.scene.add(this.playerGroup);

    this.buildWorldTerrain(level);

    // Listeners
    this.bindInputs();
    window.addEventListener('resize', this.onResize);

    // Pre-warm shaders
    this.renderer.compile(this.scene, this.camera);

    // Start Loop
    this.tick();
  }

  private getSkyColor(theme: LevelConfig['environmentTheme']): number {
    switch (theme) {
      case 'temple': return 0xfff7ed; // Warm gold morning
      case 'village': return 0xf0fdf4; // Fresh green morning
      case 'island': return 0xecfeff; // Island teal sky
      case 'hall': return 0xf5f3ff; // Royal violet sky
      case 'valley': return 0xf0f9ff; // Azure valley
      default: return 0xffedd5;
    }
  }

  private setupLighting(isHeadless: boolean) {
    const hemiLight = new THREE.HemisphereLight(0xfffaed, 0x86efac, 0.7);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfffbeb, 1.4);
    dirLight.position.set(15, 25, 15);
    if (!isHeadless) {
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.camera.near = 0.5;
      dirLight.shadow.camera.far = 70;
      const d = 16;
      dirLight.shadow.camera.left = -d;
      dirLight.shadow.camera.right = d;
      dirLight.shadow.camera.top = d;
      dirLight.shadow.camera.bottom = -d;
      dirLight.shadow.bias = -0.0005;
      dirLight.shadow.normalBias = 0.02;
    }
    this.scene.add(dirLight);

    const ambient = new THREE.AmbientLight(0xfff7ed, 0.4);
    this.scene.add(ambient);
  }

  /**
   * Builds composite 3-12 part procedural Garuda student avatar
   */
  private buildProceduralPlayer(avatar: AvatarSettings) {
    this.playerGroup.position.set(0, 0, 0);
    this.playerGroup.rotation.y = Math.PI; // Face forward down the road

    // 1. Contact Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(1.6, 1.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.35,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.02;
    this.playerGroup.add(shadowMesh);

    // 2. Torso (Body) with Outfit
    const torsoGeo = new THREE.BoxGeometry(0.85, 1.0, 0.55);
    let torsoColor = 0xdc2626; // red (SD merah putih)
    if (avatar.outfit === 'pramuka') torsoColor = 0x78350f; // brown
    if (avatar.outfit === 'batik_nusantara') torsoColor = 0xb45309; // batik amber
    if (avatar.outfit === 'tenun_ikat') torsoColor = 0x047857; // emerald tenun

    const torsoMat = new THREE.MeshStandardMaterial({
      color: torsoColor,
      roughness: 0.6,
      metalness: 0.1
    });
    this.playerBodyMesh = new THREE.Mesh(torsoGeo, torsoMat);
    this.playerBodyMesh.position.y = 1.35;
    this.playerBodyMesh.castShadow = true;
    this.playerGroup.add(this.playerBodyMesh);

    // Shirt collar / chest accent
    const chestAccentGeo = new THREE.BoxGeometry(0.4, 0.4, 0.57);
    const chestAccentMat = new THREE.MeshStandardMaterial({
      color: avatar.outfit === 'sd_merah_putih' ? 0xffffff : 0xfde047,
      roughness: 0.5
    });
    const chestAccent = new THREE.Mesh(chestAccentGeo, chestAccentMat);
    chestAccent.position.set(0, 1.5, 0.01);
    this.playerGroup.add(chestAccent);

    // 3. Head & Face
    const headGeo = new THREE.BoxGeometry(0.7, 0.7, 0.65);
    const skinColor = parseInt(avatar.skinTone.replace('#', '0x'), 16) || 0xf8d9b5;
    const headMat = new THREE.MeshStandardMaterial({
      color: skinColor,
      roughness: 0.7,
      metalness: 0.05
    });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.position.set(0, 2.3, 0);
    headMesh.castShadow = true;
    this.playerGroup.add(headMesh);

    // Eyes (Friendly cartoon eyes)
    const eyeGeo = new THREE.BoxGeometry(0.12, 0.12, 0.05);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.18, 2.34, 0.33);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.18, 2.34, 0.33);
    this.playerGroup.add(leftEye, rightEye);

    // Smile
    const smileGeo = new THREE.BoxGeometry(0.25, 0.06, 0.04);
    const smileMat = new THREE.MeshBasicMaterial({ color: 0x991b1b });
    const smileMesh = new THREE.Mesh(smileGeo, smileMat);
    smileMesh.position.set(0, 2.15, 0.33);
    this.playerGroup.add(smileMesh);

    // 4. Headwear Group
    this.playerHeadwearGroup = new THREE.Group();
    this.setupHeadwear(avatar.headwear);
    this.playerHeadwearGroup.position.set(0, 2.65, 0);
    this.playerGroup.add(this.playerHeadwearGroup);

    // 5. Limbs (Arms & Legs)
    const legGeo = new THREE.BoxGeometry(0.28, 0.75, 0.32);
    const pantsColor = avatar.outfit === 'sd_merah_putih' ? 0xdc2626 : 0x451a03;
    const legMat = new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.7 });

    this.leftLeg = new THREE.Mesh(legGeo, legMat);
    this.leftLeg.position.set(-0.24, 0.45, 0);
    this.leftLeg.castShadow = true;

    this.rightLeg = new THREE.Mesh(legGeo, legMat);
    this.rightLeg.position.set(0.24, 0.45, 0);
    this.rightLeg.castShadow = true;

    this.playerGroup.add(this.leftLeg, this.rightLeg);

    const armGeo = new THREE.BoxGeometry(0.22, 0.7, 0.22);
    const armMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.6 });

    this.leftArm = new THREE.Mesh(armGeo, armMat);
    this.leftArm.position.set(-0.58, 1.35, 0);
    this.leftArm.castShadow = true;

    this.rightArm = new THREE.Mesh(armGeo, armMat);
    this.rightArm.position.set(0.58, 1.35, 0);
    this.rightArm.castShadow = true;

    this.playerGroup.add(this.leftArm, this.rightArm);

    // 6. Wings (Garuda Emas golden wings on back)
    this.wingsGroup = new THREE.Group();
    const wingGeo = new THREE.BoxGeometry(0.85, 0.35, 0.08);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.65,
      roughness: 0.25,
      emissive: 0x78350f,
      emissiveIntensity: 0.2
    });
    const leftWing = new THREE.Mesh(wingGeo, wingMat);
    leftWing.position.set(-0.7, 1.6, -0.32);
    leftWing.rotation.z = 0.3;
    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.position.set(0.7, 1.6, -0.32);
    rightWing.rotation.z = -0.3;

    this.wingsGroup.add(leftWing, rightWing);
    this.playerGroup.add(this.wingsGroup);

    // 7. Accessories (Garuda Badge or Indonesian sash)
    this.playerAccessoryGroup = new THREE.Group();
    this.setupAccessory(avatar.accessory);
    this.playerGroup.add(this.playerAccessoryGroup);
  }

  private setupHeadwear(headwear: AvatarSettings['headwear']) {
    this.playerHeadwearGroup.clear();

    if (headwear === 'peci_nasional') {
      const peciGeo = new THREE.BoxGeometry(0.74, 0.32, 0.68);
      const peciMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
      const peci = new THREE.Mesh(peciGeo, peciMat);
      this.playerHeadwearGroup.add(peci);
    } else if (headwear === 'udeng_bali') {
      const bandGeo = new THREE.BoxGeometry(0.78, 0.2, 0.72);
      const bandMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.5 });
      const band = new THREE.Mesh(bandGeo, bandMat);

      // Gold crown fold on front
      const foldGeo = new THREE.ConeGeometry(0.2, 0.35, 4);
      const foldMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.6, roughness: 0.3 });
      const fold = new THREE.Mesh(foldGeo, foldMat);
      fold.position.set(0, 0.22, 0.3);
      fold.rotation.x = 0.2;

      this.playerHeadwearGroup.add(band, fold);
    } else if (headwear === 'blangkon_jawa') {
      const capGeo = new THREE.SphereGeometry(0.42, 8, 8);
      const capMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.scale.set(0.9, 0.5, 0.9);

      // Mondholan knot at back
      const knotGeo = new THREE.SphereGeometry(0.18, 6, 6);
      const knot = new THREE.Mesh(knotGeo, capMat);
      knot.position.set(0, -0.05, -0.38);

      this.playerHeadwearGroup.add(cap, knot);
    } else if (headwear === 'destar_minang') {
      const baseGeo = new THREE.BoxGeometry(0.8, 0.2, 0.7);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.5 });
      const base = new THREE.Mesh(baseGeo, baseMat);

      // Two horn points (Tanduk Minang)
      const hornGeo = new THREE.ConeGeometry(0.15, 0.45, 4);
      const hornMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.5, roughness: 0.3 });
      const leftHorn = new THREE.Mesh(hornGeo, hornMat);
      leftHorn.position.set(-0.35, 0.25, 0);
      leftHorn.rotation.z = 0.4;
      const rightHorn = new THREE.Mesh(hornGeo, hornMat);
      rightHorn.position.set(0.35, 0.25, 0);
      rightHorn.rotation.z = -0.4;

      this.playerHeadwearGroup.add(base, leftHorn, rightHorn);
    }
  }

  private setupAccessory(accessory: AvatarSettings['accessory']) {
    this.playerAccessoryGroup.clear();

    if (accessory === 'garuda_badge') {
      // Golden 5-point shield badge on chest
      const badgeGeo = new THREE.CylinderGeometry(0.12, 0.08, 0.04, 5);
      const badgeMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0xd97706,
        emissiveIntensity: 0.4
      });
      const badge = new THREE.Mesh(badgeGeo, badgeMat);
      badge.position.set(0.2, 1.45, 0.32);
      badge.rotation.x = Math.PI / 2;
      this.playerAccessoryGroup.add(badge);
    } else if (accessory === 'selempang_merah_putih') {
      // Diagonal sash
      const sashGeo = new THREE.BoxGeometry(0.18, 1.1, 0.6);
      const sashMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.6 });
      const sash = new THREE.Mesh(sashGeo, sashMat);
      sash.position.set(0, 1.35, 0.02);
      sash.rotation.z = 0.45;
      this.playerAccessoryGroup.add(sash);
    } else if (accessory === 'tas_noken') {
      // Traditional woven Papuan bag on shoulder
      const bagGeo = new THREE.BoxGeometry(0.35, 0.4, 0.15);
      const bagMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 });
      const bag = new THREE.Mesh(bagGeo, bagMat);
      bag.position.set(-0.48, 1.05, 0);
      this.playerAccessoryGroup.add(bag);
    }
  }

  public updateAvatar(avatar: AvatarSettings) {
    this.setupHeadwear(avatar.headwear);
    this.setupAccessory(avatar.accessory);
  }

  /**
   * Builds the vibrant Indonesian cultural road & environment
   */
  private buildWorldTerrain(level: LevelConfig) {
    this.trackGroup.clear();
    this.starsGroup.clear();
    this.obstaclesGroup.clear();
    this.checkpointGates = [];

    const trackLength = level.targetDistance + 100;

    // 0. Panoramic Horizon Backdrop using the uploaded Pancasila adventure illustration
    try {
      const texLoader = new THREE.TextureLoader();
      texLoader.load('/pancasila_board_bg.jpg', (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        const backdropGeo = new THREE.PlaneGeometry(180, 75);
        const backdropMat = new THREE.MeshBasicMaterial({
          map: tex,
          fog: false,
          depthWrite: false
        });
        const backdrop = new THREE.Mesh(backdropGeo, backdropMat);
        backdrop.position.set(0, 26, -trackLength - 20);
        this.trackGroup.add(backdrop);
      });
    } catch {
      // Fallback gracefully
    }

    // 1. Main Path / Jalan Nusantara (Width: 9 units, spanning 3 lanes at x = -2.8, 0, 2.8)
    const roadGeo = new THREE.PlaneGeometry(8.6, trackLength);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7, // Warm sandstone pavement
      roughness: 0.85,
      metalness: 0.05
    });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.position.set(0, 0, -trackLength / 2);
    roadMesh.receiveShadow = true;
    this.trackGroup.add(roadMesh);

    // Surrounding Grass / Landscape
    const grassGeo = new THREE.PlaneGeometry(120, trackLength);
    const grassColor = level.environmentTheme === 'valley' ? 0x86efac : 0x4ade80;
    const grassMat = new THREE.MeshStandardMaterial({
      color: grassColor,
      roughness: 0.9,
      metalness: 0.02
    });
    const grassMesh = new THREE.Mesh(grassGeo, grassMat);
    grassMesh.rotation.x = -Math.PI / 2;
    grassMesh.position.set(0, -0.04, -trackLength / 2);
    grassMesh.receiveShadow = true;
    this.trackGroup.add(grassMesh);

    // 2. Borders: Kerb stones & Padi / Kapas foliage
    this.buildRoadBorders(trackLength);

    // 3. Cultural Landmark Gates & Pohon Beringin along track
    this.buildSceneryProps(trackLength, level);

    // 4. Moral Dilemma Checkpoint Gates
    level.dilemmas.forEach((dilemma, idx) => {
      const zPos = -((idx + 1) * (level.targetDistance / (level.dilemmas.length + 1)));
      this.buildCheckpointGate(zPos, idx, dilemma.title, level.themeColor);
    });

    // 5. Stars & Collectibles (Bintang Pancasila)
    this.spawnCollectibles(level.targetDistance);

    // 6. Interactive Hurdles / Rintangan (batu loncatan, balok kayu rintangan)
    this.spawnObstacles(level.targetDistance);
  }

  private buildRoadBorders(trackLength: number) {
    const kerbGeo = new THREE.BoxGeometry(0.3, 0.25, 2.0);
    const kerbMatRed = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.7 });
    const kerbMatWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 });

    for (let z = 0; z > -trackLength; z -= 2.2) {
      const isRed = Math.floor(Math.abs(z) / 2.2) % 2 === 0;
      const mat = isRed ? kerbMatRed : kerbMatWhite;

      const leftKerb = new THREE.Mesh(kerbGeo, mat);
      leftKerb.position.set(-4.4, 0.12, z);
      leftKerb.receiveShadow = true;

      const rightKerb = new THREE.Mesh(kerbGeo, mat);
      rightKerb.position.set(4.4, 0.12, z);
      rightKerb.receiveShadow = true;

      this.trackGroup.add(leftKerb, rightKerb);
    }
  }

  private buildSceneryProps(trackLength: number, level: LevelConfig) {
    // Indonesian Gapura Candi Bentar (Gateway) at start
    this.createCandiGateway(0);

    // Repeat trees & traditional lanterns every 25 units
    for (let z = -25; z > -trackLength; z -= 25) {
      // Alternating Pohon Beringin / Palm trees
      const sideLeft = -7.5 - Math.random() * 4;
      const sideRight = 7.5 + Math.random() * 4;

      this.createPohonBeringin(sideLeft, z);
      this.createPohonBeringin(sideRight, z - 8);

      // Traditional Umbul-Umbul (Indonesian decorative flag)
      if (Math.abs(z) % 50 === 0) {
        this.createUmbulUmbul(-4.8, z);
        this.createUmbulUmbul(4.8, z);
      }
    }

    // End Finish Gate
    this.createFinishMonument(-level.targetDistance, level.themeColor);
  }

  private createCandiGateway(z: number) {
    const gateGroup = new THREE.Group();
    gateGroup.position.set(0, 0, z);

    // Split stone pillars (Candi Bentar Bali/Jawa)
    const pillarGeo = new THREE.BoxGeometry(1.2, 5.5, 1.2);
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.8 });

    const leftPillar = new THREE.Mesh(pillarGeo, pillarMat);
    leftPillar.position.set(-4.8, 2.75, 0);
    leftPillar.castShadow = true;

    const rightPillar = new THREE.Mesh(pillarGeo, pillarMat);
    rightPillar.position.set(4.8, 2.75, 0);
    rightPillar.castShadow = true;

    // Stepped tops
    const topGeo = new THREE.ConeGeometry(1.0, 1.8, 4);
    const topMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
    const leftTop = new THREE.Mesh(topGeo, topMat);
    leftTop.position.set(-4.8, 6.0, 0);
    leftTop.rotation.y = Math.PI / 4;

    const rightTop = new THREE.Mesh(topGeo, topMat);
    rightTop.position.set(4.8, 6.0, 0);
    rightTop.rotation.y = Math.PI / 4;

    gateGroup.add(leftPillar, rightPillar, leftTop, rightTop);
    this.trackGroup.add(gateGroup);
  }

  private createPohonBeringin(x: number, z: number) {
    const tree = new THREE.Group();
    tree.position.set(x, 0, z);

    // Thick gnarled trunk
    const trunkGeo = new THREE.CylinderGeometry(0.7, 1.2, 4.5, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x573416, roughness: 0.9 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 2.25;
    trunk.castShadow = true;
    tree.add(trunk);

    // Multi-tier lush green canopy
    const canopyMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.7,
      metalness: 0.05
    });

    const tier1Geo = new THREE.SphereGeometry(2.8, 7, 7);
    const tier1 = new THREE.Mesh(tier1Geo, canopyMat);
    tier1.position.y = 4.8;
    tier1.castShadow = true;

    const tier2Geo = new THREE.SphereGeometry(2.0, 6, 6);
    const tier2 = new THREE.Mesh(tier2Geo, canopyMat);
    tier2.position.set(0.6, 6.2, 0.4);
    tier2.castShadow = true;

    // Aerial roots hanging down
    const rootGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.5, 4);
    const rootMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
    const root1 = new THREE.Mesh(rootGeo, rootMat);
    root1.position.set(-1.4, 3.2, 0.8);
    const root2 = new THREE.Mesh(rootGeo, rootMat);
    root2.position.set(1.5, 3.2, -0.6);

    tree.add(tier1, tier2, root1, root2);
    this.trackGroup.add(tree);
  }

  private createUmbulUmbul(x: number, z: number) {
    const flag = new THREE.Group();
    flag.position.set(x, 0, z);

    // Bamboo pole
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.1, 7.0, 5);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0xa16207, roughness: 0.7 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = 3.5;
    flag.add(pole);

    // Flowing red & white banner
    const bannerGeo = new THREE.BoxGeometry(0.04, 3.2, 0.9);
    const bannerMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.6 });
    const banner = new THREE.Mesh(bannerGeo, bannerMat);
    banner.position.set(0, 4.8, 0.5);
    flag.add(banner);

    this.trackGroup.add(flag);
  }

  private buildCheckpointGate(z: number, dilemmaIndex: number, title: string, colorHex: string) {
    const gate = new THREE.Group();
    gate.position.set(0, 0, z);
    gate.userData = { dilemmaIndex, triggered: false };

    // Archway crossbar
    const barGeo = new THREE.BoxGeometry(9.6, 0.8, 0.8);
    const barMat = new THREE.MeshStandardMaterial({
      color: parseInt(colorHex.replace('#', '0x'), 16),
      metalness: 0.4,
      roughness: 0.3
    });
    const bar = new THREE.Mesh(barGeo, barMat);
    bar.position.set(0, 4.2, 0);

    // Archway pillars
    const pilGeo = new THREE.BoxGeometry(0.8, 4.5, 0.8);
    const leftPil = new THREE.Mesh(pilGeo, barMat);
    leftPil.position.set(-4.4, 2.25, 0);
    const rightPil = new THREE.Mesh(pilGeo, barMat);
    rightPil.position.set(4.4, 2.25, 0);

    // Glowing Pancasila Star in center of archway
    const starGeo = new THREE.OctahedronGeometry(0.8, 0);
    const starMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8
    });
    const starCenter = new THREE.Mesh(starGeo, starMat);
    starCenter.position.set(0, 4.2, 0.4);

    gate.add(bar, leftPil, rightPil, starCenter);
    this.checkpointGates.push(gate);
    this.trackGroup.add(gate);
  }

  private createFinishMonument(z: number, colorHex: string) {
    const finish = new THREE.Group();
    finish.position.set(0, 0, z);

    // Grand Indonesian Garuda Monument Gate
    const archGeo = new THREE.BoxGeometry(10.5, 1.2, 1.2);
    const archMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.8,
      roughness: 0.2
    });
    const arch = new THREE.Mesh(archGeo, archMat);
    arch.position.set(0, 5.0, 0);

    const pillarGeo = new THREE.BoxGeometry(1.2, 5.5, 1.2);
    const p1 = new THREE.Mesh(pillarGeo, archMat);
    p1.position.set(-4.5, 2.75, 0);
    const p2 = new THREE.Mesh(pillarGeo, archMat);
    p2.position.set(4.5, 2.75, 0);

    // Large glowing Garuda shield symbol
    const shieldGeo = new THREE.CylinderGeometry(1.5, 1.0, 0.4, 5);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xd97706,
      emissiveIntensity: 0.6,
      metalness: 0.7
    });
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    shield.position.set(0, 5.2, 0.6);
    shield.rotation.x = Math.PI / 2;

    finish.add(arch, p1, p2, shield);
    this.trackGroup.add(finish);
  }

  private spawnCollectibles(targetDistance: number) {
    // 3D Bintang Pancasila floating along lanes
    const starGeo = new THREE.OctahedronGeometry(0.38, 0);
    const starMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.5
    });

    const lanes = [-2.8, 0, 2.8];
    let starIdx = 0;

    for (let z = -12; z > -targetDistance + 15; z -= 14) {
      const lane = lanes[Math.floor(Math.abs(z / 14)) % lanes.length];
      const star = new THREE.Mesh(starGeo, starMat);
      star.position.set(lane, 1.2, z);
      star.userData = { starIndex: starIdx++, collected: false };
      this.starsGroup.add(star);
    }
  }

  // Invulnerability timer
  private invulnerableTimer: number = 0;

  private spawnObstacles(targetDistance: number) {
    // Obstacles to jump over or switch lanes: Stone barriers or wooden hurdles
    const stoneGeo = new THREE.BoxGeometry(1.4, 0.7, 0.9);
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x78716c,
      roughness: 0.9,
      metalness: 0.1
    });

    const logGeo = new THREE.CylinderGeometry(0.4, 0.4, 2.4, 6);
    const logMat = new THREE.MeshStandardMaterial({
      color: 0x854d0e,
      roughness: 0.8
    });

    const lanes = [-2.8, 0, 2.8];

    // Start obstacles safely after z = -75 so the player has an open starting path
    for (let z = -75; z > -targetDistance + 25; z -= 38) {
      // Don't spawn obstacle too close to checkpoints
      const isNearGate = this.checkpointGates.some(g => Math.abs(g.position.z - z) < 15);
      if (isNearGate) continue;

      const lane = lanes[Math.floor(Math.abs(z / 38)) % lanes.length];
      const isStone = Math.abs(z) % 2 === 0;

      if (isStone) {
        const stone = new THREE.Mesh(stoneGeo, stoneMat);
        stone.position.set(lane, 0.35, z);
        stone.castShadow = true;
        stone.userData = { isObstacle: true };
        this.obstaclesGroup.add(stone);
      } else {
        const log = new THREE.Mesh(logGeo, logMat);
        log.position.set(lane, 0.4, z);
        log.rotation.z = Math.PI / 2;
        log.castShadow = true;
        log.userData = { isObstacle: true };
        this.obstaclesGroup.add(log);
      }
    }
  }

  private bindInputs() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
  }

  private unbindInputs() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (this.isPaused) return;

    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      this.moveLeft();
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      this.moveRight();
    } else if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      this.jump();
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.keysHeld[e.code] = false;
  };

  private onBlur = () => {
    this.keysHeld = {};
  };

  public moveLeft() {
    if (this.playerLane > -1) {
      this.playerLane--;
      this.targetPlayerX = this.playerLane * 2.8;
    }
  }

  public moveRight() {
    if (this.playerLane < 1) {
      this.playerLane++;
      this.targetPlayerX = this.playerLane * 2.8;
    }
  }

  public jump() {
    if (this.isGrounded && !this.isPaused) {
      this.playerVelocityY = 14.5;
      this.isGrounded = false;
    }
  }

  public pause() {
    this.isPaused = true;
  }

  public resume() {
    this.isPaused = false;
    this.clock.getDelta(); // flush delta
  }

  private onResize = () => {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private tick = () => {
    this.animationFrameId = requestAnimationFrame(this.tick);

    const rawDt = this.clock.getDelta();
    const dt = Math.min(rawDt, 0.05);

    if (!this.isPaused) {
      this.updatePhysics(dt);
      this.updateAnimations(dt);
      this.checkCollisions();
    }

    this.renderer.render(this.scene, this.camera);
  };

  private updatePhysics(dt: number) {
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= dt;
    }

    // 1. Forward progression
    this.playerZ -= this.runSpeed * dt;
    this.distanceTraveled = Math.abs(this.playerZ);
    this.callbacks.onProgressDistance(Math.floor(this.distanceTraveled), this.targetDistance);

    // Check finish level
    if (this.distanceTraveled >= this.targetDistance) {
      this.pause();
      this.callbacks.onLevelComplete();
      return;
    }

    // 2. Lateral lane damp
    const curX = this.playerGroup.position.x;
    this.playerGroup.position.x = THREE.MathUtils.damp(curX, this.targetPlayerX, 14, dt);

    // 3. Vertical jump physics
    if (!this.isGrounded) {
      this.playerVelocityY -= 36 * dt; // Gravity
      this.playerY += this.playerVelocityY * dt;

      if (this.playerY <= 0) {
        this.playerY = 0;
        this.playerVelocityY = 0;
        this.isGrounded = true;
      }
    }
    this.playerGroup.position.y = this.playerY;
    this.playerGroup.position.z = this.playerZ;

    // 4. Smooth camera chase behind player
    const targetCamX = this.playerGroup.position.x * 0.35;
    const targetCamY = this.playerY * 0.4 + 4.8;
    const targetCamZ = this.playerZ + 8.5;

    this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, targetCamX, 8, dt);
    this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, targetCamY, 8, dt);
    this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, targetCamZ, 12, dt);
    this.camera.lookAt(targetCamX * 0.5, this.playerY * 0.5 + 1.8, this.playerZ - 8);
  }

  private updateAnimations(dt: number) {
    const runCycle = Date.now() * 0.012;

    // Leg swings
    if (this.isGrounded) {
      this.leftLeg.rotation.x = Math.sin(runCycle) * 0.65;
      this.rightLeg.rotation.x = -Math.sin(runCycle) * 0.65;
      this.leftArm.rotation.x = -Math.sin(runCycle) * 0.5;
      this.rightArm.rotation.x = Math.sin(runCycle) * 0.5;
    } else {
      // In air jump pose
      this.leftLeg.rotation.x = -0.4;
      this.rightLeg.rotation.x = 0.5;
      this.leftArm.rotation.x = 0.8;
      this.rightArm.rotation.x = 0.8;
    }

    // Wings gentle flutter
    if (this.wingsGroup) {
      this.wingsGroup.rotation.y = Math.sin(runCycle * 1.5) * 0.15;
    }

    // Star rotation
    this.starsGroup.children.forEach(star => {
      star.rotation.y += 2.5 * dt;
      star.rotation.x += 1.2 * dt;
    });
  }

  private checkCollisions() {
    const px = this.playerGroup.position.x;
    const py = this.playerGroup.position.y;
    const pz = this.playerGroup.position.z;

    // 1. Stars collection
    this.starsGroup.children.forEach(starMesh => {
      const star = starMesh as THREE.Mesh;
      if (star.userData.collected) return;

      const dx = Math.abs(star.position.x - px);
      const dy = Math.abs(star.position.y - py - 1.2);
      const dz = Math.abs(star.position.z - pz);

      if (dx < 1.1 && dy < 1.5 && dz < 1.4) {
        star.userData.collected = true;
        star.visible = false;
        this.starsCount++;
        this.callbacks.onStarCollect(this.starsCount);
      }
    });

    // 2. Moral Dilemma Checkpoint Gates
    this.checkpointGates.forEach(gate => {
      if (gate.userData.triggered) return;
      if (pz <= gate.position.z + 1.0) {
        gate.userData.triggered = true;
        this.pause();
        this.callbacks.onReachDilemma(gate.userData.dilemmaIndex);
      }
    });

    // 3. Obstacles collision (causes temporary slowdown / stumble if hit without jumping)
    if (this.invulnerableTimer <= 0) {
      this.obstaclesGroup.children.forEach(obsMesh => {
        const dx = Math.abs(obsMesh.position.x - px);
        const dy = py; // player height off ground
        const dz = Math.abs(obsMesh.position.z - pz);

        if (dx < 1.1 && dz < 1.2 && dy < 0.6) {
          // Player hit obstacle: brief stumble without locking movement
          this.invulnerableTimer = 1.2;
          this.callbacks.onPlayerHitObstacle();
        }
      });
    }
  }

  public dispose() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.unbindInputs();
    window.removeEventListener('resize', this.onResize);

    // Dispose geometries & materials
    this.scene.traverse(obj => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose());
        } else if (mesh.material) {
          mesh.material.dispose();
        }
      }
    });

    if (this.renderer.domElement && this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
