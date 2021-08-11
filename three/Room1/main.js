import './style.css'
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {EffectComposer} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/postprocessing/RenderPass.js';
import * as dat from 'dat.gui';
import {FilmPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/postprocessing/FilmPass.js';


//Constants
let mainScene, mainCamera, renderer, canvas;
let mainComposer, filmRenderTarget;
let raycaster, INTERSECTED, CLICK, gamerjibeScene, gamerjibeComposer;
let mouse = {
  x: undefined,
  y: undefined
}
let gui, folder1;

const rtWidth = 512;
  const rtHeight = 512;
  let rtParameters = { 
    minFilter: THREE.LinearFilter, 
    magFilter: THREE.LinearFilter, 
    format: THREE.RGBAFormat, 
    stencilBuffer: false 
  };

/* Array of Gallery Pieces
 * artworks will be passed into the raycaster so that 
 * the raycaster does not need to check if everything is being selected
 * just artworks
 */
let artworks = [];

//main camera parameters
let fov, aspectRatio, near, far, controls; 
//loader
let loader;

//Rotating shapes
let ball, box;

//drawing Canvas constants
let ballMaterial, boxMaterial, gamerJibeGeo, gamerjibeMat;
init();
//setupCanvasDrawing();
animate();

function init() {

  //render targets!
  const filmRenderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight, rtParameters);
  const mainRenderTarget = new THREE.WebGLRenderTarget(innerWidth, innerHeight, rtParameters);

  //Scene init
  mainScene = new THREE.Scene();

  //Camera init
  fov = 75;
  aspectRatio = innerWidth/innerHeight;
  near = 0.1; 
  far = 1000;
  mainCamera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);

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
  controls = new OrbitControls(mainCamera, canvas);
  mainCamera.position.set(1,0,0);

  //Loader init
  loader = new THREE.TextureLoader();
  const gamerJibe = loader.load('./images/gamerjibe_test.jpg');
  const polkaDots = loader.load('./images/polkaDots.png');
  const hexagons = loader.load('./images/honeycomb.png');
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
  mainScene.add( light );

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
  mainScene.add(floor);

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
  mainScene.add(left);

  //Right Plane
  argyle.anisotropy = renderer.capabilities.getMaxAnisotropy();
  argyle.matrixAutoUpdate = false;
  argyle.wrapS = argyle.wrapT = THREE.RepeatWrapping;
  argyle.matrix.scale(10, 0.7);
  argyle.matrix.rotate(2);


  const rightGeometry = new THREE.PlaneGeometry(planeHeight * scale * 5, planeHeight * 5);
  const rightMaterial = new THREE.MeshPhongMaterial({
    map: argyle,
    side: THREE.DoubleSide
  });
  const right = new THREE.Mesh(rightGeometry, rightMaterial);
  right.position.set((planeWidth * scale)/2,4,0);
  right.rotation.y = -Math.PI/2;
  mainScene.add(right);

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

  gamerJibeGeo = new THREE.PlaneGeometry(planeWidth * scale / 4, planeHeight * scale / 4);
  gamerjibeMat = new THREE.MeshPhongMaterial({
    map: filmRenderTarget.texture,
    side: THREE.DoubleSide,
  });
  const gamerjibeMesh = new THREE.Mesh(gamerJibeGeo, gamerjibeMat);
  gamerjibeMesh.position.set(-(planeWidth * scale)/2 + 0.05,3,0);
  gamerjibeMesh.rotation.y = Math.PI/2;

  ///other images////
  const polkaGeometry = new THREE.PlaneGeometry(planeWidth * scale / 4, planeHeight * scale / 4);
  const polkaMaterial = new THREE.MeshPhongMaterial({
    //color: "purple",
    side: THREE.DoubleSide,
  });

  const polkaMesh = new THREE.Mesh(polkaGeometry, polkaMaterial);
  polkaMesh.position.set(-(planeWidth * scale)/2 + 0.05,3,25);
  polkaMesh.rotation.y = Math.PI/2;
  polkaMesh.material.map = polkaDots;

  const hexaGeometry = new THREE.PlaneGeometry(planeWidth * scale / 4, planeHeight * scale / 4);
  const hexaMaterial = new THREE.MeshPhongMaterial({
    //color: "purple",
    side: THREE.DoubleSide,
  });

  const hexaMesh = new THREE.Mesh(hexaGeometry, hexaMaterial);
  hexaMesh.position.set(-(planeWidth * scale)/2 + 0.05,3,50);
  hexaMesh.rotation.y = Math.PI/2;
  hexaMesh.material.map = hexagons;

  const chevGeometry = new THREE.PlaneGeometry(planeWidth * scale / 4, planeHeight * scale / 4);
  const chevMaterial = new THREE.MeshPhongMaterial({
    //color: "purple",
    side: THREE.DoubleSide,
  });

  const chevronMesh = new THREE.Mesh(chevGeometry, chevMaterial);
  chevronMesh.position.set(-(planeWidth * scale)/2 + 0.05,3,-25);
  chevronMesh.rotation.y = Math.PI/2;
  chevronMesh.material.map = chevron;

  const checksGeometry = new THREE.PlaneGeometry(planeWidth * scale / 4, planeHeight * scale / 4);
  const checksMaterial = new THREE.MeshPhongMaterial({
    //color: "purple",
    side: THREE.DoubleSide,
  });

  const checksMesh = new THREE.Mesh(checksGeometry, checksMaterial);
  checksMesh.position.set(-(planeWidth * scale)/2 + 0.05,3,-50);
  checksMesh.rotation.y = Math.PI/2;
  checksMesh.material.map = checks;


  ///add art to scene!
  mainScene.add(gamerjibeMesh);
  mainScene.add(polkaMesh);
  mainScene.add(hexaMesh);
  mainScene.add(chevronMesh);
  mainScene.add(checksMesh);

  //add art to artworks array
  artworks.push(gamerjibeMesh, polkaMesh, hexaMesh, chevronMesh, checksMesh);

  //for each artwork created its render Target scene
  gamerjibeScene = makeArtScene(gamerJibe);
  gamerjibeComposer = makeFilmComposer(gamerjibeScene, filmRenderTarget);
  //let polkaScene = makeArtScene(polkaDots);
  //let hexaScene = makeArtScene(hexagons);
  //let chevronScene = makeArtScene(chevron);
  //let checksScene = makeArtScene(checks);


  const borderGeometry = new THREE.PlaneGeometry((planeWidth * scale / 4) + 0.2, (planeHeight * scale / 4) + 0.2);
  const borderMaterial = new THREE.MeshPhongMaterial({
    color: "black"
  });
  const borderPlane = new THREE.Mesh(borderGeometry, borderMaterial);
  borderPlane.position.set(-(planeWidth * scale)/2 + 0.003,3,0);
  borderPlane.rotation.y = Math.PI/2;
  mainScene.add(borderPlane);

  const ballGeometry = new THREE.SphereGeometry(100, 32, 32);
  ballMaterial = new THREE.MeshNormalMaterial({
    wireframe: true,
    side: THREE.DoubleSide
  })
  ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.position.set(0,0,-3);
  mainScene.add(ball);


  const boxGeometry = new THREE.BoxGeometry(50, 50, 150);
  boxMaterial = new THREE.MeshPhongMaterial({
    //color: "white",
    map: gamerJibe,
    side: THREE.DoubleSide,
    wireframe: true
  })
  box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.position.set(0,0,0);
  mainScene.add(box);



  mainComposer = new EffectComposer(renderer, mainRenderTarget);
  mainComposer.addPass(new RenderPass(mainScene, mainCamera));
  mainComposer.setSize(canvas.width, canvas.height);
    

}

