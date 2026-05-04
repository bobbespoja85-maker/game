// game/game.js (LIMPIO Y CENTRADO EN RENDERIZADO)

// --- VARIABLES GLOBALES ---
let camera, scene, renderer, controls;
let prevTime = performance.now();
let walls = []; 
let goalObject = null; 
let settings;

// --- INICIALIZACIÓN ---
function init() {
    settings = loadSettings();

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.02); 

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 0; 
    window.camera = camera; 

    // Luz
    const ambient = new THREE.AmbientLight(0x555555); 
    scene.add(ambient);

    const flashlight = new THREE.PointLight(0xffffff, 1.5, 20);
    flashlight.position.set(0, 0, 0);
    camera.add(flashlight);
    scene.add(camera);

    // --- CONTROLES VISUALES (Mouse) ---
    controls = new THREE.PointerLockControls(camera, document.body);

    controls.addEventListener('lock', () => {
        const msg = document.getElementById('message');
        if (msg) msg.style.display = 'none';
    });

    controls.addEventListener('unlock', () => {
        const msg = document.getElementById('message');
        if (msg) msg.style.display = 'block';
    });

    document.body.addEventListener('click', () => {
        controls.lock();
    });

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);

    setupEnvironment();

    // Iniciar controles de teclado (del nuevo archivo)
    initControls();

    setTimeout(() => {
        if (window.startLevelLogic) {
            window.startLevelLogic(scene, walls, camera);
        }
    }, 100);
}

function setupEnvironment() {
    const floorCanvas = getFloorCanvas();
    const floorTex = new THREE.CanvasTexture(floorCanvas);
    const floorGeo = new THREE.PlaneGeometry(200, 200);
    
    const floorMat = new THREE.MeshStandardMaterial({ 
        map: floorTex, 
        roughness: 0.5, 
        color: 0x888888 
    });
    
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.5;
    scene.add(floor);

    const ceil = new THREE.Mesh(floorGeo, new THREE.MeshStandardMaterial({ color: 0x222222 }));
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = 2.5;
    scene.add(ceil);
}

function checkGoal() {
    if (goalObject) {
        const dist = camera.position.distanceTo(goalObject.position);
        if (dist < 3) if (window.levelWin) window.levelWin();
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// --- BUCLE PRINCIPAL ---
function animate() {
    requestAnimationFrame(animate);
    const time = performance.now();
    const delta = (time - prevTime) / 1000;

    if (controls.isLocked === true) {
        // 1. ACTUALIZAR MOVIMIENTO (Llamada al nuevo archivo controls.js)
        updateControls(delta, camera, controls, walls);
        
        // 2. Chequear Objetivo
        checkGoal();

        // 3. ACTUALIZAR ENTIDAD/PUERTAS
        if (window.updateEntity) {
            window.updateEntity(delta, camera.position);
        }
    }
    
    prevTime = time;
    renderer.render(scene, camera);
}

init();
animate();
