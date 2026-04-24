// Importamos Three.js (CDN)
import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';
import { PointerLockControls } from 'https://unpkg.com/three@0.128.0/examples/jsm/controls/PointerLockControls.js';

// Variables globales
let camera, scene, renderer, controls;
let settings;

// Inicializar
init();
animate();

function init() {
    // 1. Cargar configuración del Menú (localStorage)
    settings = loadSettings();
    console.log("Configuración cargada en el juego:", settings);

    // 2. Escena básica
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.15); // Niebla densa

    // 3. Cámara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // 4. Luces
    const light = new THREE.PointLight(0xffffff, 0.5, 10); // Linterna del jugador
    light.position.set(0, 0, 0);
    camera.add(light);
    scene.add(camera);

    // 5. Controles (PointerLock - El ratón desaparece)
    controls = new PointerLockControls(camera, document.body);
    
    // APLICAR LA SENSIBILIDAD DEL MENÚ
    // PointerLockControls no tiene sensibilidad directa, modificamos la rotación manualmente si es necesario,
    // o usamos el movimiento de la cámara. Para simplificar, asumimos que el usuario tiene configuración global,
    // pero si quisiéramos controlar la sensibilidad de look, necesitaríamos un control personalizado.
    // Por ahora, activamos el lock.
    
    document.body.addEventListener('click', () => {
        controls.lock();
    });

    // 6. Renderizador
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 7. Crear entorno (Usando la textura procedural del common.js)
    // Nota: common.js debe estar cargado antes en el HTML
    const texture = createWallTexture();
    
    const geo = new THREE.BoxGeometry(20, 5, 1);
    const mat = new THREE.MeshStandardMaterial({ map: texture });
    
    // Pared de prueba
    const wall = new THREE.Mesh(geo, mat);
    wall.position.set(0, 0, -10);
    scene.add(wall);
    
    const floorGeo = new THREE.PlaneGeometry(100, 100);
    const floorMat = new THREE.MeshStandardMaterial({ map: texture, color: 0x222222 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.5;
    scene.add(floor);

    // Ajustar ventana
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// FUNCIÓN PARA PASAR DE NIVEL
// Se llamará cuando el jugador cumpla el objetivo
function levelCompleted() {
    // Obtener el número del nivel actual de la URL
    const currentUrl = window.location.pathname;
    const match = currentUrl.match(/level(\d)\.html/);
    
    if (match) {
        const currentLevelNum = parseInt(match[1]);
        const nextLevelNum = currentLevelNum + 1;

        if (nextLevelNum <= 7) {
            // Redirigir al siguiente nivel
            window.location.href = `level${nextLevelNum}.html`;
        } else {
            // Juego terminado
            alert("¡Has escapado!");
            window.location.href = "../index.html";
        }
    }
}
