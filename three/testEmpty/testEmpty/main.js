import './style.css'
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import { BasisTextureLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/BasisTextureLoader.js';


document.querySelector('#app').innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`

//Creates the scene object
const scene = new THREE.Scene();

//CReates the camera object
const camera = new THREE.PerspectiveCamera(
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

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild( renderer.domElement );

/* draw image
 * code from: https://threejs.org/docs/#api/en/loaders/ImageLoader
 */

// instantiate a loader
const loader = new THREE.TextureLoader();

/*
// load a image resource
loader.load(
	// resource URL
	'./images/gamerjibe_test.jpg',

	// onLoad callback
	function ( image ) {
		// use the image, e.g. draw part of it on a canvas
		const canvas = renderer.domElement;
    console.log(canvas)
		const context = canvas.getContext('webgl');
    console.log(context);
		context.drawImage( image, 20, 20 );
	},

	// onProgress callback currently not supported
	undefined,

	// onError callback
	function () {
		console.error( 'An error happened.' );
	}

);
*/

var light = new THREE.PointLight( 0xffffff, 1, 0 );

// Specify the light's position
light.position.set(1, 1, 100 );

scene.add(light);

var material = new THREE.MeshLambertMaterial({
  map: loader.load('./images/gamerjibe_test.jpg')
});


var geometry = new THREE.PlaneGeometry(10, 10*.75);

// combine our image geometry and material into a mesh
var mesh = new THREE.Mesh(geometry, material);

// set the position of the image mesh in the x,y,z dimensions
mesh.position.set(0,0,0)

// add the image to the scene
scene.add(mesh);

function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
}

animate();