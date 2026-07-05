import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";

const canvas = document.querySelector("#monoScene");
const controls = [...document.querySelectorAll("[data-scene-target]")];
const hotspots = [...document.querySelectorAll("[data-hotspot]")];

const palette = {
  anthracite: 0x262321,
  cashmere: 0xf4ecdd,
  butter: 0xefe3c6,
  terracotta: 0xb85c38,
  coral: 0xe27a60,
  olive: 0x6e6a3c,
  champagne: 0xcba75a
};

const worldData = [
  {
    id: "gastronomia",
    color: palette.terracotta,
    angle: -0.25,
    filter: "gastronomia",
    href: "#prodotti"
  },
  {
    id: "pasticceria",
    color: palette.coral,
    angle: 1.2,
    filter: "pasticceria",
    href: "#prodotti"
  },
  {
    id: "bistrot",
    color: palette.olive,
    angle: 2.7,
    filter: "bistrot",
    href: "#prodotti"
  },
  {
    id: "fedelta",
    color: palette.champagne,
    angle: 4.25,
    filter: null,
    href: "https://mono-app-jet.vercel.app/home"
  }
];

if (canvas) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(palette.anthracite, 0.038);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
  camera.position.set(0.35, 4.6, 9.4);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const root = new THREE.Group();
  root.position.set(1.85, -0.45, 0);
  scene.add(root);

  const clock = new THREE.Clock();
  const pointer = new THREE.Vector2();
  const tiltTarget = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const clickTargets = [];
  const worldGroups = new Map();
  let activeWorld = "gastronomia";

  const material = {
    table: new THREE.MeshStandardMaterial({ color: palette.cashmere, roughness: 0.52, metalness: 0.04 }),
    butter: new THREE.MeshStandardMaterial({ color: palette.butter, roughness: 0.68, metalness: 0.02 }),
    ink: new THREE.MeshStandardMaterial({ color: palette.anthracite, roughness: 0.42, metalness: 0.12 }),
    gold: new THREE.MeshStandardMaterial({ color: palette.champagne, roughness: 0.32, metalness: 0.52 })
  };

  scene.add(new THREE.HemisphereLight(palette.cashmere, palette.anthracite, 1.2));

  const key = new THREE.DirectionalLight(palette.butter, 3.8);
  key.position.set(-4.2, 7.8, 5.8);
  key.castShadow = true;
  key.shadow.mapSize.width = 1024;
  key.shadow.mapSize.height = 1024;
  scene.add(key);

  const rimLight = new THREE.PointLight(palette.champagne, 3.2, 13);
  rimLight.position.set(4.4, 3.2, 3.4);
  scene.add(rimLight);

  const table = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.85, 0.22, 128), material.table);
  table.receiveShadow = true;
  root.add(table);

  const tableRim = new THREE.Mesh(new THREE.TorusGeometry(4.62, 0.035, 12, 128), material.gold);
  tableRim.rotation.x = Math.PI / 2;
  tableRim.position.y = 0.15;
  root.add(tableRim);

  const center = new THREE.Mesh(new THREE.CylinderGeometry(1.28, 1.42, 0.12, 96), material.butter);
  center.position.y = 0.2;
  center.castShadow = true;
  root.add(center);

  const monoRing = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.018, 12, 96), material.ink);
  monoRing.rotation.x = Math.PI / 2;
  monoRing.position.y = 0.285;
  root.add(monoRing);

  function createWorldMaterial(color, roughness = 0.36) {
    return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.08 });
  }

  function addMesh(group, mesh, position, rotation = [0, 0, 0]) {
    mesh.position.set(position[0], position[1], position[2]);
    mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    clickTargets.push(mesh);
    return mesh;
  }

  function createGastronomia(group, world) {
    const m = createWorldMaterial(world.color);
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.96, 0.08, 64), material.butter);
    addMesh(group, plate, [0, 0.09, 0]);
    addMesh(group, new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.22, 0.72), m), [0, 0.28, 0], [0, 0.18, 0]);
    addMesh(group, new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.05, 0.66), material.table), [0, 0.43, 0], [0, 0.18, 0]);
    addMesh(group, new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.035, 10, 48), m), [-0.48, 0.46, -0.22], [Math.PI / 2, 0, 0.4]);
    addMesh(group, new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.34, 32), material.gold), [0.62, 0.4, 0.18]);
  }

  function createPasticceria(group, world) {
    const m = createWorldMaterial(world.color);
    addMesh(group, new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.86, 0.08, 64), material.butter), [0, 0.09, 0]);
    addMesh(group, new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.5, 0.34, 64), m), [0, 0.36, 0]);
    addMesh(group, new THREE.Mesh(new THREE.SphereGeometry(0.18, 32, 16), material.gold), [-0.28, 0.62, 0.18]);
    addMesh(group, new THREE.Mesh(new THREE.SphereGeometry(0.16, 32, 16), m), [0.24, 0.64, -0.18]);
    addMesh(group, new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.026, 10, 64), material.ink), [0, 0.58, 0], [Math.PI / 2, 0, 0]);
  }

  function createBistrot(group, world) {
    const m = createWorldMaterial(world.color);
    addMesh(group, new THREE.Mesh(new THREE.CylinderGeometry(0.84, 0.9, 0.08, 64), material.butter), [0, 0.09, 0]);
    addMesh(group, new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.88, 12, 24), m), [-0.22, 0.4, 0], [0, 0, Math.PI / 2]);
    addMesh(group, new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.56, 12, 24), material.gold), [0.32, 0.38, -0.12], [0.2, 0, Math.PI / 2]);
    const glass = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.14, 0.78, 32, 1, true),
      new THREE.MeshPhysicalMaterial({
        color: palette.cashmere,
        roughness: 0.08,
        metalness: 0,
        transmission: 0.38,
        transparent: true,
        opacity: 0.42
      })
    );
    addMesh(group, glass, [0.62, 0.48, 0.28]);
  }

  function createFedelta(group, world) {
    const m = createWorldMaterial(world.color, 0.28);
    addMesh(group, new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.1, 0.72), m), [0, 0.26, 0], [0, -0.2, 0]);
    addMesh(group, new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.024, 8, 48), material.ink), [-0.28, 0.34, 0.02], [Math.PI / 2, 0, 0]);
    addMesh(group, new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.08, 48), material.gold), [0.38, 0.36, -0.16]);
    addMesh(group, new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 48), material.table), [0.58, 0.36, 0.06]);
  }

  const builders = {
    gastronomia: createGastronomia,
    pasticceria: createPasticceria,
    bistrot: createBistrot,
    fedelta: createFedelta
  };

  worldData.forEach((world) => {
    const group = new THREE.Group();
    const radius = 2.72;
    group.position.set(Math.cos(world.angle) * radius, 0.22, Math.sin(world.angle) * radius);
    group.rotation.y = -world.angle + 0.2;
    group.userData = world;

    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.95, 0.024, 8, 84),
      new THREE.MeshBasicMaterial({ color: world.color, transparent: true, opacity: 0.55 })
    );
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 0.06;
    group.add(halo);

    builders[world.id](group, world);
    group.traverse((child) => {
      if (child.isMesh) {
        child.userData.world = world;
      }
    });

    root.add(group);
    worldGroups.set(world.id, { group, halo, world });
  });

  const pointsGeometry = new THREE.BufferGeometry();
  const pointPositions = [];
  for (let i = 0; i < 260; i += 1) {
    pointPositions.push((Math.random() - 0.5) * 14, Math.random() * 6 - 0.6, (Math.random() - 0.5) * 11);
  }
  pointsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(pointPositions, 3));
  const points = new THREE.Points(
    pointsGeometry,
    new THREE.PointsMaterial({ color: palette.champagne, size: 0.018, transparent: true, opacity: 0.46 })
  );
  scene.add(points);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    const isCompact = rect.width < 760;
    root.position.x = isCompact ? 0.1 : 1.15;
    root.position.y = isCompact ? -0.04 : -0.24;
    root.scale.setScalar(isCompact ? 0.76 : 1.05);
    camera.position.set(isCompact ? 0.2 : 0.4, isCompact ? 5.2 : 4.9, isCompact ? 10.2 : 9);
    camera.lookAt(isCompact ? 0.1 : 1.25, 0.24, 0);
    camera.aspect = rect.width / Math.max(rect.height, 1);
    camera.updateProjectionMatrix();
  }

  function selectFilter(filter) {
    if (!filter) {
      return;
    }
    const button = document.querySelector(`[data-filter="${filter}"]`);
    if (button) {
      button.click();
    }
  }

  function navigateWorld(world) {
    setActive(world.id);
    selectFilter(world.filter);
    if (world.href.startsWith("#")) {
      document.querySelector(world.href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = world.href;
    }
  }

  function setActive(id) {
    activeWorld = id;
    controls.forEach((control) => control.classList.toggle("active", control.dataset.sceneTarget === id));
    worldGroups.forEach(({ group, halo }, key) => {
      const active = key === id;
      group.userData.targetScale = active ? 1.18 : 1;
      halo.material.opacity = active ? 0.92 : 0.38;
    });
  }

  function pick(clientX, clientY, navigate) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -(((clientY - rect.top) / rect.height) * 2 - 1);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(clickTargets, false)[0];
    canvas.classList.toggle("is-pointing", Boolean(hit));
    if (hit?.object?.userData?.world) {
      const world = hit.object.userData.world;
      setActive(world.id);
      if (navigate) {
        navigateWorld(world);
      }
    }
  }

  function updateHotspots() {
    const rect = canvas.getBoundingClientRect();
    hotspots.forEach((hotspot) => {
      const item = worldGroups.get(hotspot.dataset.hotspot);
      if (!item) {
        return;
      }
      const position = item.group.position.clone();
      root.localToWorld(position);
      position.y += 1.05;
      position.project(camera);
      const visible = position.z < 1;
      hotspot.style.left = `${(position.x * 0.5 + 0.5) * rect.width}px`;
      hotspot.style.top = `${(-position.y * 0.5 + 0.5) * rect.height}px`;
      hotspot.classList.toggle("is-visible", visible && item.world.id === activeWorld);
    });
  }

  window.addEventListener("resize", resize);

  window.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    tiltTarget.x = ((event.clientX - rect.left) / rect.width - 0.5) * 0.42;
    tiltTarget.y = ((event.clientY - rect.top) / rect.height - 0.5) * 0.28;
    pick(event.clientX, event.clientY, false);
  });

  canvas.addEventListener("click", (event) => pick(event.clientX, event.clientY, true));

  controls.forEach((control) => {
    control.addEventListener("click", () => {
      const world = worldData.find((item) => item.id === control.dataset.sceneTarget);
      if (world) {
        setActive(world.id);
        selectFilter(world.filter);
      }
    });
  });

  function animate() {
    const elapsed = clock.getElapsedTime();
    root.rotation.y += 0.0018;
    root.rotation.x += (tiltTarget.y - root.rotation.x) * 0.035;
    root.rotation.z += (-tiltTarget.x - root.rotation.z) * 0.035;

    worldGroups.forEach(({ group, halo }, id) => {
      const targetScale = group.userData.targetScale || 1;
      const pulse = id === activeWorld ? Math.sin(elapsed * 2.2) * 0.025 : 0;
      group.scale.lerp(new THREE.Vector3(targetScale + pulse, targetScale + pulse, targetScale + pulse), 0.08);
      group.position.y += (0.22 + Math.sin(elapsed * 1.15 + group.position.x) * 0.05 - group.position.y) * 0.08;
      halo.rotation.z = elapsed * 0.55;
    });

    points.rotation.y = elapsed * 0.018;
    rimLight.position.x = 4.2 + Math.sin(elapsed * 0.7) * 0.7;
    renderer.render(scene, camera);
    updateHotspots();
    requestAnimationFrame(animate);
  }

  resize();
  setActive(activeWorld);
  requestAnimationFrame(animate);
}
