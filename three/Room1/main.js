import './style.css'
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {EffectComposer} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/postprocessing/RenderPass.js';
import {GUI} from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';
import {FilmPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/postprocessing/FilmPass.js';


//Constants
let scene, camera, renderer, canvas, raycaster, INTERSECTED;

let lutTextures, lutSettings, effectLUT, effectLUTNearest, composer;

//camera parameters
let fov, aspectRatio, near, far, controls; 
//loader
let loader;
let then = 0;

//Rotating shapes
let ball, box;

//drawing Canvas constants
let ballMaterial, boxMaterial, imgGeometry, imgMaterial;

const mouse = {
  x: undefined,
  y: undefined
}

init();
//setupCanvasDrawing();
animate();

function init() {

  //Scene init
  scene = new THREE.Scene();

  //Camera init
  fov = 75;
  aspectRatio = innerWidth/innerHeight;
  near = 0.1; 
  far = 1000;
  camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);


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
  camera.position.set(2,3,0);

  controls.update();

  //Loader init
  loader = new THREE.TextureLoader();
  const gamerJibe = loader.load('./images/gamerjibe_test.jpg');
  const polkaDots = loader.load('./images/polkaDots.png');
  const honeycomb = loader.load('./images/honeycomb.png');
  const argyle = loader.load('./images/argyle.png');
  const checks = loader.load('./images/checks.png');
  const chevron = loader.load('./images/chevron.png');

  const skyBoxtexture = loader.load(
    './images/blackAndWhiteRoom.jpg',
    () => {
      const rt = new THREE.WebGLCubeRenderTarget(skyBoxtexture.image.height);
      rt.fromEquirectangularTexture(renderer, skyBoxtexture);
      //scene.background = rt.texture;
    });

  //Light
  const light = new THREE.AmbientLight( 0xffffff ); // soft white light
  scene.add( light );

  //Planes
  const planeWidth = 2;
  const planeHeight = 2;
  const scale = 15;

  //floor plane
  const floorGeo = new THREE.PlaneGeometry(planeWidth * scale, planeHeight * scale * 5);
  const floorMat = new THREE.MeshNormalMaterial({
    side: THREE.DoubleSide,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.set(0,-planeHeight/2,0);
  floor.rotation.x = Math.PI/2;
  scene.add(floor);

  //Top plane
  const topGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight * scale);
  const topMaterial = new THREE.MeshPhongMaterial({
    color: "blue",
    side: THREE.DoubleSide
  });
  const top = new THREE.Mesh(topGeometry, topMaterial);
  top.position.set(0,planeHeight/2,0);
  top.rotation.x = Math.PI/2;
  //scene.add(top);

  //Left Plane
  const leftGeometry = new THREE.PlaneGeometry(planeHeight * scale * 5, planeHeight * 5);
  const leftMaterial = new THREE.MeshPhongMaterial({
    color: "yellow",
    side: THREE.DoubleSide
  });
  const left = new THREE.Mesh(leftGeometry, leftMaterial);
  left.position.set(-(planeWidth * scale)/2,4,0);
  left.rotation.y = Math.PI/2;
  scene.add(left);

  //Right Plane
  argyle.anisotropy = renderer.capabilities.getMaxAnisotropy();
  argyle.matrixAutoUpdate = false;
  argyle.wrapS = argyle.wrapT = THREE.RepeatWrapping;
  argyle.matrix.scale(10, 0.7);
  argyle.matrix.rotate(2);
  render();
  const rightGeometry = new THREE.PlaneGeometry(planeHeight * scale * 5, planeHeight * 5);
  const rightMaterial = new THREE.MeshPhongMaterial({
    map: argyle,
    side: THREE.DoubleSide
  });
  const right = new THREE.Mesh(rightGeometry, rightMaterial);
  right.position.set((planeWidth * scale)/2,4,0);
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

  imgGeometry = new THREE.PlaneGeometry(planeWidth * scale / 4, planeHeight * scale / 4);
  imgMaterial = new THREE.MeshPhongMaterial({
    //color: "purple",
    side: THREE.DoubleSide,
  });

  const imgPlane = new THREE.Mesh(imgGeometry, imgMaterial);
  imgPlane.position.set(-(planeWidth * scale)/2 + 0.05,3,0);
  imgPlane.rotation.y = Math.PI/2;
  imgPlane.material.map = gamerJibe;
  imgPlane.material.map.flipY = true;

  ///other images////
  const polkaGeometry = new THREE.PlaneGeometry(planeWidth * scale / 4, planeHeight * scale / 4);
  const polkaMaterial = new THREE.MeshPhongMaterial({
    //color: "purple",
    side: THREE.DoubleSide,
  });

  const polkaPlane = new THREE.Mesh(polkaGeometry, polkaMaterial);
  polkaPlane.position.set(-(planeWidth * scale)/2 + 0.05,3,25);
  polkaPlane.rotation.y = Math.PI/2;
  polkaPlane.material.map = polkaDots;

  const hexaGeometry = new THREE.PlaneGeometry(planeWidth * scale / 4, planeHeight * scale / 4);
  const hexaMaterial = new THREE.MeshPhongMaterial({
    //color: "purple",
    side: THREE.DoubleSide,
  });

  const hexaPlane = new THREE.Mesh(hexaGeometry, hexaMaterial);
  hexaPlane.position.set(-(planeWidth * scale)/2 + 0.05,3,50);
  hexaPlane.rotation.y = Math.PI/2;
  hexaPlane.material.map = honeycomb;

  const chevGeometry = new THREE.PlaneGeometry(planeWidth * scale / 4, planeHeight * scale / 4);
  const chevMaterial = new THREE.MeshPhongMaterial({
    //color: "purple",
    side: THREE.DoubleSide,
  });

  const chevPlane = new THREE.Mesh(chevGeometry, chevMaterial);
  chevPlane.position.set(-(planeWidth * scale)/2 + 0.05,3,-25);
  chevPlane.rotation.y = Math.PI/2;
  chevPlane.material.map = chevron;

  const checksGeometry = new THREE.PlaneGeometry(planeWidth * scale / 4, planeHeight * scale / 4);
  const checksMaterial = new THREE.MeshPhongMaterial({
    //color: "purple",
    side: THREE.DoubleSide,
  });

  const checksPlane = new THREE.Mesh(checksGeometry, checksMaterial);
  checksPlane.position.set(-(planeWidth * scale)/2 + 0.05,3,-50);
  checksPlane.rotation.y = Math.PI/2;
  checksPlane.material.map = checks;


  ///add art to scene!
  scene.add(imgPlane);
  scene.add(polkaPlane);
  scene.add(hexaPlane);
  scene.add(chevPlane);
  scene.add(checksPlane);





  const borderGeometry = new THREE.PlaneGeometry((planeWidth * scale / 4) + 0.2, (planeHeight * scale / 4) + 0.2);
  const borderMaterial = new THREE.MeshPhongMaterial({
    color: "black"
  });
  const borderPlane = new THREE.Mesh(borderGeometry, borderMaterial);
  borderPlane.position.set(-(planeWidth * scale)/2 + 0.003,3,0);
  borderPlane.rotation.y = Math.PI/2;
  scene.add(borderPlane);

  const ballGeometry = new THREE.SphereGeometry(100, 32, 32);
  ballMaterial = new THREE.MeshNormalMaterial({
    wireframe: true,
    side: THREE.DoubleSide
  })
  ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.position.set(0,0,-3);
  scene.add(ball);


  const boxGeometry = new THREE.BoxGeometry(50, 50, 150);
  boxMaterial = new THREE.MeshPhongMaterial({
    //color: "white",
    map: gamerJibe,
    side: THREE.DoubleSide,
    wireframe: true
  })
  box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.position.set(0,0,0);
  box.material.map.flipY = false;
  scene.add(box);



  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  console.log(composer);
	const filmPass = new FilmPass(
		0.35,   // noise intensity
		0.025,  // scanline intensity
		648,    // scanline count
		true,  // grayscale
	);

	//filmPass.enabled = false;
  filmPass.renderToScreen = true;
	composer.addPass(filmPass);
  composer.setSize(canvas.width, canvas.height);
    

}

function render() {
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
  //composer.render();

  ball.rotation.y += 0.001;
  ball.rotation.x += 0.001;
  ball.rotation.z -= 0.001;
  box.rotation.z += 0.005;

  /* raycaster.setFromCamera(mouse, camera);
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

  }\
  */
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



























/*

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
  boxMaterial.map = ballMaterial.map;

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

*/