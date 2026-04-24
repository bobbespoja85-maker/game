// common.js (CORREGIDO)

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

// --- GENERADOR DE GRÁFICOS (RETORNAN CANVAS, NO TEXTURAS) ---

function getWallCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 40000; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#222' : '#111';
        ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
    return canvas;
}

function getFloorCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    for(let i=0; i<=512; i+=64) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
    }
    return canvas;
}
