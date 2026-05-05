// game.js
let camera, scene, renderer, controls;
let prevTime = performance.now();
let walls = []; 
let goalObject = null; 
let settings;

function init() {
    settings = loadSettings();

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.02); 

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.6, 0); 
    window.camera = camera; 

    const ambient = new THREE.AmbientLight(0x404040); // Luz tenue
    scene.add(ambient);

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

    // HUD de Velocidad
    const speedDisplay = document.createElement('div');
    speedDisplay.id = 'speed-hud';
    speedDisplay.innerText = "0.00 m/s";
    speedDisplay.style.position = 'absolute';
    speedDisplay.style.bottom = '20px';
    speedDisplay.style.left = '20px';
    speedDisplay.style.color = '#00ff00';
    speedDisplay.style.fontFamily = 'monospace';
    speedDisplay.style.fontSize = '20px';
    speedDisplay.style.fontWeight = 'bold';
    speedDisplay.style.textShadow = '0 0 5px black';
    speedDisplay.style.zIndex = '10';
    document.body.appendChild(speedDisplay);

    window.addEventListener('resize', onWindowResize);

    setupEnvironment();

    initControls(); // Cargar sistema de movimiento
    initItems(camera); // Cargar sistema de linterna

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
    
    const floorMat = new THREE.MeshStandardMaterial({ 
        map: floorTex, 
        roughness: 0.5, 
        color: 0x888888 
    });
    
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    scene.add(floor);

    const ceil = new THREE.Mesh(floorGeo, new THREE.MeshStandardMaterial({ color: 0x222222 }));
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = 4;
    scene.add(ceil);
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

function animate() {
    requestAnimationFrame(animate);
    const time = performance.now();
    const delta = (time - prevTime) / 1000;

    if (controls.isLocked === true) {
        updateControls(delta, camera, controls, walls);
        checkGoal();

        // HUD
        const speedHud = document.getElementById('speed-hud');
        if (speedHud && window.playerSpeed) {
            speedHud.innerText = window.playerSpeed + " m/s";
            if (window.playerSpeed > 0.5) {
                speedHud.style.color = '#ffffff';
                speedHud.style.textShadow = '0 0 10px #00ff00';
            } else {
                speedHud.style.color = '#444444';
                speedHud.style.textShadow = 'none';
            }
        }

        if (window.updateEntity) {
            window.updateEntity(delta, camera.position);
        }
    }
    
    prevTime = time;
    renderer.render(scene, camera);
}

init();
animate();
