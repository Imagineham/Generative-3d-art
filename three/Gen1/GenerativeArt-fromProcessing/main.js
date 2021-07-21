import './style.css'
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js'
//import gsap from 'gsap';


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
camera.position.z = 20;

//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

//Listing i1 Constants
let xstart = Math.random() * 10;
let ynoise = Math.random() * 10;

const canvas = document.querySelector('#canvas');

if (canvas.getContext) {

    const ctx = canvas.getContext('2d');

    // translate
    ctx.translate(150, 150);
    console.log(ctx);
}





















const radius = 50;
const particlesCount = 1000;

const pointsMaterial = new THREE.PointsMaterial({
  depthTest: false,
  vertexColors: true
  });

let geometry = new THREE.BufferGeometry();


const positions = [];
const colors = [];
const sizes = [];

const color = new THREE.Color();

for ( let i = 0; i < particlesCount; i ++ ) {

  positions.push( ( Math.random() * 2 - 1 ) * radius );
  positions.push( ( Math.random() * 2 - 1 ) * radius );
  positions.push( ( Math.random() * 2 - 1 ) * radius );

  color.setHSL( i / particlesCount, 1.0, 0.5 );

  colors.push( color.r, color.g, color.b );

  sizes.push( Math.random() / particlesCount);
  //console.log(sizes);

}

geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
geometry.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ).setUsage( THREE.DynamicDrawUsage ) );

//Objects
const torusGeometry = new THREE.TorusGeometry(.7, .2, 16, 100);
/*
const particleGeometry = new THREE.BufferGeometry;

const partArray = new Float32Array(particlesCount * 3);
const colors = [];

for(let i = 0; i < particlesCount * 3; i++) {
  partArray[i] = (Math.random() - 0.5) * 5 * 7;
  colors[i] = Math.floor(Math.random()*16777215).toString(16);
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(partArray, 3));
*/

//Materials
const torusMaterial = new THREE.PointsMaterial({
  size: 0.05,
  color: 0x058FFF
  });

//Mesh
const torus = new THREE.Points(torusGeometry, torusMaterial);
//const particles = new THREE.Points(particleGeometry, pointsMaterial);
const particleSystem = new THREE.Points( geometry, pointsMaterial );
scene.add(torus, particleSystem);
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  torus.rotation.y -= 0.007;
  particleSystem.rotation.y -= 0.007;
}

animate();