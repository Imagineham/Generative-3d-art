import './style.css'
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js'

let scene, camera, renderer, canvas;
let points, geometry, material, line;
let WIDTH, HEIGHT;


init();
animate();

function init() {
  scene = new THREE.Scene();

  //Camera
  camera = new THREE.
    PerspectiveCamera(
      75, //fov
      innerWidth/innerHeight, //aspectRatio
      0.1, //near
      1000 //far
      );
  camera.position.set(0,0,10);

  //Renderer
  renderer = new THREE.WebGLRenderer({
    preserveDrawingBuffer: true,
  });
  canvas = renderer.domElement;
  WIDTH = canvas.innerWidth;
  HEIGHT = canvas.innerHeight;
  renderer.autoClearColor = false;
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
  document.body.appendChild(renderer.domElement);
  window.addEventListener( 'resize', onWindowResize );


  //draw a line
  points = [];
  points.push(new THREE.Vector3(-5, 0, -10));
  points.push(new THREE.Vector3(0, 5, -2));
  points.push(new THREE. Vector3(5, 0, -15));


  geometry = new THREE.BufferGeometry().setFromPoints(points);
  material = new THREE.LineBasicMaterial({
    color: new THREE.Color('white')
  });
  line = new THREE.Line(geometry, material);
  line.geometry.verticesNeedUpdate = true;
  console.log(line);
  scene.add(line);

}

function render() {
  renderer.render(scene, camera);
}

function animate() {
  let ref = requestAnimationFrame(animate);
  render();  
 
  
  points.push(new THREE.Vector3(
    Math.random(),
    Math.random(),
    Math.random() 
  ));
  
  

  
  line.rotation.x += 1;
  line.rotation.y += 1;
  line.rotation.z += 1;
  

  //line.geometry.dispose();
  //line.geometry = new THREE.BufferGeometry().setFromPoints(points);
  //line.geometry.translate(-6, -8, -5);
  //console.log(line.geometry.setAttribute('position', points));

  
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}