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
import { TeapotGeometry } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/geometries/TeapotGeometry.js';

//Constants
let mainScene, mainCamera, renderer, canvas;
let mainComposer, filmRenderTarget;
let raycaster, INTERSECTED, CLICK, gamerjibeScene, gamerjibeComposer;
let mouse = {
  x: undefined,
  y: undefined
}
let gui;


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
let artworks = [], renderTargets = [], frames = [], currentArtworkIndex;
let goghBox, kanagawaTorus;

//main camera parameters
let fov, aspectRatio, near, far, controls; 
//loader
let loader, objLoader, mtlLoader;

//Rotating shapes
let ball, box;

//drawing Canvas constants
let ballMaterial, boxMaterial;

let points = [], line, newGeo, newMat, newLine;






class Art { 

  constructor() {
    this.scene = makeScene();
    this.camera = makeCamera();
    this.composer = makeComposer(this.scene, this.camera);
  }


  makeFrame(width, height) {

    const geometry = new THREE.PlaneGeometry(width, height);
    
    let material = new THREE.MeshPhongMaterial({
      map: this.composer.renderTarget2.texture,
      side: THREE.DoubleSide
    });
    
    this.frame = new THREE.Mesh(geometry, material);

  }

  loadTexture(string) {
    const loader = new THREE.TextureLoader();
    this.texture = loader.load(string);
  }

  loadObject(mesh) {
    this.mesh = mesh;
  }

}

