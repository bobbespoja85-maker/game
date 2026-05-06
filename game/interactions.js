// game/interactions.js
let raycaster = new THREE.Raycaster();
let center = new THREE.Vector2(0, 0);
let doors = [];
let message = null;

function initInteraction(scene) {
    message = document.createElement('div');
    message.id = 'interaction-msg';
    message.innerText = "Presiona [E] para abrir";
    message.style.position = 'absolute';
    message.style.top = '60%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.color = 'white';
    message.style.fontFamily = 'monospace';
    message.style.fontSize = '20px';
    message.style.textShadow = '0 0 5px black';
    message.style.display = 'none';
    document.body.appendChild(message);

    document.addEventListener('keydown', (event) => {
        if (event.code === 'KeyE') {
            tryInteract();
        }
    });
}

function createDoor(scene, x, y, z, rotationY = 0) {
    const pivot = new THREE.Group();
    pivot.position.set(x, y, z);
    pivot.rotation.y = rotationY;

    const doorGeo = new THREE.BoxGeometry(1.2, 2.5, 0.1); 
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x4a3c31 });
    const doorMesh = new THREE.Mesh(doorGeo, doorMat);
    doorMesh.position.x = 0.6; 

    const hingeGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.5, 8);
    const hingeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const hinge = new THREE.Mesh(hingeGeo, hingeMat);
    hinge.rotation.x = Math.PI / 2;

    pivot.add(doorMesh);
    pivot.add(hinge);
    
    doorMesh.userData = { isDoor: true, isOpen: false, pivot: pivot };
    doorMesh.name = "Door";

    scene.add(pivot);
    doors.push(doorMesh);
    return doorMesh;
}

function checkInteraction(camera) {
    raycaster.setFromCamera(center, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    let lookingAtDoor = false;

    if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (intersects[0].distance < 3 && obj.userData.isDoor) {
            lookingAtDoor = true;
            window.targetDoor = obj;
        }
    }

    if (lookingAtDoor) {
        message.style.display = 'block';
    } else {
        message.style.display = 'none';
        window.targetDoor = null;
    }
}

function tryInteract() {
    if (window.targetDoor) {
        const door = window.targetDoor;
        const pivot = door.userData.pivot;
        if (!door.userData.isOpen) {
            let angle = pivot.rotation.y;
            const target = -Math.PI / 2;
            const animateOpen = () => {
                if (angle > target) {
                    angle -= 0.1;
                    pivot.rotation.y = angle;
                    requestAnimationFrame(animateOpen);
                } else {
                    door.userData.isOpen = true;
                }
            };
            animateOpen();
        }
    }
}
