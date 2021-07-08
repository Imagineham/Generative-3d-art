import { WebGLRenderer} from 'https://cdn.skypack.dev/three@0.129.0';

function createRenderer() {
    const renderer = new WebGLRenderer();

    return renderer;
}

export { createRenderer };