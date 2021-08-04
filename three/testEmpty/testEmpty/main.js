import './style.css'
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {EffectComposer} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/postprocessing/RenderPass.js';
import {FilmPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/postprocessing/FilmPass.js';

let scene, rtScene, camera, renderer, canvas, composer, renderTarget;

let loader, light;

let geometry, material, mesh;
let then = 0;

init();

function init() {
	//Creates the scene object
	scene = new THREE.Scene();
	scene.background = new THREE.Color('red');
	rtScene = new THREE.Scene();

	const boxGeometry = new THREE.BoxGeometry(10, 10, 0.8);
	const boxMaterial = new THREE.MeshPhongMaterial({
		color: "blue",
	})
	const box = new THREE.Mesh(boxGeometry, boxMaterial);
	box.position.set(0,0,0);
	rtScene.add(box);

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
	document.body.appendChild(canvas);
	//window.addEventListener( 'resize', onWindowResize );

	renderTarget = new THREE.WebGLRenderTarget(512, 512);


	/* draw image
	* code from: https://threejs.org/docs/#api/en/loaders/ImageLoader
	*/
	// instantiate a loader
	loader = new THREE.TextureLoader();

	light = new THREE.PointLight( 0xffffff, 1, 0 );

	// Specify the light's position
	light.position.set(1, 1, 100 );

	scene.add(light);
	const light2 = light.clone();
	//rtScene.add(light2);
	

	geometry = new THREE.PlaneGeometry(10, 10 * .75);

	material = new THREE.MeshLambertMaterial({
	map: loader.load('./images/gamerjibe_test.jpg'),
	});

	// combine our image geometry and material into a mesh
	mesh = new THREE.Mesh(geometry, material);

	// set the position of the image mesh in the x,y,z dimensions
	mesh.position.set(0,0,1)

	// add the image to the scene
	rtScene.add(mesh);
	scene.add(rtScene);
	

	composer = new EffectComposer(renderer);
	composer.addPass(new RenderPass(scene, camera));

	const filmPass = new FilmPass(
		1,   // noise intensity
		0.025,  // scanline intensity
		648,    // scanline count
		true,  // grayscale
	);

	//filmPass.enabled = false;
	composer.addPass(filmPass);

	function resizeRendererToDisplaySize(renderer) {
		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if (needResize) {
		  renderer.setSize(width, height, false);
		}
		return needResize;
	  }

	  function render(now) {
		now *= 0.001;  // convert to seconds
		const deltaTime = now - then;
		then = now;
	   
		if (resizeRendererToDisplaySize(renderer)) {
		  const canvas = renderer.domElement;
		  camera.aspect = canvas.clientWidth / canvas.clientHeight;
		  camera.updateProjectionMatrix();
		  composer.setSize(canvas.width, canvas.height);
		}
	   
		composer.render(deltaTime);
	   
		requestAnimationFrame(render);
	  } 

	  requestAnimationFrame(render);
}



function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
  
	composer.setSize( window.innerWidth, window.innerHeight );
  
}
