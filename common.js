// common.js

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

function getWallCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 40000; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#333' : '#222';
        ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#555';
    ctx.strokeRect(0, 0, 512, 512);
    return canvas;
}

function getFloorCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 4;
    for(let i=0; i<=512; i+=64) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
    }
    return canvas;
}
