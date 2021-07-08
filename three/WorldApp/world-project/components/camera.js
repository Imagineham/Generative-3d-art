import { PerspectiveCamera } from 'https://cdn.skypack.dev/three@0.129.0';;

function createCamera() {
    const camera = new PerspectiveCamera(
        35,
        1,
        0.1,
        100
    );

    camera.position.set(0,0,10);

    return camera;
}

export { createCamera };