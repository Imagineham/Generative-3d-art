import './style.css'
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import { BasisTextureLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/BasisTextureLoader.js';
import { Lut } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/math/Lut.js';

let scene, camera, renderer, canvas;

let loader, lut, light;

let geometry, material, mesh;

init();
animate();

function init() {
	//Creates the scene object
	scene = new THREE.Scene();

	//CReates the camera object
	camera = new THREE.PerspectiveCamera(
	75,
	innerWidth/innerHeight,
	0.1,
	1000
	);

	/* this pushes the camera along the positive z azis
	* which for three.js is towards us. 
	* A positive value will let us see rendered
	* objects at z positions of 0
	*/
	camera.position.z = 10;

	/* creates the renderer object
	* and sets the pixel ratio
	*/
	renderer = new THREE.WebGLRenderer({antialias: true});
	canvas = renderer.domElement;
	renderer.setSize(innerWidth, innerHeight);
	renderer.setPixelRatio(devicePixelRatio);
	document.body.appendChild( canvas);
	window.addEventListener( 'resize', onWindowResize );

	/* draw image
	* code from: https://threejs.org/docs/#api/en/loaders/ImageLoader
	*/
	// instantiate a loader
	loader = new THREE.TextureLoader();

	light = new THREE.PointLight( 0xffffff, 1, 0 );

	// Specify the light's position
	light.position.set(1, 1, 100 );

	scene.add(light);

	lut = new Lut('grayscale', 512);




	geometry = new THREE.PlaneGeometry(10, 10*.75);

	material = new THREE.MeshLambertMaterial({
		map: new THREE.CanvasTexture( lut.createCanvas() ),
	map: loader.load('./images/gamerjibe_test.jpg'),
	});

	// combine our image geometry and material into a mesh
	mesh = new THREE.Mesh(geometry, material);

	// set the position of the image mesh in the x,y,z dimensions
	mesh.position.set(0,0,0)

	// add the image to the scene
	scene.add(mesh);

	console.log(canvas.getContext('webgl'))
}

function animate() {
  requestAnimationFrame( animate );
  render();
}


function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
  
	renderer.setSize( window.innerWidth, window.innerHeight );
  
}

function render() {
	renderer.render(scene, camera);
	//lut.updateCanvas(canvas);
}


animate();