//let kanagawa, gogh, monet, oct;







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

  const argyle = loader.load('./images/argyle.png');


  const skyBoxtexture = loader.load(
    './images/space1.jpg',
    () => {
      const rt = new THREE.WebGLCubeRenderTarget(skyBoxtexture.image.height);
      rt.fromEquirectangularTexture(renderer, skyBoxtexture);
      mainScene.background = rt.texture;
    });

  //Light
  const light = new THREE.AmbientLight( 0xffffff, 0.7); // soft white light
  mainScene.add( light );

  //Planes
  const planeWidth = 2;
  const planeHeight = 2;
  const scale = 15;

  //floor
  const floorGeo = new THREE.PlaneGeometry(planeWidth * scale * 2, planeHeight * scale * 5);
  const floorMat = new THREE.MeshBasicMaterial({
    color: 0xcfcfcfcf,
    side: THREE.DoubleSide,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.set(0, -planeHeight/2, 0);
  floor.rotation.x = Math.PI/2;
  mainScene.add(floor);

  //Left Wall
  const leftGeometry = new THREE.PlaneGeometry(planeHeight * scale * 5, planeHeight * 5);
  const leftMaterial = new THREE.MeshPhongMaterial({
    color: "white",
    side: THREE.DoubleSide
  });
  const left = new THREE.Mesh(leftGeometry, leftMaterial);
  left.position.set( -(planeWidth * scale), 4, 0);
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
  right.position.set( planeWidth * scale, 4, 0 );
  right.rotation.y = -Math.PI/2;
  mainScene.add(right);




  //2d art
  {
    const gogh = new Art();
    const kanagawa = new Art();
    const flowersMonet = new Art();
    const snowMonet = new Art();
    const footbridgeMonet = new Art();

    gogh.loadTexture('./images/gogh.jpg');
    kanagawa.loadTexture('./images/kanagawa.jpg');
    flowersMonet.loadTexture('./images/flowers_monet.jpg');
    snowMonet.loadTexture('./images/snow_monet.jpg');
    footbridgeMonet.loadTexture('./images/footbridge_monet.jpg')

    artworks.push(gogh, kanagawa, flowersMonet, snowMonet, footbridgeMonet);

    for(let i = 0; i < artworks.length; i++) {
      const art = artworks[i];

      //simple lighting
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

        art.scene.add( spotLight );
      }

      const geometry = new THREE.PlaneGeometry(20, 20);
      const material = new THREE.MeshPhongMaterial({
        map: art.texture,
        side: THREE.DoubleSide
      });
      const plane = new THREE.Mesh(geometry, material);

      //art.scene.add(ambientLight);
      art.scene.add(plane);

      art.makeFrame(8, 8);
      art.frame.position.set( -(planeWidth * scale) + 0.05, 3.5, 50 - (i * 25));
      art.frame.rotation.y = Math.PI/2;


      const spotLight = new THREE.SpotLight( 0xcfcfcf );
      spotLight.position.set( -(planeWidth * scale) + 15, 10, 50 - (i * 25));
      mainScene.add( spotLight );
      spotLight.target = art.frame;
      spotLight.angle = Math.PI/5.5;
      spotLight.penumbra = 1;

      mainScene.add(art.frame);

    }
  }

  //3d art
  {

  }




  //Gen art
  {
    const linesGen = new Art();
    const circleGen = new Art();
    const triangleGen = new Art();
    const threeDGen = new Art();
    const randomGen = new Art();



    artworks.push(linesGen, circleGen, triangleGen, threeDGen, randomGen);

    for(let i = 5; i < artworks.length; i++) {
      const art = artworks[i];

      //simple lighting
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

        art.scene.add( spotLight );
      }


      //art.scene.add(ambientLight);

      art.makeFrame(8, 8);
      art.frame.position.set( (planeWidth * scale) - 0.05, 3.5, 50 - ((i - 5) * 25));
      art.frame.rotation.y = Math.PI/2;


      const spotLight = new THREE.SpotLight( 0xcfcfcf );
      spotLight.position.set( (planeWidth * scale) - 15, 10, 50 - ((i - 5) * 25));
      mainScene.add( spotLight );
      spotLight.target = art.frame;
      spotLight.angle = Math.PI/5.5;
      spotLight.penumbra = 1;

      mainScene.add(art.frame);
      console.log(i);

    }

  }

  {
    goghBox = new Art();


    const ambientLight = new THREE.AmbientLight( 0xffffff, 1 );

    goghBox.loadTexture('./images/gogh.jpg');

    
    goghBox.texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    goghBox.texture.matrixAutoUpdate = false;
    goghBox.texture.wrapS = goghBox.texture.wrapT = THREE.RepeatWrapping;
    goghBox.texture.matrix.scale(4, 4);

    goghBox.composer.renderTarget2.texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    goghBox.composer.renderTarget2.texture.matrixAutoUpdate = false;
    goghBox.composer.renderTarget2.texture.wrapS = goghBox.composer.renderTarget2.texture.wrapT = THREE.RepeatWrapping;
    goghBox.composer.renderTarget2.texture.matrix.scale(4, 4);
    
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshPhongMaterial({
      map: goghBox.texture,
      side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(geometry, material);

    goghBox.scene.add(ambientLight);
    goghBox.scene.add(plane);

    const boxGeometry = new THREE.BoxGeometry(5, 5, 5);
    const boxMaterial = new THREE.MeshPhongMaterial({
      map: goghBox.composer.renderTarget2.texture,
      side: THREE.DoubleSide,
    })
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(0, 5, 15);
    console.log(box);

    mainScene.add(box);
    
  }

  {

    kanagawaTorus = new Art();

    const ambientLight = new THREE.AmbientLight( 0xafafaf, 1 );

    kanagawaTorus.composer.renderTarget2.texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    kanagawaTorus.composer.renderTarget2.texture.matrixAutoUpdate = false;
    kanagawaTorus.composer.renderTarget2.texture.wrapS = kanagawaTorus.composer.renderTarget2.texture.wrapT = THREE.RepeatWrapping;
    kanagawaTorus.composer.renderTarget2.texture.matrix.scale(2, 2);


    kanagawaTorus.scene.add(ambientLight);


    const torusKnotGeo = new THREE.TorusKnotGeometry(3, 1, 100, 12);
    const torusKnotMat = new THREE.MeshBasicMaterial({
      map: kanagawaTorus.composer.renderTarget2.texture,
    } );
    const torusKnot = new THREE.Mesh( torusKnotGeo, torusKnotMat );
    torusKnot.position.set(0, 5, 37.5);
    torusKnot.rotation.y -= Math.PI/2;
    mainScene.add( torusKnot);


  }

  {
    const monet = new Art();

    monet.loadTexture('./images/flowers_monet.jpg');

    monet.makeFrame(planeWidth * scale / 4, planeHeight * scale / 4);
    monet.frame.position.set(-(planeWidth * scale)/2 + 1,3,25);
    monet.frame.rotation.y = Math.PI/2;

    //artworks.push(monet);

    //mainScene.add(monet.frame);
  }

  mainComposer = new EffectComposer(renderer, mainRenderTarget);
  mainComposer.addPass(new RenderPass(mainScene, mainCamera));
  mainComposer.setSize(canvas.width, canvas.height);
  


  ///////OBJ LOADER////////////////////////////////
  {
    let windmill;

    mtlLoader = new MTLLoader();
    mtlLoader.load('models/windmill_001.mtl', (mtl) => {
      mtl.preload();
      mtl.materials.Material.side = THREE.DoubleSide;
      objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('models/windmill_001.obj', (root) => {
        windmill = root;
        root.position.set( 0, 0, -37.5 );
        mainScene.add(root);
      });
    });

    


  }

  {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf', (gltf) => {
      const root = gltf.scene;
      mainScene.add(root);
      console.log(root);
      root.position.set(6, 2, -12.5);
      root.scale.set(0.01, 0.01, 0.01);
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


  points.push(new THREE.Vector3(
    getRandomIntInclusive(-4, 4),
    getRandomIntInclusive(-4, 4),
    getRandomIntInclusive(-4, 4)
  ));
  points.push(new THREE.Vector3(
    getRandomIntInclusive(-4, 4),
    getRandomIntInclusive(-4, 4),
    getRandomIntInclusive(-4, 4)
  ));

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: new THREE.Color('white')
  });
  line = new THREE.Line(geometry, material);
  line.geometry.verticesNeedUpdate = true;


}

