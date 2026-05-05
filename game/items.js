// game/items.js

let flashlight;

function initItems(camera) {
    // Crear una Luz Focal (SpotLight) para simular una linterna real
    flashlight = new THREE.SpotLight(0xffffff, 1.5); // Blanco, intensidad media
    flashlight.angle = Math.PI / 6; // 30 grados de apertura del haz
    flashlight.penumbra = 0.5; // Bordes suaves
    flashlight.decay = 2;
    flashlight.distance = 40; // Distancia de alcance
    flashlight.castShadow = true;

    // Posicionar la linterna en la cámara
    // La añadimos como hija de la cámara para que se mueva con ella
    camera.add(flashlight);
    
    // Importante: Añadir el objetivo de la luz para que se proyecte hacia adelante
    camera.add(flashlight.target);
    flashlight.target.position.set(0, 0, -1);

    // Estado inicial: Encendida
    flashlight.visible = true;

    // --- ESCUCHAR TECLA F PARA ENCENDER/APAGAR ---
    document.addEventListener('keydown', (event) => {
        if (event.code === 'KeyF') {
            flashlight.visible = !flashlight.visible;
            
            // Efecto de sonido visual en consola (puedes conectar audio aquí luego)
            console.log("Linterna: " + (flashlight.visible ? "ON" : "OFF"));
        }
    });
}

// Función auxiliar por si necesitamos el estado en otros scripts
function isFlashlightOn() {
    return flashlight ? flashlight.visible : false;
}