function render() {
  //renderer.render(mainScene, mainCamera);
  controls.object = mainCamera;
  gamerjibeComposer.passes[1].enabled = true;
  gamerjibeComposer.render();
  mainComposer.render();
  CLICK = false;
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  
  if(!CLICK) {
    render();
  } else {
    controls.object = gamerjibeScene.camera;
    gamerjibeComposer.render();
  }
  

  ball.rotation.y += 0.001;
  ball.rotation.x += 0.001;
  ball.rotation.z -= 0.001;
  box.rotation.z += 0.005;

  raycaster.setFromCamera(mouse, mainCamera);
  const intersects = raycaster.intersectObjects(artworks);

  if ( intersects.length > 0 ) {
    if ( INTERSECTED != intersects[ 0 ].object ) {
      if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
      INTERSECTED = intersects[ 0 ].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex( 0xAFAFAF );
    }
  } else {
    if (INTERSECTED) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
    INTERSECTED = null;
  }

}

function onWindowResize() {

  mainCamera.aspect = window.innerWidth / window.innerHeight;
  mainCamera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;
})

addEventListener('click', () => {
  if(INTERSECTED && !CLICK) {
    gui = new dat.GUI();
    folder1 = gui.addFolder('FilmPass');
    //the first pass is the renderpass! 
    folder1.add(gamerjibeComposer.passes[1], 'enabled');
    CLICK = true;
  } else {
    //CLICK = false;
  }
})

addEventListener('keydown', (e) => {
  //27 is ESC
  if (e.keyCode === 27) {
    gui.destroy();
    render();
  } else {
  }
})

function makeArtScene(texture) {
  let artScene = {
    scene: undefined, 
    camera: undefined
  }

  //create render target Scene
  const rtScene = new THREE.Scene();

  //create render target Camera
  const rtFov = 75;
  const rtAspect = rtWidth / rtHeight;
  const rtNear = 0.1;
  const rtFar = 500;
  const rtCamera = new THREE.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar);
  rtCamera.position.z = 12;

  //add light source to scene
  const ambientLight = new THREE.AmbientLight( 0xffffff ); // soft white light
  
  //add plane for texture 
  const geometry = new THREE.PlaneGeometry(20, 20);
  const material = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide
  });
  const plane = new THREE.Mesh(geometry, material);
  rtScene.add( ambientLight );
  rtScene.add( plane );

  artScene.scene = rtScene;
  artScene.camera = rtCamera

  return artScene;
}

function makeFilmComposer(artScene, renderTarget) {
  //create composer targeting desired render target
  let filmComposer = new EffectComposer(renderer, renderTarget);

  //add render target scene and camera to composer using RenderPass
  filmComposer.addPass(new RenderPass(artScene.scene, artScene.camera));
  let filmPass = new FilmPass(
		1,   // noise intensity
		0.025,  // scanline intensity
		648,    // scanline count
		true,  // grayscale
	);
  
  filmComposer.addPass(filmPass);
  filmComposer.setSize(innerWidth, innerHeight);

  return filmComposer;
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



