import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import {World} from './src/World/World.js';

let container;
let world;
let start = Date.now();

//main will set up World App 
function main() {

  container = document.querySelector('#scene-container');

  //World
  world = new World(container);

  //Render and Animate world
  animate();

}

function animate() {
  let seconds = Math.floor((Date.now() - start) / 1000);
  console.log(seconds);
  requestAnimationFrame(animate);

  world.render();

  world.animate(seconds);
}

main();

