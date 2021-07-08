import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import {World} from './src/World/World.js';


//main will set up World App 
function main() {

  const container = document.querySelector('#scene-container');

  //World
  const world = new World();

  console.log(world.camera);

  //Render world
  world.render();

}

main();


