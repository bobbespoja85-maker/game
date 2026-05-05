// game/controls.js
// Maneja todo lo relacionado con el movimiento del jugador y las colisiones

// --- VARIABLES DE ESTADO DE TECLADO ---
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

// --- FÍSICA ---
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
const speed = 40.0; // Velocidad de movimiento
const friction = 10.0; // Qué tan rápido frenas al soltar tecla

// --- INICIALIZAR ESCUCHADORES (Eventos) ---
function initControls() {
    document.addEventListener('keydown', (event) => {
        switch (event.code) {
            case 'ArrowUp': case 'KeyW': moveForward = true; break;
            case 'ArrowLeft': case 'KeyA': moveLeft = true; break;
            case 'ArrowDown': case 'KeyS': moveBackward = true; break;
            case 'ArrowRight': case 'KeyD': moveRight = true; break;
        }
        // Variable global usada por el sistema de audio (pasos)
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

// --- ACTUALIZACIÓN FÍSICA (Bucle principal) ---
// Recibe: delta (tiempo), camera, controls (puntero), walls (paredes)
function updateControls(delta, camera, controls, walls) {
    // 1. Aplicar fricción (frenar poco a poco)
    velocity.x -= velocity.x * friction * delta;
    velocity.z -= velocity.z * friction * delta;

    // 2. Calcular dirección deseada basada en teclas
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // Normalizar para que diagonal no sea más rápido

    // 3. Acelerar si se presionan teclas
    if (moveForward || moveBackward) velocity.z -= direction.z * speed * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * speed * delta;

    // 4. Intentar moverse en EJE X
    const moveX = -velocity.x * delta;
    controls.moveRight(moveX);
    // Si chocamos, deshacemos el movimiento X
    if (checkCollision(camera, walls)) {
        controls.moveRight(-moveX);
        velocity.x = 0;
    }

    // 5. Intentar moverse en EJE Z
    const moveZ = -velocity.z * delta;
    controls.moveForward(moveZ);
    // Si chocamos, deshacemos el movimiento Z
    if (checkCollision(camera, walls)) {
        controls.moveForward(-moveZ);
        velocity.z = 0;
    }
}

// --- SISTEMA DE COLISIONES ---
function checkCollision(camera, walls) {
    // Crear la "Hitbox" del jugador (Caja invisible alrededor de la cámara)
    // Vector3(Ancho, Alto, Profundidad) -> 0.5, 1.8, 0.5 (Jugador delgado)
    const playerBox = new THREE.Box3().setFromCenterAndSize(
        camera.position, 
        new THREE.Vector3(0.5, 1.8, 0.5)
    );

    // Revisar colisión contra cada pared
    for (let wall of walls) {
        const wallBox = new THREE.Box3().setFromObject(wall);
        if (playerBox.intersectsBox(wallBox)) {
            return true; // ¡COLISIÓN!
        }
    }
    return false; // Espacio libre
}
