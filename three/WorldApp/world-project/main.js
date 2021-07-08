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

}

//Animate world
function animate() {
  requestAnimationFrame(animate);
  for(let i = 0; i < world.scopes[0].cubescubes.length; i++) {
    world.scopes[0].cubes[i].rotation.z += 0.05;
  }
}

//animate();


main();
