// game/mazeGenerator.js
const MAZE_SIZE = 21; 

function generateMaze() {
    let grid = [];
    for (let x = 0; x < MAZE_SIZE; x++) {
        grid[x] = [];
        for (let z = 0; z < MAZE_SIZE; z++) {
            grid[x][z] = 1;
        }
    }

    let stack = [{x: 1, z: 1}];
    grid[1][1] = 0;

    while (stack.length > 0) {
        let current = stack[stack.length - 1];
        let neighbors = [];
        const directions = [
            {dx: 0, dz: -2}, {dx: 0, dz: 2}, 
            {dx: -2, dz: 0}, {dx: 2, dz: 0}
        ];

        for (let dir of directions) {
            let nx = current.x + dir.dx;
            let nz = current.z + dir.dz;
            if (nx > 0 && nx < MAZE_SIZE - 1 && nz > 0 && nz < MAZE_SIZE - 1 && grid[nx][nz] === 1) {
                neighbors.push({x: nx, z: nz, px: current.x + dir.dx/2, pz: current.z + dir.dz/2});
            }
        }

        if (neighbors.length > 0) {
            let next = neighbors[Math.floor(Math.random() * neighbors.length)];
            grid[next.px][next.pz] = 0;
            grid[next.x][next.z] = 0;
            stack.push({x: next.x, z: next.z});
        } else {
            stack.pop();
        }
    }
    return grid;
}

function buildMazeFromGrid(scene, walls, wallMaterial) {
    const grid = generateMaze();
    const geo = new THREE.BoxGeometry(1, 4, 1);

    for (let x = 0; x < MAZE_SIZE; x++) {
        for (let z = 0; z < MAZE_SIZE; z++) {
            if (grid[x][z] === 1) {
                const wall = new THREE.Mesh(geo, wallMaterial);
                wall.position.set(x - MAZE_SIZE/2, 0, z - MAZE_SIZE/2);
                scene.add(wall);
                walls.push(wall);
            }
        }
    }
    return {
        x: 1 - MAZE_SIZE/2,
        z: 1 - MAZE_SIZE/2
    };
}
