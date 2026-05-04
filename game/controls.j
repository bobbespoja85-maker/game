// game/controls.js

// Variables locales para los controles
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

// Física
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
const speed = 40.0; // Velocidad base

// --- INICIALIZAR LISTENERS DE TECLADO ---
function initControls() {
    document.addEventListener('keydown', (event) => {
        switch (event.code) {
            case 'ArrowUp': case 'KeyW': moveForward = true; break;
            case 'ArrowLeft': case 'KeyA': moveLeft = true; break;
            case 'ArrowDown': case 'KeyS': moveBackward = true; break;
            case 'ArrowRight': case 'KeyD': moveRight = true; break;
        }
        // Exportar estado de teclas para el sistema de pasos (audio)
        window.inputActive = moveForward || moveBackward || moveLeft || moveRight;
    });

    document.addEventListener('keyup', (event) => {
        switch (event.code) {
            case 'ArrowUp': case 'KeyW': moveForward = false; break;
            case 'ArrowLeft': case 'KeyA': moveLeft = false; break;
            case 'ArrowDown': case 'KeyS': moveBackward = false; break;
            case 'ArrowRight': case 'KeyD': moveRight = false; break;
        }
        window.inputActive = moveForward || moveBackward || moveLeft || moveRight;
    });
}

// --- FUNCIÓN DE MOVIMIENTO (Llamada en cada frame) ---
// Recibe: delta (tiempo), camera, controls (pointerlock), walls (lista de colisiones)
function updateControls(delta, camera, controls, walls) {
    // 1. Fricción (Reducir velocidad gradualmente)
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    // 2. Determinar dirección deseada
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // Esto asegura que correr en diagonal no sea más rápido

    // 3. Aplicar aceleración si se presionan teclas
    if (moveForward || moveBackward) velocity.z -= direction.z * speed * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * speed * delta;

    // 4. Calcular el desplazamiento
    const moveX = -velocity.x * delta;
    const moveZ = -velocity.z * delta;

    // 5. COLISIÓN EN EJE X
    controls.moveRight(moveX);
    if (checkCollision(camera, walls)) {
        // Si choca, deshacer movimiento en X
        controls.moveRight(-moveX);
        velocity.x = 0;
    }

    // 6. COLISIÓN EN EJE Z
    controls.moveForward(moveZ);
    if (checkCollision(camera, walls)) {
        // Si choca, deshacer movimiento en Z
        controls.moveForward(-moveZ);
        velocity.z = 0;
    }
}

// --- SISTEMA DE COLISIONES ---
function checkCollision(camera, walls) {
    // Crear una caja alrededor del jugador
    const playerBox = new THREE.Box3().setFromCenterAndSize(
        camera.position, 
        new THREE.Vector3(1, 2, 1) // Ancho, Alto, Largo del jugador
    );

    // Revisar contra todas las paredes
    for (let wall of walls) {
        const wallBox = new THREE.Box3().setFromObject(wall);
        if (playerBox.intersectsBox(wallBox)) {
            return true; // ¡CHOQUE!
        }
    }
    return false; // Camino libre
}
