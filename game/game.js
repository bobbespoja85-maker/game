// Maneja el renderizado 3D, la escena, el entorno y el bucle del juego.

// --- VARIABLES GLOBALES ---
let camera, scene, renderer, controls;
let prevTime = performance.now();
let walls = []; // Array que guarda las paredes
let goalObject = null; 
let settings;

// --- INICIALIZACIÓN DEL MOTOR ---
function init() {
    // 1. Cargar configuración
    settings = loadSettings();

    // 2. Crear Escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.02); // Niebla tenue para ver lejos

    // 3. Crear Cámara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.6, 0); // Ojos a altura humana (1.6m)
    window.camera = camera; // Hacer global para que otros scripts la vean

    // 4. Iluminación
    const ambient = new THREE.AmbientLight(0x555555); // Luz base
    scene.add(ambient);

    const flashlight = new THREE.PointLight(0xffffff, 1.5, 20); // Linterna
    flashlight.position.set(0, 0, 0);
    camera.add(flashlight);
    scene.add(camera);

    // 5. Controles del Ratón (PointerLock)
    controls = new THREE.PointerLockControls(camera, document.body);

    // Eventos UI: Ocultar/Mostrar mensaje al bloquear/desbloquear
    controls.addEventListener('lock', () => {
        const msg = document.getElementById('message');
        if (msg) msg.style.display = 'none';
    });

    controls.addEventListener('unlock', () => {
        const msg = document.getElementById('message');
        if (msg) msg.style.display = 'block';
    });

    // Click para bloquear ratón
    document.body.addEventListener('click', () => {
        controls.lock();
    });

    // 6. Renderizador WebGL
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Listeners globales
    window.addEventListener('resize', onWindowResize);

    // 7. Configurar Entorno (Suelo, Techo)
    setupEnvironment();

    // 8. Iniciar Controles de Teclado (del archivo controls.js)
    initControls();

    // 9. Cargar Lógica del Nivel (con un pequeño retardo)
    setTimeout(() => {
        if (window.startLevelLogic) {
            window.startLevelLogic(scene, walls, camera);
        } else {
            console.warn("Error: startLevelLogic no definido en el HTML.");
        }
    }, 100);
}

// --- CONFIGURACIÓN DEL ENTORNO (Suelo y Techo) ---
function setupEnvironment() {
    // Textura procedimental (desde common.js)
    const floorCanvas = getFloorCanvas();
    const floorTex = new THREE.CanvasTexture(floorCanvas);
    const floorGeo = new THREE.PlaneGeometry(200, 200);
    
    // Material del suelo
    const floorMat = new THREE.MeshStandardMaterial({ 
        map: floorTex, 
        roughness: 0.5, 
        color: 0x888888 // Gris claro
    });
    
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0; // Suelo en Y = 0
    scene.add(floor);

    // Techo
    const ceil = new THREE.Mesh(floorGeo, new THREE.MeshStandardMaterial({ color: 0x222222 }));
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = 4; // Techo alto (Y = 4)
    scene.add(ceil);
}

// --- CHEQUEO DE OBJETIVO ---
function checkGoal() {
    if (goalObject) {
        const dist = camera.position.distanceTo(goalObject.position);
        if (dist < 3) {
            if (window.levelWin) window.levelWin();
        }
    }
}

// --- REDIMENSIONAR VENTANA ---
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// --- BUCLE PRINCIPAL (Game Loop) ---
function animate() {
    requestAnimationFrame(animate);
    
    const time = performance.now();
    const delta = (time - prevTime) / 1000; // Tiempo en segundos entre frames

    if (controls.isLocked === true) {
        // 1. Actualizar Movimiento y Colisiones
        updateControls(delta, camera, controls, walls);
        
        // 2. Chequear si llegamos a la meta
        checkGoal();

        // 3. Actualizar Entidad/Monstruo (si existe la función)
        if (window.updateEntity) {
            window.updateEntity(delta, camera.position);
        }
    }
    
    prevTime = time;
    renderer.render(scene, camera);
}

// Iniciar todo
init();
animate();
