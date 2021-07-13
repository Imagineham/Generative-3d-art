import { createCamera } from '../../components/camera.js';
import { createCube, createCubeMatrix } from '../../components/cube.js';
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

      cubes = createCubeMatrix();
      for(let row = 0; row < cubes.length; row++) {
        for(let col = 0; col < cubes.length; col++) {
          cubes[row][col].position.x = col - 2;
          cubes[row][col].position.y = row - 2;
          
          /*
          cubes[row][col].rotation.x = Math.random() * row;
          cubes[row][col].rotation.y = Math.random() * col;
          */

          scene.add(cubes[row][col]);
        }
      }

      const resizer = new Resizer(camera, renderer, container);

    };

    render() {
      renderer.render(scene, camera);
    };

    animate(seconds) {

      for(let row = 0; row < cubes.length; row++) {
        for(let col = 0; col < cubes.length; col++) {
          cubes[row][col].rotation.x += (row / 500) + 0.001;
          cubes[row][col].rotation.y += (row / 500) + 0.001;
          cubes[row][col].rotation.z += (row / 500) + 0.007;
          cubes[row][col].rotation.z += (col / 500) + 0.007;
        }
      }
    };

}
  
//Export the World scene!
export {World};