// common.js (MEJORADO PARA VISIBILIDAD)

// --- CONFIGURACIÓN ---
const defaultSettings = {
    sensitivity: 0.002,
    volume: 0.5
};

function saveSettings(settings) {
    localStorage.setItem('terrorGameSettings', JSON.stringify(settings));
}

function loadSettings() {
    const stored = localStorage.getItem('terrorGameSettings');
    return stored ? JSON.parse(stored) : defaultSettings;
}

// --- GENERADOR DE GRÁFICOS ---

function getWallCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Fondo gris oscuro
    ctx.fillStyle = '#2a2a2a'; // Un poco más claro que antes
    ctx.fillRect(0, 0, 512, 512);
    
    // Ruido
    for (let i = 0; i < 40000; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#333' : '#222';
        ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }

    // BORDE BLANCO (Crucial para ver las paredes)
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#555'; // Borde gris claro
    ctx.strokeRect(0, 0, 512, 512);

    return canvas;
}

function getFloorCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#111'; // Fondo casi negro
    ctx.fillRect(0, 0, 512, 512);
    
    // Baldosas (Lineas más brillantes)
    ctx.strokeStyle = '#444'; 
    ctx.lineWidth = 4; // Más gruesas
    for(let i=0; i<=512; i+=64) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
    }
    return canvas;
}
