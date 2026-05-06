// game/entity.js
let entityMesh = null;
let entitySpeed = 2.5;

function createEntity(scene) {
    entityMesh = new THREE.Group();

    const material = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.2 });
    const bodyGeo = new THREE.CylinderGeometry(0.3, 0.2, 2.2, 8);
    const body = new THREE.Mesh(bodyGeo, material);
    body.position.y = 1.1;
    entityMesh.add(body);

    const headGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const head = new THREE.Mesh(headGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    head.position.y = 2.5;
    entityMesh.add(head);

    const eyeGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.12, 2.55, 0.3);
    entityMesh.add(eyeL);

    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.12, 2.55, 0.3);
    entityMesh.add(eyeR);

    const armGeo = new THREE.CylinderGeometry(0.08, 0.05, 1.5, 8);
    const armL = new THREE.Mesh(armGeo, material);
    armL.position.set(-0.4, 1.2, 0);
    armL.rotation.z = 0.2;
    entityMesh.add(armL);

    const armR = new THREE.Mesh(armGeo, material);
    armR.position.set(0.4, 1.2, 0);
    armR.rotation.z = -0.2;
    entityMesh.add(armR);

    scene.add(entityMesh);
    return entityMesh;
}

function updateEntity(delta, playerPosition) {
    if (!entityMesh) return;

    const dist = entityMesh.position.distanceTo(playerPosition);

    if (dist > 1.5 && dist < 20) {
        const direction = new THREE.Vector3().subVectors(playerPosition, entityMesh.position).normalize();
        entityMesh.position.add(direction.multiplyScalar(entitySpeed * delta));
        entityMesh.lookAt(playerPosition.x, entityMesh.position.y, playerPosition.z);
        entityMesh.position.y = Math.sin(Date.now() * 0.005) * 0.2;
    }
    
    if (dist < 1.0) {
        document.body.style.background = "red";
        setTimeout(() => alert("¡TE HA ATRAPADO!"), 100);
        location.reload();
    }
}
