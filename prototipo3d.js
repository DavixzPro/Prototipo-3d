let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / (window.innerHeight * 0.6),
  0.1,
  1000
);

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight * 0.6);
document.getElementById("container").appendChild(renderer.domElement);

// câmera
camera.position.set(5, 5, 8);
camera.lookAt(0, 0, 0);

// luz
let light = new THREE.PointLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

// =========================
// UI
// =========================
let freqInput = document.getElementById("freq");
let valueText = document.getElementById("value");
let status = document.getElementById("status");

let opacityInput = document.getElementById("opacity");
let opacityValue = document.getElementById("opacityValue");

// =========================
// TUBO
// =========================
let pipeGeometry = new THREE.CylinderGeometry(2, 2, 6, 32, 1, true);

let defaultPipeColor = 0x333333;

let pipeMaterial = new THREE.MeshStandardMaterial({
  color: defaultPipeColor,
  transparent: true,
  opacity: 1,
  side: THREE.DoubleSide
});

let pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);
scene.add(pipe);

// =========================
// JANELA TRANSPARENTE
// =========================
let windowGeometry = new THREE.CylinderGeometry(2.01, 2.01, 6, 32, 1, true, 0, Math.PI);

let windowMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ffff,
  transparent: true,
  opacity: 0.15,
  side: THREE.DoubleSide
});

let windowPart = new THREE.Mesh(windowGeometry, windowMaterial);
scene.add(windowPart);

// =========================
// CALCÁRIO
// =========================
let limeGeometry = new THREE.CylinderGeometry(1.9, 1.9, 6, 32, 1, true);

let limeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissive: 0x222222,
  side: THREE.DoubleSide
});

let lime = new THREE.Mesh(limeGeometry, limeMaterial);
scene.add(lime);

let limeHeight = 6;

// =========================
// RESÍDUO CONTROLADO
// =========================
let debrisHeight = 0.1;
let maxDebrisHeight = 1.2;

let debrisMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });

let debris = new THREE.Mesh(
  new THREE.CylinderGeometry(1.5, 1.5, debrisHeight, 32),
  debrisMaterial
);

debris.position.y = -3 + debrisHeight / 2;
scene.add(debris);

// =========================
// FERRAMENTA
// =========================
let toolGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
let toolMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffcc });

let tool = new THREE.Mesh(toolGeometry, toolMaterial);
tool.position.y = 4;
scene.add(tool);

// =========================
// EVENTOS
// =========================
let freq = 0;

freqInput.addEventListener("input", () => {
  freq = parseInt(freqInput.value);
  valueText.textContent = freq + " Hz";
});

opacityInput.addEventListener("input", () => {
  let value = opacityInput.value;
  let opacity = value / 100;

  pipe.material.opacity = opacity;
  opacityValue.textContent = value + "%";
});

// =========================
// ANIMAÇÃO
// =========================
function animate() {
  requestAnimationFrame(animate);

  // SEMPRE RESETA COR
  pipe.material.color.set(defaultPipeColor);

  if (freq > 0) {
    let intensity = Math.min(freq / 100, 0.3);

    tool.position.x = (Math.random() - 0.5) * intensity;
    tool.position.z = (Math.random() - 0.5) * intensity;

    // 🔴 RESSONÂNCIA
    if (freq >= 80 && freq <= 150) {
      status.textContent = "🚨 Ressonância!";
      pipe.material.color.set(0xff0000);
    }

    // 🟢 IDEAL
    else if (freq >= 50 && freq <= 300) {
      status.textContent = "✅ Removendo calcário";

      if (limeHeight > 0.2) {
        limeHeight -= 0.02;

        lime.geometry.dispose();
        lime.geometry = new THREE.CylinderGeometry(1.9, 1.9, limeHeight, 32, 1, true);

        lime.position.y = (limeHeight / 2) - 3;
      }

      if (debrisHeight < maxDebrisHeight) {
        debrisHeight += 0.01;

        debris.geometry.dispose();
        debris.geometry = new THREE.CylinderGeometry(1.5, 1.5, debrisHeight, 32);

        debris.position.y = -3 + debrisHeight / 2;
      }
    }

    // 🟡 OUTRO
    else {
      status.textContent = "⚠️ Fora da faixa ideal";
    }
  }

  renderer.render(scene, camera);
}

animate();