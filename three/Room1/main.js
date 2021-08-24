import './style.css'
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {EffectComposer} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/postprocessing/RenderPass.js';
import * as dat from 'dat.gui';
import {FilmPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/postprocessing/FilmPass.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';


//Constants
let mainScene, mainCamera, renderer, canvas;
let mainComposer, filmRenderTarget;
let raycaster, INTERSECTED, CLICK, gamerjibeScene, gamerjibeComposer;
let mouse = {
  x: undefined,
  y: undefined
}
let gui, folder1, folder2;


let spotlightBool = {
  helperEnabled: true
}

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
let artworks = [], renderTargets = [], currentArtworkIndex;

//main camera parameters
let fov, aspectRatio, near, far, controls; 
//loader
let loader, objLoader, mtlLoader;

//Rotating shapes
let ball, box;

//drawing Canvas constants
let ballMaterial, boxMaterial;
init();
//setupCanvasDrawing();
animate();

function init() {

  //render targets!
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
  renderer = new THREE.WebGLRenderer({
    preserveDrawingBuffer: true
  });
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
  const gamerJibe = loader.load('./images/kanagawa.jpg');
  const polkaDots = loader.load('./images/monet.jpg');
  const hexagons = loader.load('./images/gogh.jpg');
  const argyle = loader.load('./images/argyle.png');
  const checks = loader.load('./images/monetSnow.jpg');
  const chevron = loader.load('./images/chevron.png');

  const skyBoxtexture = loader.load(
    './images/blackAndWhiteRoom.jpg',
    () => {
      const rt = new THREE.WebGLCubeRenderTarget(skyBoxtexture.image.height);
      rt.fromEquirectangularTexture(renderer, skyBoxtexture);
      //scene.background = rt.texture;
    });

  //Light
  const light = new THREE.AmbientLight( 0xffffff, 0.45 ); // soft white light
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

  {
    const spotLight = new THREE.SpotLight( 0xcfcfcf );
    spotLight.position.set( -(planeWidth * scale)/2 + 15,10,0);
    mainScene.add( spotLight );
    spotLight.target = right;
    spotLight.angle = Math.PI/2;
  }

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

  const gamerJibeGeo = new THREE.PlaneGeometry(planeWidth * scale / 4, planeHeight * scale / 4);
  const gamerjibeMat = new THREE.MeshPhongMaterial({
    map: gamerJibe,
    side: THREE.DoubleSide,
  });
  const gamerjibeMesh = new THREE.Mesh(gamerJibeGeo, gamerjibeMat);
  gamerjibeMesh.position.set(-(planeWidth * scale)/2 + 0.05,3,0);
  gamerjibeMesh.rotation.y = Math.PI/2;
  {
    const spotLight = new THREE.SpotLight( 0xcfcfcf );
    spotLight.position.set( -(planeWidth * scale)/2 + 15,10,0);
    mainScene.add( spotLight );
    spotLight.target = gamerjibeMesh;
    spotLight.angle = Math.PI/5.5;
    spotLight.penumbra = 1;
  }



  ///other images////
  const polkaGeometry = new THREE.PlaneGeometry(planeWidth * scale / 4, planeHeight * scale / 4);
  const polkaMaterial = new THREE.MeshPhongMaterial({
    //color: "purple",
    side: THREE.DoubleSide,
  });

  const polkaMesh = new THREE.Mesh(polkaGeometry, polkaMaterial);
  polkaMesh.position.set(-(planeWidth * scale)/2 + 1,3,25);
  polkaMesh.rotation.y = Math.PI/2;
  polkaMesh.material.map = polkaDots;
  {
    const spotLight = new THREE.SpotLight( 0xcfcfcf );
    spotLight.position.set( -(planeWidth * scale)/2 + 15,10,25);
    mainScene.add( spotLight );
    spotLight.target = polkaMesh;
    spotLight.angle = Math.PI/5.5;
    spotLight.penumbra = 1;
  }

  const hexaGeometry = new THREE.PlaneGeometry(planeWidth * scale / 4, planeHeight * scale / 4);
  const hexaMaterial = new THREE.MeshPhongMaterial({
    //color: "purple",
    side: THREE.DoubleSide,
  });

  const hexaMesh = new THREE.Mesh(hexaGeometry, hexaMaterial);
  hexaMesh.position.set(-(planeWidth * scale)/2 + 0.05,3,50);
  hexaMesh.rotation.y = Math.PI/2;
  hexaMesh.material.map = hexagons;
  {
    const spotLight = new THREE.SpotLight( 0xcfcfcf );
    spotLight.position.set( -(planeWidth * scale)/2 + 15,10,50);
    mainScene.add( spotLight );
    spotLight.target = hexaMesh;
    spotLight.angle = Math.PI/5.5;
    spotLight.penumbra = 1;
  }

  const chevGeometry = new THREE.PlaneGeometry(planeWidth * scale / 4, planeHeight * scale / 4);
  const chevMaterial = new THREE.MeshPhongMaterial({
    //color: "purple",
    side: THREE.DoubleSide,
  });

  const chevronMesh = new THREE.Mesh(chevGeometry, chevMaterial);
  chevronMesh.position.set(-(planeWidth * scale)/2 + 0.05,3,-25);
  chevronMesh.rotation.y = Math.PI/2;
  chevronMesh.material.map = chevron;
  {
    const spotLight = new THREE.SpotLight( 0xcfcfcf );
    spotLight.position.set( -(planeWidth * scale)/2 + 15,10,-25);
    mainScene.add( spotLight );
    spotLight.target = chevronMesh;
    spotLight.angle = Math.PI/5.5;
    spotLight.penumbra = 1;
  }

  const checksGeometry = new THREE.PlaneGeometry(planeWidth * scale / 4, planeHeight * scale / 4);
  const checksMaterial = new THREE.MeshPhongMaterial({
    //color: "purple",
    side: THREE.DoubleSide,
  });

  const checksMesh = new THREE.Mesh(checksGeometry, checksMaterial);
  checksMesh.position.set(-(planeWidth * scale)/2 + 0.05,3,-50);
  checksMesh.rotation.y = Math.PI/2;
  checksMesh.material.map = checks;
  {
    const spotLight = new THREE.SpotLight( 0xcfcfcf );
    spotLight.position.set( -(planeWidth * scale)/2 + 15,10,-50);
    mainScene.add( spotLight );
    spotLight.target = checksMesh;
    spotLight.angle = Math.PI/5.5;
    spotLight.penumbra = 1;
  }


  ///add art to scene!
  mainScene.add(gamerjibeMesh);
  mainScene.add(polkaMesh);
  mainScene.add(hexaMesh);
  mainScene.add(chevronMesh);
  mainScene.add(checksMesh);

  //add art to artworks array
  artworks.push(gamerjibeMesh, polkaMesh, hexaMesh, chevronMesh, checksMesh);

  //for each artwork created its render Target scene
  for(const art of artworks) {

    const filmRenderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight, rtParameters);

    let artScene = makeArtScene(art.material.map); 
    let artComposer = makeFilmComposer(artScene, filmRenderTarget)
    renderTargets.push({
      "root": artScene,
      "composer": artComposer
    });
  }

  for(let i = 0; i < artworks.length; i++) {
    artworks[i].material.map = renderTargets[i].composer.renderTarget2.texture;
  }


  //gamerjibeMesh.material.map = renderTargets[0].composer.renderTarget2.texture;


  //gamerjibeScene = makeArtScene(gamerJibe);
  //gamerjibeComposer = makeFilmComposer(gamerjibeScene, filmRenderTarget);
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
  console.log("controls" + controls.object)



  ///////OBJ LOADER////////////////////////////////
  renderTargets[3].root.scene.remove(renderTargets[3].root.scene.children[2]);
  mtlLoader = new MTLLoader();
  mtlLoader.load('models/windmill_001.mtl', (mtl) => {
    mtl.preload();
    mtl.materials.Material.side = THREE.DoubleSide;
    objLoader = new OBJLoader();
    objLoader.setMaterials(mtl);
    objLoader.load('models/windmill_001.obj', (root) => {
      root.position.set(0,-10,0);
      renderTargets[3].root.scene.add(root);
    });
  });

  {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf', (gltf) => {
      const root = gltf.scene;
      //renderTargets[3].root.scene.add(root);
      //console.log(dumpObject(root).join('\n'));

      // compute the box that contains all the stuff
      // from root and below
      const box = new THREE.Box3().setFromObject(root);

      const boxSize = box.getSize(new THREE.Vector3()).length();
      const boxCenter = box.getCenter(new THREE.Vector3());

      // set the camera to frame the box
      // update the Trackball controls to handle the new size
      controls.maxDistance = boxSize * 10;
      //controls.target.copy(boxCenter);
      controls.update();
    });
  }

}

