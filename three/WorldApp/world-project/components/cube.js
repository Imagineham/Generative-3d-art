import { BoxBufferGeometry, Mesh, MeshBasicMaterial, Color } from 'https://cdn.skypack.dev/three@0.129.0';

let numCubes = 6;
let cubes = [];

function createCube() {

    for(let i = 0; i < numCubes; i++) {
        let color = new Color();
        
        const geometry = new BoxBufferGeometry(
            0.5,
            0.5,
            i
            );

        color.setHSL(Math.random(), 1, 0.5 );

        const material = new MeshBasicMaterial({
            color: color
        });

        const cube = new Mesh(geometry, material);
        cubes.push(cube);
    }

    return cubes;
}

export {createCube};