// game/audioGen.js
let audioCtx;
let gainNode;

function initAudio() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        gainNode = audioCtx.createGain();
        gainNode.connect(audioCtx.destination);
        gainNode.gain.value = loadSettings().volume;
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playStepSound() {
    if (!audioCtx) return;
    const bufferSize = audioCtx.sampleRate * 0.1;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;
    
    const stepGain = audioCtx.createGain();
    stepGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
    stepGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

    noise.connect(filter);
    filter.connect(stepGain);
    stepGain.connect(gainNode);
    noise.start();
}

let monsterOsc = null;
function updateMonsterSound(distance) {
    if (!audioCtx) return;
    const maxDist = 20;
    let volume = Math.max(0, (maxDist - distance) / maxDist); 
    let pitch = 100 + (volume * 100);

    if (!monsterOsc && volume > 0.01) {
        monsterOsc = audioCtx.createOscillator();
        monsterOsc.type = 'sawtooth';
        monsterOsc.frequency.value = pitch;
        monsterOsc.connect(gainNode);
        monsterOsc.start();
    } else if (monsterOsc) {
        monsterOsc.frequency.setTargetAtTime(pitch, audioCtx.currentTime, 0.1);
        if (volume < 0.01) {
            monsterOsc.stop();
            monsterOsc = null;
        }
    }
}
