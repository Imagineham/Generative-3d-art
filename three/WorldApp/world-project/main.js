import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import {World} from './src/World/World.js';

let container;
let world;

//main will set up World App 
function main() {

  container = document.querySelector('#scene-container');

  //World
  world = new World(container);

  //Render world
  world.render();
    
  //Animate world
  function animation() {
    world.animate();
    requestAnimationFrame(animation);
  }

  animation();
}

main();

