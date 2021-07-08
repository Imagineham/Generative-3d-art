import { BoxBufferGeometry, Mesh, MeshBasicMaterial } from 'https://cdn.skypack.dev/three@0.129.0';

function createCube() {
    const geometry = new BoxBufferGeometry(2, 2, 2);

    const material = new MeshBasicMaterial();

    const cube = new Mesh(geometry, material);

    return cube;
}

export {createCube};