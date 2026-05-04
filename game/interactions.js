// game/interactions.js

let raycaster = new THREE.Raycaster();
let center = new THREE.Vector2(0, 0); // Centro de la pantalla
let doors = []; // Array para guardar las puertas
let message = null;

// Inicializar el sistema
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
    message.style.display = 'none'; // Oculto por defecto
    document.body.appendChild(message);

    // Escuchar tecla E
    document.addEventListener('keydown', (event) => {
        if (event.code === 'KeyE') {
            tryInteract();
        }
    });
}

// Crear una puerta
function createDoor(scene, x, y, z, rotationY = 0) {
    // 1. Crear un "Pivote" (Grupo) para que la puerta gire sobre su bisagra
    const pivot = new THREE.Group();
    pivot.position.set(x, y, z);
    pivot.rotation.y = rotationY;

    // 2. Crear la hoja de la puerta (Mesh)
    // La geometría se desplaza a la derecha (width/2) para girar sobre el borde izquierdo
    const doorGeo = new THREE.BoxGeometry(1.2, 2.5, 0.1); 
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x4a3c31 }); // Color madera
    const doorMesh = new THREE.Mesh(doorGeo, doorMat);
    doorMesh.position.x = 0.6; // Desplazar el centro para girar sobre el borde (0.5 es la mitad de 1.0)
    
    // Añadir bisagra (visual)
    const hingeGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.5, 8);
    const hingeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const hinge = new THREE.Mesh(hingeGeo, hingeMat);
    hinge.rotation.x = Math.PI / 2;

    pivot.add(doorMesh);
    pivot.add(hinge);
    
    // Datos para la interacción
    doorMesh.userData = { isDoor: true, isOpen: false, pivot: pivot };
    doorMesh.name = "Door";

    scene.add(pivot);
    doors.push(doorMesh);
    return doorMesh;
}

// Comprobar cada frame si miramos una puerta
function checkInteraction(camera) {
    raycaster.setFromCamera(center, camera);
    
    // Intersectar con todos los objetos de la escena (o solo puertas para optimizar)
    // Aquí intersectamos todo por simplicidad, verificamos si es puerta después
    const intersects = raycaster.intersectObjects(scene.children, true);

    let lookingAtDoor = false;

    if (intersects.length > 0) {
        const obj = intersects[0].object;
        // Chequear distancia (máximo 3 unidades)
        if (intersects[0].distance < 3 && obj.userData.isDoor) {
            lookingAtDoor = true;
            window.targetDoor = obj; // Guardar la puerta seleccionada
        }
    }

    if (lookingAtDoor) {
        message.style.display = 'block';
    } else {
        message.style.display = 'none';
        window.targetDoor = null;
    }
}

// Intentar abrir/cerrar
function tryInteract() {
    if (window.targetDoor) {
        const door = window.targetDoor;
        const pivot = door.userData.pivot;
        
        if (!door.userData.isOpen) {
            // Abrir (Rotar -90 grados)
            // Usamos una transición simple
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
