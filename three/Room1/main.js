import './style.css'
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap';
import * as dat from 'dat.gui';

//Constants
let scene, camera, renderer, canvas, raycaster, INTERSECTED;

//camera parameters
let fov, aspectRatio, near, far, controls; 

//dat.gui
let gui, world;

//loader
let loader;

//drawing Canvas constants
let ballMaterial;
const drawStartPos = new THREE.Vector2();

const mouse = {
  x: undefined,
  y: undefined
}

init();
setupCanvasDrawing();
animate();

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
camera.position.set(0,0,1);

//Renderer init
renderer = new THREE.WebGLRenderer();
canvas = renderer.domElement;
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(canvas);
window.addEventListener( 'resize', onWindowResize );

//Raycaster init
raycaster = new THREE.Raycaster();

//Orbit Controls
controls = new OrbitControls(camera, canvas);

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

//Loader init
loader = new THREE.TextureLoader();

//Light
const light = new THREE.PointLight(0xffffff, 1, 7);
light.position.set(0, 0, 0);
scene.add(light);

const ambient = new THREE.AmbientLight(0x4f4f4f);
scene.add(ambient);

//Planes
const planeWidth = 2;
const planeHeight = 2;
const scale = 5;

//Bottom plane
const bottomGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight * scale);
const bottomMaterial = new THREE.MeshPhongMaterial({
  color: "red",
  side: THREE.DoubleSide,
});
const bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
bottom.position.set(0,-planeHeight/2,0);
bottom.rotation.x = Math.PI/2;
scene.add(bottom);

//Top plane
const topGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight * scale);
const topMaterial = new THREE.MeshPhongMaterial({
  color: "blue",
  side: THREE.DoubleSide
});
const top = new THREE.Mesh(topGeometry, topMaterial);
top.position.set(0,planeHeight/2,0);
top.rotation.x = Math.PI/2;
scene.add(top);

//Left Plane
const leftGeometry = new THREE.PlaneGeometry(planeWidth * scale, planeHeight);
const leftMaterial = new THREE.MeshPhongMaterial({
  color: "yellow",
  side: THREE.DoubleSide
});
const left = new THREE.Mesh(leftGeometry, leftMaterial);
left.position.set(-planeHeight/2,0,0);
left.rotation.y = Math.PI/2;
scene.add(left);

//Right Plane
const rightGeometry = new THREE.PlaneGeometry(planeWidth * scale, planeHeight);
const rightMaterial = new THREE.MeshPhongMaterial({
  color: "green",
  side: THREE.DoubleSide,
  wireframe: true
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
  side: THREE.DoubleSide,
});
const farPlane = new THREE.Mesh(farGeometry, farMaterial);
farPlane.position.set(0,0,-planeWidth/2);
//scene.add(farPlane);

const frameGeometry = new THREE.PlaneGeometry(planeWidth/2, planeHeight/2);
const frameMaterial = new THREE.MeshPhongMaterial({
  //color: "purple"
  side: THREE.DoubleSide,
  map: loader.load('./images/gamerjibe_test.jpg')
});
const framePlane = new THREE.Mesh(frameGeometry, frameMaterial);
framePlane.position.set(-planeWidth/2 + 0.001,0,0);
framePlane.rotation.y = Math.PI/2;
scene.add(framePlane);

const borderGeometry = new THREE.PlaneGeometry(planeWidth/2 + 0.05, planeHeight/2 + 0.05);
const borderMaterial = new THREE.MeshPhongMaterial({
  color: "black",
  side: THREE.DoubleSide,
});
const borderPlane = new THREE.Mesh(borderGeometry, borderMaterial);
borderPlane.position.set(-planeWidth/2 + 0.0005,0,0);
borderPlane.rotation.y = Math.PI/2;
scene.add(borderPlane);

const ballGeometry = new THREE.SphereGeometry(0.4, 32, 32);
ballMaterial = new THREE.MeshPhongMaterial({
  //color: "white",
  map: loader.load('./images/gamerjibe_test.jpg')
})
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(0,0,-3);
scene.add(ball);



render();

}

function render() {
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  if ( intersects.length > 0 ) {

    if ( INTERSECTED != intersects[ 0 ].object ) {

      if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

      INTERSECTED = intersects[ 0 ].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex( 0xff0000 );

    }

  } else {

    if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

    INTERSECTED = null;

  }

  controls.update();
  render();
}

addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;
})

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}


function setupCanvasDrawing() {

  // get canvas and context

  const drawingCanvas = document.getElementById( 'drawing-canvas' );
	const drawingContext = drawingCanvas.getContext( '2d' );

  // draw white background
  drawingContext.fillStyle = '#FFFFFF';
	drawingContext.fillRect( 0, 0, 128, 128 );

  drawingContext.fillRect( 0, 0, 128, 128 );

  // set canvas as material.map (this could be done to any map, bump, displacement etc.)

  ballMaterial.map = new THREE.CanvasTexture( drawingCanvas );

  // set the variable to keep track of when to draw

  let paint = false;

  // add canvas event listeners
  drawingCanvas.addEventListener( 'pointerdown', function ( e ) {

    paint = true;
    drawStartPos.set( e.offsetX, e.offsetY );

  } );

  drawingCanvas.addEventListener( 'pointermove', function ( e ) {

    if ( paint ) draw( drawingContext, e.offsetX, e.offsetY );

  } );

  drawingCanvas.addEventListener( 'pointerup', function () {

    paint = false;

  } );

  drawingCanvas.addEventListener( 'pointerleave', function () {

    paint = false;

  } );

}

function draw( drawContext, x, y ) {

  drawContext.moveTo( drawStartPos.x, drawStartPos.y );
  drawContext.strokeStyle = '#000000';
  drawContext.lineTo( x, y );
  drawContext.stroke();
  // reset drawing start position to current position.
  drawStartPos.set( x, y );
  // need to flag the map as needing updating.
  ballMaterial.map.needsUpdate = true;

}
