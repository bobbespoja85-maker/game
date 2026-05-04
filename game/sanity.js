// game/sanity.js

let sanity = 100;
let sanityElement = null;

function initSanity() {
    sanityElement = document.createElement('div');
    sanityElement.style.position = 'absolute';
    sanityElement.style.bottom = '20px';
    sanityElement.style.right = '20px';
    sanityElement.style.width = '200px';
    sanityElement.style.height = '20px';
    sanityElement.style.border = '2px solid white';
    sanityElement.style.background = '#333';
    sanityElement.style.zIndex = '10';

    const bar = document.createElement('div');
    bar.id = 'sanity-bar';
    bar.style.width = '100%';
    bar.style.height = '100%';
    bar.style.background = 'green';
    bar.style.transition = 'width 0.5s';
    
    sanityElement.appendChild(bar);
    document.body.appendChild(sanityElement);
}

function updateSanity(delta, nearMonster) {
    // Si estás cerca del monstruo, pierdes cordura rápido
    if (nearMonster) {
        sanity -= 10 * delta;
    } else {
        // Se recupera lentamente si estás lejos
        sanity += 1 * delta;
    }

    sanity = Math.max(0, Math.min(100, sanity));

    // Actualizar UI
    const bar = document.getElementById('sanity-bar');
    if (bar) {
        bar.style.width = sanity + '%';
        // Cambiar color según estado
        if (sanity > 70) bar.style.background = 'green';
        else if (sanity > 30) bar.style.background = 'orange';
        else bar.style.background = 'red';
    }

    // Efecto de Alucinación (Si cordura < 20, pantalla tiembla)
    if (sanity < 20) {
        document.body.style.filter = `blur(${Math.random() * 2}px) grayscale(50%)`;
    } else {
        document.body.style.filter = 'none';
    }

    // GAME OVER por locura
    if (sanity <= 0) {
        alert("TE HAS VUELTO LOCO...");
        location.reload();
    }
}