function render() {
  //renderer.render(mainScene, mainCamera);
  controls.object = mainCamera;
  for(let i = 0; i < renderTargets.length; i++) {
    renderTargets[i].composer.passes[1].enabled = true;
    renderTargets[i].composer.render();
  }

  //renderTargets[currentArtworkIndex].composer.passes[1].enabled = true;
  //renderTargets[currentArtworkIndex].composer.render();
  //gamerjibeComposer.passes[1].enabled = true;
  //gamerjibeComposer.render();
  mainComposer.render();
  CLICK = false;
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  
  if(!CLICK) {
      renderTargets[0].composer.passes[1].enabled = true;
      renderTargets[0].composer.render();
    render();
  } else {
    controls.object = renderTargets[currentArtworkIndex].root.camera;  
    //gamerjibeScene.camera;
    renderTargets[currentArtworkIndex].composer.render();
    //amerjibeComposer.render();
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


    //renderTargets[4].root.scene.children[1].rotation.x += 0.001;
    renderTargets[4].root.scene.children[2].rotation.y += 0.001;
    //renderTargets[4].root.scene.children[1].rotation.z += 0.001;
    //renderTargets[4].root.scene.add(ball)
    //renderTargets[4].root.scene.children[2].rotation.y += 0.02;
    //renderTargets[4].root.scene.children[2].rotation.z += 0.001;

    
    
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

    currentArtworkIndex = (artworks.indexOf(INTERSECTED))

    gui = new dat.GUI();
    folder1 = gui.addFolder('FilmPass');
    folder2 = gui.addFolder('Lighting');       
    //the first pass is the renderpass! 
    console.log(currentArtworkIndex);
    folder1.add(renderTargets[currentArtworkIndex].composer.passes[1], 'enabled');
    folder1.add(renderTargets[currentArtworkIndex].composer.passes[1].uniforms.nIntensity, 'value').min(0).max(1).name("noise intensity");
    folder1.add(renderTargets[currentArtworkIndex].composer.passes[1].uniforms.sIntensity, 'value').min(0).max(1).name("scanline intensity")
    folder1.add(renderTargets[currentArtworkIndex].composer.passes[1].uniforms.sCount, 'value').min(0).max(4096).name("scanline count")
    folder1.add(renderTargets[currentArtworkIndex].composer.passes[1].uniforms.grayscale, 'value').name("grayscale")
    console.log(renderTargets[currentArtworkIndex].root.scene);
    
    folder2.add(spotlightBool, 'helperEnabled').onChange(function (val ) {
      //const spotLightHelper = new THREE.SpotLightHelper(renderTargets[currentArtworkIndex].root.scene.children[0]);
      //renderTargets[currentArtworkIndex].root.scene.add(spotLightHelper);

    })
    let spotLight = renderTargets[currentArtworkIndex].root.scene.children[0];
    const params = {
      'light color': spotLight.color.getHex(),
      intensity: spotLight.intensity,
      distance: spotLight.distance,
      angle: spotLight.angle,
      penumbra: spotLight.penumbra,
      decay: spotLight.decay,
      focus: spotLight.shadow.focus
    };
    folder2.addColor(params, 'light color').onChange( function ( val ) {

      spotLight.color.setHex( val );

    });
    folder2.add( params, 'intensity', 0, 2 ).onChange( function ( val ) {

      spotLight.intensity = val;

    } );
    folder2.add( params, 'distance', 50, 200 ).onChange( function ( val ) {

      spotLight.distance = val;

    } );
    folder2.add( params, 'angle', 0, Math.PI / 3 ).onChange( function ( val ) {

      spotLight.angle = val;

    } );
    folder2.add( params, 'penumbra', 0, 1 ).onChange( function ( val ) {

      spotLight.penumbra = val;

    } );
    folder2.add( params, 'decay', 1, 2 ).onChange( function ( val ) {

      spotLight.decay = val;

    } );
    folder2.add( params, 'focus', 0, 1 ).onChange( function ( val ) {

      spotLight.shadow.focus = val;

    } );

    //folder2.addColor(renderTargets[currentArtworkIndex].root.scene.children[0].color, 'g').min(0).max(1);
    //folder2.add(renderTargets[currentArtworkIndex].root.scene.children[0].color, 'b').min(0).max(1);
    //folder2.add(renderTargets[currentArtworkIndex].root.scene.children[0], 'intensity').min(0).max(1);
    CLICK = true;
  } else {
    //CLICK = false;
  }
})

