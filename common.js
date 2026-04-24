// --- GESTIÓN DE CONFIGURACIÓN ---

const defaultSettings = {
    sensitivity: 0.002,    // Sensibilidad del ratón
    volume: 0.5,           // Volumen maestro (0.0 a 1.0)
    controls: "WASD"       // Placeholder para futura reasignación
};

// Guardar configuración (usado en el Menú)
function saveSettings(settings) {
    localStorage.setItem('terrorGameSettings', JSON.stringify(settings));
    console.log("Configuración guardada:", settings);
}

// Cargar configuración (usado en el Juego)
function loadSettings() {
    const stored = localStorage.getItem('terrorGameSettings');
    return stored ? JSON.parse(stored) : defaultSettings;
}

// --- GENERADOR DE ASSETS PROCEDURALES (Recursos Gráficos) ---

// Función para crear la textura de pared "sucia" (Se usará en todos los niveles)
function createWallTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base gris oscura
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, 512, 512);

    // Ruido (Suciedad)
    for (let i = 0; i < 30000; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#222' : '#111';
        ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }

    // Manchas de sangre (rojo oscuro)
    ctx.fillStyle = 'rgba(100, 0, 0, 0.3)';
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 50 + 20, 0, Math.PI * 2);
        ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}
