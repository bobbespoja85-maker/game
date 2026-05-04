// game/game.js (INTEGRACIÓN FINAL)

// --- VARIABLES GLOBALES ---
let camera, scene, renderer, controls;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let prevTime = performance.now();
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let walls = []; 
let goalObject = null; 
let settings;

// --- INICIALIZACIÓN ---
function init() {
    settings = loadSettings();

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.05);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 0; 

    // Exportar cámara al window para que otros archivos la vean
    window.camera = camera; 

    const ambient = new THREE.AmbientLight(0x555555); 
    scene.add(ambient);

    const flashlight = new THREE.PointLight(0xffffff, 1.5, 20);
    flashlight.position.set(0, 0, 0);
    camera.add(flashlight);
    scene.add(camera);

    // --- CONTROLES ---
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

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onWindowResize);

    setupEnvironment();

    setTimeout(() => {
        if (window.startLevelLogic) {
            window.startLevelLogic(scene, walls, camera);
        } else {
            console.warn("startLevelLogic no definido");
        }
    }, 100);
}

function setupEnvironment() {
    const floorCanvas = getFloorCanvas();
    const floorTex = new THREE.CanvasTexture(floorCanvas);
    const floorGeo = new THREE.PlaneGeometry(200, 200);
    const floorMat = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.5, color: 0x444444 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.5;
    scene.add(floor);

    const ceil = new THREE.Mesh(floorGeo, new THREE.MeshBasicMaterial({ color: 0x111111 }));
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = 2.5;
    scene.add(ceil);
}

// --- MOVIMIENTO ---
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
        // 1. Física de Movimiento
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();

        if (moveForward || moveBackward) velocity.z -= direction.z * 40.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 40.0 * delta;

        // 2. Colisiones
        controls.moveRight(-velocity.x * delta);
        if (checkCollision(camera.position.clone())) {
            controls.moveRight(velocity.x * delta);
            velocity.x = 0;
        }

        controls.moveForward(-velocity.z * delta);
        if (checkCollision(camera.position.clone())) {
            controls.moveForward(velocity.z * delta);
            velocity.z = 0;
        }
        checkGoal();

        // 3. ACTUALIZACIÓN DE ENTIDAD (INTEGRADO AQUÍ)
        // Esto llama a la función que definiremos en level1.html
        if (window.updateEntity) {
            window.updateEntity(delta, camera.position);
        }
    }
    
    prevTime = time;
    renderer.render(scene, camera);
}

init();
animate();
