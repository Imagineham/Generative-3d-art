import { createRenderer } from "./renderer";

class Resizer {
    constructor(camera, renderer, container) {
        //set camera to match container proportions
        camera.aspect = container.clientWidth / container.clientHeight;

        //update frustum
        camera.updateProjectionMatrix();

        //set renderer to same size of container
        renderer.setSize(container.clientWidth, container.clientHeight); 

        //set pixelRatio
        renderer.setPixelRatio(window.devicePixelRatio);
    }


}

export { Resizer }