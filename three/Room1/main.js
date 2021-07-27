import './style.css'
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap';
import * as dat from 'dat.gui';

//Constants
let scene, camera, renderer, canvas;

//camera parameters
let fov, aspectRatio, near, far, controls; 

//dat.gui
let gui, world;


init();

function init() {

//Scene init
scene = new THREE.Scene();

//Camera init
fov = 75;
aspectRatio = innerWidth/innerHeight;
near = 0.1; 
far = 1000;
camera = new THREE.PerspectiveCamera(
  fov,
  aspectRatio,
  near,
  far
);
camera.position.set(0,0,5);

//Renderer init
renderer = new THREE.WebGLRenderer();
canvas = renderer.domElement;
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(canvas);

//Orbit Controls
controls = new OrbitControls(camera, canvas);
console.log(controls);

//Gui init
gui = new dat.GUI();
world = {
  plane: {
    width: 2
  }
}
gui.add(world.plane, "width", 1, 10).onChange(() => {
  closePlane.geometry.dispose();
  closePlane.geometry = new THREE.PlaneGeometry(world.plane.width, 2);
  console.log(closePlane.geometry);
  render();
});

//Light
const light = new THREE.PointLight( 0xffffff, 1, 100 );
light.position.set(0, 0, 0);
scene.add(light);

//Planes
const planeWidth = 2;
const planeHeight = 2;

//Bottom plane
const bottomGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
const bottomMaterial = new THREE.MeshPhongMaterial({
  color: "red",
  side: THREE.DoubleSide
});
const bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
bottom.position.set(0,planeHeight/2,0);
bottom.rotation.x = Math.PI/2;
scene.add(bottom);

//Top plane
const topGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
const topMaterial = new THREE.MeshPhongMaterial({
  color: "blue",
  side: THREE.DoubleSide
});
const top = new THREE.Mesh(topGeometry, topMaterial);
top.position.set(0,-planeHeight/2,0);
top.rotation.x = Math.PI/2;
scene.add(top);
console.log(top);

//Left Plane
const leftGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
const leftMaterial = new THREE.MeshPhongMaterial({
  color: "yellow",
  side: THREE.DoubleSide
});
const left = new THREE.Mesh(leftGeometry, leftMaterial);
left.position.set(-planeHeight/2,0,0);
left.rotation.y = Math.PI/2;
scene.add(left);

//Right Plane
const rightGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
const rightMaterial = new THREE.MeshPhongMaterial({
  color: "green",
  side: THREE.DoubleSide
});
const right = new THREE.Mesh(rightGeometry, rightMaterial);
right.position.set(planeHeight/2,0,0);
right.rotation.y = -Math.PI/2;
scene.add(right);

//Closest Plane
const closeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
const closeMaterial = new THREE.MeshPhongMaterial({
  color: "orange",
  side: THREE.DoubleSide
});
const closePlane = new THREE.Mesh(closeGeometry, closeMaterial);
closePlane.position.set(0,0,planeWidth/2);
//scene.add(closePlane);

//Furthest Plane
const farGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
const farMaterial = new THREE.MeshPhongMaterial({
  color: "purple",
  side: THREE.DoubleSide
});
const farPlane = new THREE.Mesh(farGeometry, farMaterial);
farPlane.position.set(0,0,-planeWidth/2);
scene.add(farPlane);


render();

}

function render() {
  renderer.render(scene, camera);
}


function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
}

animate();
