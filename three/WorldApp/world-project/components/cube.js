import { BoxBufferGeometry, Mesh, MeshBasicMaterial, Color } from 'https://cdn.skypack.dev/three@0.129.0';

let numCubes = 5;

function createCube() {
    let color = new Color();
        
    const geometry = new BoxBufferGeometry(
        0.5,
        0.5,
        0
        );

    color.setHSL(Math.random(), 1, 0.5);

    const material = new MeshBasicMaterial({
        color: color
    });

    const cube = new Mesh(geometry, material);

    return cube;
}

function createCubeMatrix() {
    let cube;
    let cubeMatrix = [];

    for(let row = 0; row < numCubes; row++) {
        let cubeRow = [];
        for(let col = 0; col < numCubes; col++) {
            cube = createCube();
            cubeRow.push(cube);
        }
        console.log(cubeRow);
        cubeMatrix.push(cubeRow);
    }

    return cubeMatrix;

}

export {createCube};
export {createCubeMatrix};