function render() {

  controls.object = mainCamera;
  controls.enableRotate = true;
  controls.maxDistance = Infinity;
  controls.update();

  
  for(const art of artworks) {
    art.composer.passes[1].enabled = true;
    art.composer.render();
  }

  goghBox.composer.render();
  kanagawaTorus.composer.render();


  mainComposer.render();
  CLICK = false;
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  
  if(!CLICK) {
    render();
  } else {
    controls.object = artworks[currentArtworkIndex].camera;  
    controls.enableRotate = false;
    controls.minDistance = 0.5;
    controls.maxDistance = 15;
    controls.update();


    artworks[currentArtworkIndex].composer.render();

  }

  goghBox.scene.children[1].rotation.y += 0.03;

  {
    if(kanagawaTorus.scene.children.length < 2) {
      for(let i = 0; i < 2; i++) {
        const geometry = new THREE.CircleGeometry( 5, 32 );
        const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        const circle = new THREE.Mesh( geometry, material );
        circle.position.set(
          getRandomIntInclusive(-10, 10),
          getRandomIntInclusive(-10, 10),
          getRandomIntInclusive(-10, 10)
        )

        kanagawaTorus.scene.add( circle );
      }
    }
  }



  //array of frames
  frames = artworks.map(artwork => artwork.frame);

  raycaster.setFromCamera(mouse, mainCamera);
  const intersects = raycaster.intersectObjects(frames);

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

  /*
  {

    if (points.length < 3) {
      points.push(new THREE.Vector3(
        getRandomIntInclusive(-3, 3),
        getRandomIntInclusive(-2, 2),
        getRandomIntInclusive(-10, 20)
      ));
      
  
      //console.log(points);
      let newGeo = new THREE.BufferGeometry().setFromPoints([
        points[points.length - 2],
        points[points.length - 1]
      ]);
  
  
      let r = Math.random();
      let g = Math.random();
      let b = Math.random();
  
      let newMat = new THREE.LineBasicMaterial();
  
      newLine = new THREE.Line(newGeo, newMat);
      newLine.lookAt(new THREE.Vector3(0,0,0));
      //newLine.rotation.x += 0.5;
      kanagawa.scene.add(newLine);
    }
  
    newLine.rotation.z += 2;
    newLine.rotation.y += 3;
    newLine.rotation.x += 3;

  }
  */



    //renderTargets[4].root.scene.children[1].rotation.x += 0.001;
    //renderTargets[4].root.scene.children[2].rotation.y += 0.001;
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

    //currentArtworkIndex = (artworks.indexOf(INTERSECTED))
    currentArtworkIndex = (frames.indexOf(INTERSECTED))
    //console.log(renderTargets[currentArtworkIndex])

    makeGui();

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
      if(gui != undefined) {
        destroyGUI();
      }
      render();
      break;
    case 67:
      if (renderTargets[currentArtworkIndex]) {
        //controls.object.position.set(0,-2,20)
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

function makeGui() {

  const currentScene = artworks[currentArtworkIndex];
  gui = new dat.GUI();
  
  //FilmPass
  {
    let folder1 = gui.addFolder('FilmPass');
    let myFilmPass = currentScene.composer.passes[1];

    const params = {
      'Noise Intensity': myFilmPass.uniforms.nIntensity,
      'Scanline Intensity': myFilmPass.uniforms.sIntensity,
      'Scanline Count': myFilmPass.uniforms.sCount,
      'Grayscale': myFilmPass.uniforms.grayscale
    }


    folder1.add(myFilmPass, 'enabled');
    folder1.add(params['Noise Intensity'], 'value', 0, 1).name('Noise Intensity');
    folder1.add(params['Scanline Intensity'], 'value', 0, 1).name('Scanline Intensity');
    folder1.add(params['Scanline Count'], 'value', 0, 4096).name('Scanline Count');
    folder1.add(params['Grayscale'], 'value').name('Grayscale');
  }

  //spotLight example code from https://github.com/mrdoob/three.js/blob/master/examples/webgl_lights_spotlight.html
  {
    let folder2 = gui.addFolder('SpotLight');       
    let spotLight = currentScene.scene.children[0];
    const params = {
      'light color': spotLight.color.getHex(),
    };
    console.log(spotLight);
    folder2.addColor(params, 'light color').onChange( function ( val ) {
    
      spotLight.color.setHex( val );

    });
    folder2.add( spotLight, 'intensity', 0, 2 )
    folder2.add( spotLight, 'distance', 50, 200 );
    folder2.add( spotLight, 'angle', 0, Math.PI / 3 );
    folder2.add( spotLight, 'penumbra', 0, 1 );
    //folder2.add( spotLight, 'decay', 1, 2 );
    //folder2.add( spotLight.shadow, 'focus', 0, 1 );
  }

    //return gui;


}

function destroyGUI() {
  gui.destroy();
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


/*
class Art { 

  constructor() {
    this.scene = makeScene();
    this.camera = makeCamera();
    this.composer = makeComposer(this.scene, this.camera);
    this.frame = makeFrame(this.composer);
  }

  makeFrame(width, height) {

    const width = 2;
    const height = 2;


    const geometry = new THREE.PlaneGeometry(width, height);
    let material = new THREE.MeshPhongMaterial({
      map: this.composer.renderTarget2.texture,
      side: THREE.DoubleSide
    });
    
    this.frame = new THREE.Mesh(geometry, material);

  }

  loadTexture(string) {
    const loader = new THREE.TextureLoader();
    this.texture = loader.load(string);
  }

  loadObject(mesh) {
    this.mesh = mesh;
  }

}
*/


function makeScene() {

  return new THREE.Scene();
}

function makeCamera() {
  const fov = 75; 
  const aspect = innerWidth / innerHeight;
  const near = 0.1;
  const far = 500;

  let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0,0,14);

  return camera;

}

function makeComposer(scene, camera) {

  const rtWidth = 1024;
  const rtHeight = 1024;
  let rtParameters = { 
    minFilter: THREE.LinearFilter, 
    magFilter: THREE.LinearFilter, 
    format: THREE.RGBAFormat, 
    stencilBuffer: false 
  };

  const renderTarget = new THREE.WebGLRenderTarget(innerWidth, innerHeight, rtParameters);

  let composer = new EffectComposer(renderer, renderTarget);
  composer.addPass(new RenderPass(scene, camera));

  let filmPass = new FilmPass(
      1, //noise intensity
      0.025, //scanline intensity
      648, //scanline count
      true, //grayscale
  );

  filmPass.enabled = true;

  composer.addPass(filmPass);

  return composer;

}
