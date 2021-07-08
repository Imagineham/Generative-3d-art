import { createCamera } from '../../components/camera.js';
import { createCube } from '../../components/cube.js';
import { createScene } from '../../components/scene.js';

import { createRenderer } from '../../systems/renderer.js';
import { Resizer } from '../../systems/Resizer.js';

let camera;
let renderer;
let scene;
let cubes;

//World Class
class World {
    constructor(container) {
      camera = createCamera();
      scene = createScene();
      renderer = createRenderer();
      container.append(renderer.domElement);

      cubes = createCube();
      for(let i = 0; i < cubes.length; i++) {
        cubes[i].position.x = i - 3;
        cubes[i].position.y = i - 2.5;

        scene.add(cubes[i]);
      }

      const resizer = new Resizer(camera, renderer, container);

    };

    render() {
      renderer.render(scene, camera);
    };

}
  
//Export the World scene!
export {World};