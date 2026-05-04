// game/entity.js

let entityMesh = null;
let entitySpeed = 2.5; // Velocidad de caminata

function createEntity(scene) {
    // Usamos un Group para agrupar cabeza, cuerpo y extremidades
    entityMesh = new THREE.Group();

    const material = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.2 }); // Color gris maniquí

    // Cuerpo (Cilindro alto y delgado)
    const bodyGeo = new THREE.CylinderGeometry(0.3, 0.2, 2.2, 8);
    const body = new THREE.Mesh(bodyGeo, material);
    body.position.y = 1.1;
    entityMesh.add(body);

    // Cabeza (Esfera lisa)
    const headGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const head = new THREE.Mesh(headGeo, new THREE.MeshBasicMaterial({ color: 0xffffff })); // Cara blanca brillante
    head.position.y = 2.5;
    entityMesh.add(head);

    // Ojos (Simplemente dos esferas negras planas)
    const eyeGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.12, 2.55, 0.3);
    entityMesh.add(eyeL);

    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.12, 2.55, 0.3);
    entityMesh.add(eyeR);

    // Brazos (Colgando largos)
    const armGeo = new THREE.CylinderGeometry(0.08, 0.05, 1.5, 8);
    const armL = new THREE.Mesh(armGeo, material);
    armL.position.set(-0.4, 1.2, 0);
    armL.rotation.z = 0.2;
    entityMesh.add(armL);

    const armR = new THREE.Mesh(armGeo, material);
    armR.position.set(0.4, 1.2, 0);
    armR.rotation.z = -0.2;
    entityMesh.add(armR);

    // Añadir al escenario
    scene.add(entityMesh);

    return entityMesh;
}

// Función para actualizar la IA del monstruo
function updateEntity(delta, playerPosition) {
    if (!entityMesh) return;

    // Distancia al jugador
    const dist = entityMesh.position.distanceTo(playerPosition);

    // Si está lejos, se acerca lentamente
    if (dist > 1.5 && dist < 20) { // Rango de detección (20 unidades)
        const direction = new THREE.Vector3().subVectors(playerPosition, entityMesh.position).normalize();
        // Moverse hacia el jugador
        entityMesh.position.add(direction.multiplyScalar(entitySpeed * delta));
        
        // Mirar al jugador
        entityMesh.lookAt(playerPosition.x, entityMesh.position.y, playerPosition.z);

        // Animación de "caminar" flotante (Senoidal)
        entityMesh.position.y = Math.sin(Date.now() * 0.005) * 0.2;
    }
    
    // COLISIÓN CON EL JUGADOR (GAME OVER)
    if (dist < 1.0) {
        document.body.style.background = "red"; // Efecto visual simple
        alert("¡TE HA ATRAPADO!");
        location.reload(); // Reiniciar
    }
}
