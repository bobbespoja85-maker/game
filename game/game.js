// game/game.js (CORREGIDO)

// --- VARIABLES GLOBALES ---
let camera, scene, renderer, controls;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let prevTime = performance.now();
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let walls = []; // Array para colisiones
let goalObject = null; // Objeto para pasar de nivel
let settings;

// --- INICIALIZACIÓN ---
function init() {
    // 1. Cargar Configuración
    settings = loadSettings();

    // 2. Escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.05); // Niebla reducida para ver mejor

    // 3. Cámara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // 4. Luces (Linterna del jugador)
    const light = new THREE.PointLight(0xffffff, 1, 20);
    light.position.set(0, 0, 0); 
    camera.add(light);
    
    const ambient = new THREE.AmbientLight(0x404040); // Luz ambiental para no ver todo negro
    scene.add(ambient);
    scene.add(camera);

    // 5. Controles (Usamos la librería global THREE)
    controls = new THREE.PointerLockControls(camera, document.body);
    
    // Click para bloquear puntero
    document.body.addEventListener('click', () => {
        controls.lock();
    });

    // 6. Renderizador
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 7. Listeners Teclado
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onWindowResize);

    // 8. Cargar Entorno Base
    setupEnvironment();

    // 9. Arrancar Lógica del Nivel (Usamos un pequeño retardo para asegurar que el HTML cargó la función)
    setTimeout(() => {
        if (window.startLevelLogic) {
            window.startLevelLogic(scene, walls, camera);
        } else {
            console.error("Error: No se encontró startLevelLogic en el HTML del nivel.");
        }
    }, 100);
}

function setupEnvironment() {
    // Suelo (Recibe canvas de common.js y lo convierte en textura Three.js)
    const floorCanvas = getFloorCanvas();
    const floorTex = new THREE.CanvasTexture(floorCanvas);
    
    const floorGeo = new THREE.PlaneGeometry(200, 200);
    const floorMat = new THREE.MeshStandardMaterial({ 
        map: floorTex, 
        roughness: 0.8 
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2; 
    scene.add(floor);

    // Techo
    const ceil = new THREE.Mesh(floorGeo, new THREE.MeshBasicMaterial({ color: 0x050505 }));
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = 2;
    scene.add(ceil);
}

// --- MOVIMIENTO Y COLISIONES ---
function onKeyDown(event) {
    switch (event.code) {
        case 'ArrowUp': case 'KeyW': moveForward = true; break;
        case 'ArrowLeft': case 'KeyA': moveLeft = true; break;
        case 'ArrowDown': case 'KeyS': moveBackward = true; break;
        case 'ArrowRight': case 'KeyD': moveRight = true; break;
    }
}

function onKeyUp(event) {
    switch (event.code) {
        case 'ArrowUp': case 'KeyW': moveForward = false; break;
        case 'ArrowLeft': case 'KeyA': moveLeft = false; break;
        case 'ArrowDown': case 'KeyS': moveBackward = false; break;
        case 'ArrowRight': case 'KeyD': moveRight = false; break;
    }
}

function checkCollision(newPos) {
    // Caja del jugador
    const playerBox = new THREE.Box3().setFromCenterAndSize(newPos, new THREE.Vector3(1, 2, 1));
    for (let wall of walls) {
        const wallBox = new THREE.Box3().setFromObject(wall);
        if (playerBox.intersectsBox(wallBox)) return true;
    }
    return false;
}

function checkGoal() {
    if (goalObject) {
        const dist = camera.position.distanceTo(goalObject.position);
        if (dist < 3) { // Distancia aumentada un poco
            if (window.levelWin) window.levelWin();
        }
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    const time = performance.now();
    const delta = (time - prevTime) / 1000;

    if (controls.isLocked === true) {
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();

        if (moveForward || moveBackward) velocity.z -= direction.z * 40.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 40.0 * delta;

        // Movimiento X
        controls.moveRight(-velocity.x * delta);
        if (checkCollision(camera.position.clone())) {
            controls.moveRight(velocity.x * delta);
            velocity.x = 0;
        }

        // Movimiento Z
        controls.moveForward(-velocity.z * delta);
        if (checkCollision(camera.position.clone())) {
            controls.moveForward(velocity.z * delta);
            velocity.z = 0;
        }
        checkGoal();
    }
    prevTime = time;
    renderer.render(scene, camera);
}

// Iniciar todo
init();
animate();
