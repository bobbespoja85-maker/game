// game/controls.js
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
const speed = 40.0;
const friction = 10.0;

function initControls() {
    document.addEventListener('keydown', (event) => {
        switch (event.code) {
            case 'ArrowUp': case 'KeyW': moveForward = true; break;
            case 'ArrowLeft': case 'KeyA': moveLeft = true; break;
            case 'ArrowDown': case 'KeyS': moveBackward = true; break;
            case 'ArrowRight': case 'KeyD': moveRight = true; break;
        }
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

function updateControls(delta, camera, controls, walls) {
    velocity.x -= velocity.x * friction * delta;
    velocity.z -= velocity.z * friction * delta;

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();

    if (moveForward || moveBackward) velocity.z -= direction.z * speed * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * speed * delta;

    const moveX = -velocity.x * delta;
    controls.moveRight(moveX);
    if (checkCollision(camera, walls)) {
        controls.moveRight(-moveX);
        velocity.x = 0;
    }

    const moveZ = -velocity.z * delta;
    controls.moveForward(moveZ);
    if (checkCollision(camera, walls)) {
        controls.moveForward(-moveZ);
        velocity.z = 0;
    }

    const currentSpeed = Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z);
    window.playerSpeed = currentSpeed.toFixed(2);
}

function checkCollision(camera, walls) {
    const playerBox = new THREE.Box3().setFromCenterAndSize(
        camera.position, 
        new THREE.Vector3(0.5, 1.8, 0.5)
    );
    for (let wall of walls) {
        const wallBox = new THREE.Box3().setFromObject(wall);
        if (playerBox.intersectsBox(wallBox)) return true;
    }
    return false;
}
