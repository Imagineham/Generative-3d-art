import './style.css'
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';
import {EffectComposer} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/postprocessing/RenderPass.js';
import {ShaderPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/postprocessing/ShaderPass.js';
import {GUI} from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';
import dat from 'dat.gui';

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
  camera.position.set(0,3,3);

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

  //Loader init
  loader = new THREE.TextureLoader();
  const gamerJibe = loader.load('./images/gamerjibe_test.jpg');

  //Light
  const light = new THREE.AmbientLight( 0xffffff ); // soft white light
  scene.add( light );

  //Planes
  const planeWidth = 2;
  const planeHeight = 2;
  const scale = 15;

  //floor plane
  const floorGeo = new THREE.PlaneGeometry(planeWidth * scale, planeHeight * scale * 5);
  const floorMat = new THREE.MeshPhongMaterial({
    color: "red",
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
  left.position.set(-(planeWidth * scale)/2,2,0);
  left.rotation.y = Math.PI/2;
  scene.add(left);

  //Right Plane
  const rightGeometry = new THREE.PlaneGeometry(planeHeight * scale * 5, planeHeight * 5);
  const rightMaterial = new THREE.MeshPhongMaterial({
    color: "green",
    side: THREE.DoubleSide,
  });
  const right = new THREE.Mesh(rightGeometry, rightMaterial);
  right.position.set((planeWidth * scale)/2,2,0);
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
    map: gamerJibe,
  });

  const imgPlane = new THREE.Mesh(imgGeometry, imgMaterial);
  imgPlane.position.set(-(planeWidth * scale)/2 + 0.005,3,0);
  imgPlane.rotation.y = Math.PI/2;

  scene.add(imgPlane);

  const borderGeometry = new THREE.PlaneGeometry((planeWidth * scale / 4) + 0.2, (planeHeight * scale / 4) + 0.2);
  const borderMaterial = new THREE.MeshPhongMaterial({
    color: "black",
    side: THREE.DoubleSide,
  });
  const borderPlane = new THREE.Mesh(borderGeometry, borderMaterial);
  borderPlane.position.set(-(planeWidth * scale)/2 + 0.003,3,0);
  borderPlane.rotation.y = Math.PI/2;
  scene.add(borderPlane);

  const ballGeometry = new THREE.SphereGeometry(100, 32, 32);
  ballMaterial = new THREE.MeshPhongMaterial({
    //color: "white",
    map: gamerJibe,
    side: THREE.DoubleSide
  })
  ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.position.set(0,0,-3);
  scene.add(ball);


  const boxGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
  boxMaterial = new THREE.MeshPhongMaterial({
    //color: "white",
    map: loader.load('./images/gamerjibe_test.jpg')
  })
  box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.position.set(0,0,2);
  scene.add(box);


  const makeIdentityLutTexture = function() {
    const identityLUT = new Uint8Array([
        0,   0,   0, 255,  // black
      255,   0,   0, 255,  // red
        0,   0, 255, 255,  // blue
      255,   0, 255, 255,  // magenta
        0, 255,   0, 255,  // green
      255, 255,   0, 255,  // yellow
        0, 255, 255, 255,  // cyan
      255, 255, 255, 255,  // white
    ]);

    return function(filter) {
      const texture = new THREE.DataTexture(identityLUT, 4, 2, THREE.RGBAFormat);
      texture.minFilter = filter;
      texture.magFilter = filter;
      texture.needsUpdate = true;
      texture.flipY = false;
      return texture;
    };
  }();

  lutTextures = [
    {
      name: 'identity',
      size: 2,
      filter: true,
      texture: makeIdentityLutTexture(THREE.LinearFilter),
    },
    {
      name: 'identity not filtered',
      size: 2,
      filter: false,
      texture: makeIdentityLutTexture(THREE.NearestFilter),
    },
  ];

  const lutNameIndexMap = {};
  lutTextures.forEach((info, ndx) => {
    lutNameIndexMap[info.name] = ndx;
  });

  lutSettings = {
    lut: lutNameIndexMap.identity,
  };
  const gui = new GUI({ width: 300 });
  gui.add(lutSettings, 'lut', lutNameIndexMap);

  const lutShader = {
    uniforms: {
      tDiffuse: { value: null },  // the previous pass's result
      lutMap:  { value: null },
      lutMapSize: { value: 1, },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `,
    fragmentShader: `
      #include <common>

      uniform sampler2D tDiffuse;
      uniform sampler2D lutMap;
      uniform float lutMapSize;

      varying vec2 vUv;

      vec4 sampleAs3DTexture(sampler2D tex, vec3 texCoord, float size) {
        float sliceSize = 1.0 / size;                  // space of 1 slice
        float slicePixelSize = sliceSize / size;       // space of 1 pixel
        float width = size - 1.0;
        float sliceInnerSize = slicePixelSize * width; // space of size pixels
        float zSlice0 = floor( texCoord.z * width);
        float zSlice1 = min( zSlice0 + 1.0, width);
        float xOffset = slicePixelSize * 0.5 + texCoord.x * sliceInnerSize;
        float yRange = (texCoord.y * width + 0.5) / size;
        float s0 = xOffset + (zSlice0 * sliceSize);

        #ifdef FILTER_LUT

          float s1 = xOffset + (zSlice1 * sliceSize);
          vec4 slice0Color = texture2D(tex, vec2(s0, yRange));
          vec4 slice1Color = texture2D(tex, vec2(s1, yRange));
          float zOffset = mod(texCoord.z * width, 1.0);
          return mix(slice0Color, slice1Color, zOffset);

        #else

          return texture2D(tex, vec2( s0, yRange));

        #endif
      }

      void main() {
        vec4 originalColor = texture2D(tDiffuse, vUv);
        gl_FragColor = sampleAs3DTexture(lutMap, originalColor.xyz, lutMapSize);
      }
    `,
  };

  const lutNearestShader = {
    uniforms: {...lutShader.uniforms},
    vertexShader: lutShader.vertexShader,
    fragmentShader: lutShader.fragmentShader.replace('#define FILTER_LUT', '//'),
  };

  effectLUT = new ShaderPass(lutShader);
  effectLUT.renderToScreen = true;
  effectLUTNearest = new ShaderPass(lutNearestShader);
  effectLUTNearest.renderToScreen = true;

  const renderModel = new RenderPass(scene, camera);
  renderModel.clear = false;  // so we don't clear out the background

  const rtParameters = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBFormat,
  };
  composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, rtParameters));

  composer.addPass(renderModel);
  composer.addPass(effectLUT);
  composer.addPass(effectLUTNearest);

  requestAnimationFrame(render);

}

function render(now) {
  now *= 0.001;  // convert to seconds
  const delta = now - then;
  then = now;

  const lutInfo = lutTextures[lutSettings.lut];

  const effect = lutInfo.filter ? effectLUT : effectLUTNearest;
  effectLUT.enabled = lutInfo.filter;
  effectLUTNearest.enabled = !lutInfo.filter;

  const lutTexture = lutInfo.texture;
  effect.uniforms.lutMap.value = lutTexture;
  effect.uniforms.lutMapSize.value = lutInfo.size;

  composer.render(0);
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);

  ball.rotation.y += 0.005;
  box.rotation.y += 0.005;

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