import './style.css'
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap';

function fizzBuzz() {
  for(let i = 1; i < 101; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      console.log("FIZZBUZZ");
    } else if (i % 3 === 0) {
      console.log("FIZZ");
    } else if (i % 5 === 0) {
      console.log("BUZZ");
    } else {
      console.log(i);
    }
  }
}

fizzBuzz();




// Scene
const scene = new THREE.Scene();

//Camera
const camera = new THREE.
  PerspectiveCamera(
    75, 
    innerWidth/innerHeight,
    0.1,
    1000
    );
camera.position.z = 5;

//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
renderer.setClearColor(0x080808, 1 )
document.body.appendChild(renderer.domElement);


//Objects
const torusGeometry = new THREE.TorusGeometry(.7, .2, 16, 100);
const particleGeometry = new THREE.BufferGeometry;
const particlesCount = 1000;

const partArray = new Float32Array(particlesCount * 3);
const colors = [];

for(let i = 0; i < particlesCount * 3; i++) {
  partArray[i] = (Math.random() - 0.5) * 5 * 7;
  colors[i] = Math.floor(Math.random()*16777215).toString(16);
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(partArray, 3));

//Materials
const torusMaterial = new THREE.PointsMaterial({
  size: 0.005,
  color: 0x058FFF
  });

const pointsMaterial = new THREE.PointsMaterial({
  size: 0.075,
  color: 0xFF8000
  });

//Mesh
const torus = new THREE.Points(torusGeometry, torusMaterial);
const particles = new THREE.Points(particleGeometry, pointsMaterial);
scene.add(torus, particles);
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  torus.rotation.y -= 0.007;
  particles.rotation.y -= 0.007;
}

animate();