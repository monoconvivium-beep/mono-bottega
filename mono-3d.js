import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";

const canvas = document.querySelector("#monoScene");
const chips = [...document.querySelectorAll("[data-scene-target]")];

if (canvas) {
  const colors = {
    anthracite: 0x262321,
    cashmere: 0xf4ecdd,
    butter: 0xefe3c6,
    terracotta: 0xb85c38,
    coral: 0xe27a60,
    olive: 0x6e6a3c,
    champagne: 0xcba75a
  };

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(colors.anthracite, 8, 22);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 4.2, 9);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const pointer = new THREE.Vector2();
  const targetTilt = new THREE.Vector2();
  let activeTarget = "gastronomia";

  const table = new THREE.Group();
  scene.add(table);

  const tableTop = new THREE.Mesh(
    new THREE.CylinderGeometry(3.8, 4.15, 0.28, 96),
    new THREE.MeshStandardMaterial({
      color: colors.cashmere,
      roughness: 0.48,
      metalness: 0.05
    })
  );
  tableTop.position.y = -0.2;
  table.add(tableTop);

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(3.95, 0.045, 12, 120),
    new THREE.MeshStandardMaterial({ color: colors.champagne, roughness: 0.34, metalness: 0.45 })
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = -0.03;
  table.add(rim);

  const centerPlate = new THREE.Mesh(
    new THREE.CylinderGeometry(1.18, 1.3, 0.16, 96),
    new THREE.MeshStandardMaterial({ color: colors.warmButter, roughness: 0.6 })
  );
  centerPlate.position.y = 0.08;
  table.add(centerPlate);

  const centerMark = new THREE.Mesh(
    new THREE.TorusGeometry(0.72, 0.025, 10, 80),
    new THREE.MeshStandardMaterial({ color: colors.anthracite, roughness: 0.4 })
  );
  centerMark.rotation.x = Math.PI / 2;
  centerMark.position.y = 0.18;
  table.add(centerMark);

  const worlds = [
    {
      id: "gastronomia",
      label: "Gastronomia",
      color: colors.terracotta,
      angle: -0.45,
      href: "#prodotti",
      geometry: new THREE.BoxGeometry(0.9, 0.42, 0.9)
    },
    {
      id: "pasticceria",
      label: "Pasticceria",
      color: colors.coral,
      angle: 1.1,
      href: "#prodotti",
      geometry: new THREE.SphereGeometry(0.48, 32, 24)
    },
    {
      id: "bistrot",
      label: "Bistrot",
      color: colors.olive,
      angle: 2.65,
      href: "#prodotti",
      geometry: new THREE.CapsuleGeometry(0.34, 0.74, 12, 24)
    },
    {
      id: "fedelta",
      label: "Fedelta",
      color: colors.champagne,
      angle: 4.2,
      href: "https://mono-app-jet.vercel.app/home",
      geometry: new THREE.CylinderGeometry(0.48, 0.48, 0.2, 6)
    }
  ];

  const objects = worlds.map((world) => {
    const group = new THREE.Group();
    const radius = 2.5;
    group.position.set(Math.cos(world.angle) * radius, 0.32, Math.sin(world.angle) * radius);

    const mesh = new THREE.Mesh(
      world.geometry,
      new THREE.MeshStandardMaterial({
        color: world.color,
        roughness: 0.32,
        metalness: 0.12
      })
    );
    mesh.castShadow = true;
    mesh.userData = world;
    group.add(mesh);

    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.72, 0.018, 8, 64),
      new THREE.MeshBasicMaterial({ color: world.color, transparent: true, opacity: 0.72 })
    );
    halo.rotation.x = Math.PI / 2;
    halo.position.y = -0.27;
    group.add(halo);

    table.add(group);
    return { ...world, group, mesh, halo };
  });

  const lightRig = new THREE.Group();
  lightRig.add(new THREE.AmbientLight(colors.cashmere, 1.6));

  const keyLight = new THREE.DirectionalLight(colors.butter, 2.8);
  keyLight.position.set(-4, 7, 5);
  lightRig.add(keyLight);

  const warmLight = new THREE.PointLight(colors.champagne, 2.4, 10);
  warmLight.position.set(3.8, 2.4, 3.2);
  lightRig.add(warmLight);
  scene.add(lightRig);

  const particles = new THREE.Points(
    new THREE.BufferGeometry(),
    new THREE.PointsMaterial({
      color: colors.champagne,
      size: 0.025,
      transparent: true,
      opacity: 0.5
    })
  );
  const particlePositions = [];
  for (let i = 0; i < 220; i += 1) {
    particlePositions.push((Math.random() - 0.5) * 13, Math.random() * 6 - 0.8, (Math.random() - 0.5) * 11);
  }
  particles.geometry.setAttribute("position", new THREE.Float32BufferAttribute(particlePositions, 3));
  scene.add(particles);

  const raycaster = new THREE.Raycaster();

  function resize() {
    const rect = canvas.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / Math.max(rect.height, 1);
    camera.updateProjectionMatrix();
  }

  function setActive(target) {
    activeTarget = target;
    chips.forEach((chip) => chip.classList.toggle("active", chip.dataset.sceneTarget === target));
    objects.forEach((object) => {
      const isActive = object.id === target;
      object.mesh.scale.setScalar(isActive ? 1.22 : 1);
      object.halo.material.opacity = isActive ? 1 : 0.45;
    });
  }

  function pickObject(event, shouldNavigate) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    raycaster.setFromCamera(pointer, camera);

    const hit = raycaster.intersectObjects(objects.map((object) => object.mesh))[0];
    canvas.classList.toggle("is-pointing", Boolean(hit));

    if (hit) {
      setActive(hit.object.userData.id);
      if (shouldNavigate) {
        window.location.href = hit.object.userData.href;
      }
    }
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    targetTilt.x = ((event.clientX - rect.left) / rect.width - 0.5) * 0.5;
    targetTilt.y = ((event.clientY - rect.top) / rect.height - 0.5) * 0.32;
    pickObject(event, false);
  });
  canvas.addEventListener("click", (event) => pickObject(event, true));

  chips.forEach((chip) => {
    chip.addEventListener("click", () => setActive(chip.dataset.sceneTarget));
  });

  function animate(time) {
    const elapsed = time * 0.001;
    table.rotation.y += 0.0022;
    table.rotation.x += (targetTilt.y - table.rotation.x) * 0.03;
    table.rotation.z += (-targetTilt.x - table.rotation.z) * 0.03;

    objects.forEach((object, index) => {
      object.mesh.rotation.x = elapsed * 0.45 + index;
      object.mesh.rotation.y = elapsed * 0.62 + index * 0.5;
      object.group.position.y = 0.32 + Math.sin(elapsed * 1.4 + index) * 0.08;
      object.halo.rotation.z = elapsed * 0.45;
    });

    particles.rotation.y = elapsed * 0.025;
    lightRig.rotation.y = Math.sin(elapsed * 0.4) * 0.18;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  resize();
  setActive(activeTarget);
  requestAnimationFrame(animate);
}
