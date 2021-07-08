import { Color, Scene } from 'https://cdn.skypack.dev/three@0.129.0';

function createScene() {
    const scene = new Scene();

    scene.background = new Color('white');

    return scene;
}

export { createScene };