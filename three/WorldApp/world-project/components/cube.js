import { BoxBufferGeometry, Mesh, MeshBasicMaterial, Color } from 'https://cdn.skypack.dev/three@0.129.0';


const numCubes = 10;
const cubeWidth = 0.5;
const cubeHeight = 0.5;
const cubeDepth = 0; 

function createCube() {
    let color = new Color();
        
    const geometry = new BoxBufferGeometry(
        cubeWidth,
        cubeHeight,
        cubeDepth
        );

    color.setHSL(Math.random(), Math.random(), Math.random());

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

export {numCubes, cubeWidth, cubeHeight, cubeDepth};
export {createCube};
export {createCubeMatrix};