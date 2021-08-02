import { createCamera } from '../../components/camera.js';
import * as CUBES from '../../components/cube.js';
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

      cubes = CUBES.createCubeMatrix();
      for(let row = 0; row < CUBES.numCubes; row++) {
        for(let col = 0; col < CUBES.numCubes; col++) {
          console.log("CONTAINER WIDTH = " + renderer.getSize().x, "CONTAINER HEIGHTS = " + container.clientHeight);

          cubes[row][col].position.x = row - (4.5);
          cubes[row][col].position.y = -col + 2 + CUBES.cubeHeight;
          
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

    animate() {

      for(let row = 0; row < CUBES.numCubes; row++) {
        for(let col = 0; col < CUBES.numCubes; col++) {
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