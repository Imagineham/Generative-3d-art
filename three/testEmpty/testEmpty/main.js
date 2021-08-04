/*
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';


let renderer, canvas, camera;


function main() {
  renderer = new THREE.WebGLRenderer();
  canvas = renderer.domElement;
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
  document.body.appendChild(canvas);
  window.addEventListener( 'resize', onWindowResize );
  renderer.autoClearColor = false;

  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  const scene = new THREE.Scene();

  const sceneBG = new THREE.Scene();
  const cameraBG = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);

  let bgMesh;
  let bgTexture;
  {
    const loader = new THREE.TextureLoader();
    bgTexture = loader.load('https://threejsfundamentals.org/threejs/resources/images/beach.jpg');
    const planeGeo = new THREE.PlaneGeometry(2, 2);
    const planeMat = new THREE.MeshBasicMaterial({
      map: bgTexture,
      depthTest: false,
    });
    bgMesh = new THREE.Mesh(planeGeo, planeMat);
    sceneBG.add(bgMesh);
  }

  function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
    const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
    const halfFovY = THREE.MathUtils.degToRad(camera.fov * .5);
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
    // compute a unit vector that points in the direction the camera is now
    // in the xz plane from the center of the box
    const direction = (new THREE.Vector3())
        .subVectors(camera.position, boxCenter)
        .multiply(new THREE.Vector3(1, 0, 1))
        .normalize();

    // move the camera to a position distance units way from the center
    // in whatever direction the camera was from the center already
    camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

    // pick some near and far values for the frustum that
    // will contain the box.
    camera.near = boxSize / 100;
    camera.far = boxSize * 100;

    camera.updateProjectionMatrix();

    // point the camera to look at the center of the box
    camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
  }

  {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('https://threejsfundamentals.org/threejs/resources/models/3dbustchallange_submission/scene.gltf', (gltf) => {
      const root = gltf.scene;
      scene.add(root);

      // fix materials from r114
      root.traverse(({material}) => {
        if (material) {
          material.depthWrite = true;
        }
      });

      // compute the box that contains all the stuff
      // from root and below
      const box = new THREE.Box3().setFromObject(root);

      const boxSize = box.getSize(new THREE.Vector3()).length();
      const boxCenter = box.getCenter(new THREE.Vector3());

      // set the camera to frame the box
      frameArea(boxSize * 0.4, boxSize, boxCenter, camera);

      // update the Trackball controls to handle the new size
      controls.maxDistance = boxSize * 10;
      controls.target.copy(boxCenter);
      controls.update();
    });
  }

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

  function render() {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      const canvasAspect = canvas.clientWidth / canvas.clientHeight;
      camera.aspect = canvasAspect;
      camera.updateProjectionMatrix();

      // scale the background plane to keep the image's
      // aspect correct.
      // Note the image may not have loaded yet.
      const imageAspect = bgTexture.image ? bgTexture.image.width / bgTexture.image.height : 1;
      const aspect = imageAspect / canvasAspect;
      bgMesh.scale.x = aspect > 1 ? aspect : 1;
      bgMesh.scale.y = aspect > 1 ? 1 : 1 / aspect;
    }

    renderer.render(sceneBG, cameraBG);
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
  
	renderer.setSize( window.innerWidth, window.innerHeight );
  
  }


main();

*/
import './style.css'
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {EffectComposer} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/postprocessing/RenderPass.js';
import {FilmPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/postprocessing/FilmPass.js';

let scene, camera, renderer, canvas, composer;

let loader, light;

let geometry, material, mesh;
let then = 0;

init();

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
	//window.addEventListener( 'resize', onWindowResize );


	/* draw image
	* code from: https://threejs.org/docs/#api/en/loaders/ImageLoader
	*/
	// instantiate a loader
	loader = new THREE.TextureLoader();

	light = new THREE.PointLight( 0xffffff, 1, 0 );

	// Specify the light's position
	light.position.set(1, 1, 100 );

	scene.add(light);
	

	geometry = new THREE.PlaneGeometry(10, 10*.75);

	material = new THREE.MeshLambertMaterial({
	map: loader.load('./images/gamerjibe_test.jpg'),
	});

	// combine our image geometry and material into a mesh
	mesh = new THREE.Mesh(geometry, material);

	// set the position of the image mesh in the x,y,z dimensions
	mesh.position.set(0,0,0)

	// add the image to the scene
	scene.add(mesh);

	composer = new EffectComposer(renderer);
	composer.addPass(new RenderPass(scene, camera));

	const filmPass = new FilmPass(
		0.35,   // noise intensity
		0.025,  // scanline intensity
		648,    // scanline count
		true,  // grayscale
	);
	filmPass.renderToScreen = true;
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
	   
		renderer.render(scene, camera);
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