addEventListener('keydown', (e) => {
  console.log(e.keyCode);

  switch(e.keyCode) {
    case 27: // 'ESC'
      if(gui) {
        gui.destroy();
      }
      render();
      break;
    case 67:
      if (renderTargets[currentArtworkIndex]) {
        //console.log(renderTargets[currentArtworkIndex].root.scene.children[1].geometry.parameters.width);
        //controls.object.fov = renderTargets[currentArtworkIndex].root.scene.children[1].geometry.parameters.width;
        //controls.object.updateProjectionMatrix();
        controls.object.position.set(0,-2,20)
      }
      //controls.update();
      break;
    case 83: //'S' foir screenshot
      canvas.toBlob((blob) => {
        saveBlob(blob, `Piece-${currentArtworkIndex}.png`)
      });
      break;
    default: 
    break;
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
  let rtFov = 75;
  const rtAspect = rtWidth / rtHeight;
  const rtNear = 0.1;
  const rtFar = 500;
  let rtCamera = new THREE.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar);
  rtCamera.position.z = 14;
  
  //add spotlights source to scene
  {
    const spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 0, 14, 10 );

    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    rtScene.add( spotLight );
  }

  
  //const ambientLight = new THREE.AmbientLight( 0xafafaf, 1 ); // soft white light
  



  //add floor plane
  {
    const floorSize = 100;
  
    const loader = new THREE.TextureLoader();
    const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = floorSize / 2;
    texture.repeat.set(repeats, repeats);
  
    const floorGeo = new THREE.PlaneGeometry(floorSize, floorSize);
    const floorMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(floorGeo, floorMat);
    mesh.position.set(0,-10.5,0);
    mesh.rotation.x = Math.PI * -.5;
    rtScene.add(mesh);
  }


  //add plane for texture 
  const geometry = new THREE.PlaneGeometry(20, 20);
  const material = new THREE.MeshPhongMaterial({
    map: texture,
    side: THREE.DoubleSide
  });
  const plane = new THREE.Mesh(geometry, material);
  //rtScene.add( ambientLight );
  rtScene.add( plane );


  artScene.scene = rtScene;
  artScene.camera = rtCamera;

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





const saveBlob = (function() {
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style.display = 'none';
  return function saveData(blob, fileName) {
    console.log(blob);
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
  }
}());


function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
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



