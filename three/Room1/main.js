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
let scene, sceneBG, camera, cameraBG, renderer, canvas, raycaster, INTERSECTED;

//camera parameters
let fov, aspectRatio, near, far, controls; 
//loader
let loader;

//Rotating shapes
let ball, box;
let bgMesh, bgTexture;

//drawing Canvas constants
let ballMaterial, boxMaterial, imgGeometry, imgMaterial;
const drawStartPos = new THREE.Vector2();

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
  sceneBG = new THREE.Scene();



  //Camera init
  fov = 75;
  aspectRatio = innerWidth/innerHeight;
  near = 0.1; 
  far = 1000;
  camera = new THREE.PerspectiveCamera(fov,aspectRatio,near,far);
  camera.position.set(0,0,1);
  cameraBG = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);

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


  //background
  bgTexture = loader.load('https://threejsfundamentals.org/threejs/resources/images/beach.jpg');
  const planeGeo = new THREE.PlaneGeometry(2, 2);
  const planeMat = new THREE.MeshBasicMaterial({
      map: bgTexture,
      depthTest: false,
  });
  bgMesh = new THREE.Mesh(planeGeo, planeMat);
  sceneBG.add(bgMesh);

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
  //scene.add(right);

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

  imgGeometry = new THREE.PlaneGeometry(planeWidth/2, planeHeight/2);
  imgMaterial = new THREE.MeshPhongMaterial({
    //color: "purple",
    side: THREE.DoubleSide,
    map: loader.load('./images/gamerjibe_test.jpg'),
  });

  const imgPlane = new THREE.Mesh(imgGeometry, imgMaterial);
  imgPlane.position.set(-planeWidth/2 + 0.001,0,0);
  imgPlane.rotation.y = Math.PI/2;

  scene.add(imgPlane);

  const borderGeometry = new THREE.PlaneGeometry(planeWidth/2 + 0.05, planeHeight/2 + 0.05);
  const borderMaterial = new THREE.MeshPhongMaterial({
    color: "black",
    side: THREE.DoubleSide,
  });
  const borderPlane = new THREE.Mesh(borderGeometry, borderMaterial);
  borderPlane.position.set(-planeWidth/2 + 0.0005,0,0);
  borderPlane.rotation.y = Math.PI/2;
  scene.add(borderPlane);

  const ballGeometry = new THREE.SphereGeometry(0.6, 32, 32);
  ballMaterial = new THREE.MeshPhongMaterial({
    //color: "white",
    map: loader.load('./images/gamerjibe_test.jpg')
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



  render();

}

function render() {
  renderer.render(sceneBG, camera);
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

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

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

  const lutTextures = [
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

  const lutSettings = {
    lut: lutNameIndexMap.identity,
  };
  const gui = new GUI({ width: 300 });
  gui.add(lutSettings, 'lut', lutNameIndexMap);

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

      root.updateMatrixWorld();
      // compute the box that contains all the stuff
      // from root and below
      const box = new THREE.Box3().setFromObject(root);

      const boxSize = box.getSize(new THREE.Vector3()).length();
      const boxCenter = box.getCenter(new THREE.Vector3());
      frameArea(boxSize * 0.4, boxSize, boxCenter, camera);

      // update the Trackball controls to handle the new size
      controls.maxDistance = boxSize * 10;
      controls.target.copy(boxCenter);
      controls.update();
    });
  }

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

      #define FILTER_LUT true

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

  const effectLUT = new ShaderPass(lutShader);
  effectLUT.renderToScreen = true;
  const effectLUTNearest = new ShaderPass(lutNearestShader);
  effectLUTNearest.renderToScreen = true;

  const renderModel = new RenderPass(scene, camera);
  renderModel.clear = false;  // so we don't clear out the background
  const renderBG = new RenderPass(sceneBG, cameraBG);

  renderModel.clear = false;

  const rtParameters = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBFormat,
  };
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, rtParameters));

  composer.addPass(renderBG);
  composer.addPass(renderModel);
  composer.addPass(effectLUT);
  composer.addPass(effectLUTNearest);

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth * window.devicePixelRatio | 0;
    const height = canvas.clientHeight * window.devicePixelRatio | 0;

    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  let then = 0;
  function render(now) {
    now *= 0.001;  // convert to seconds
    const delta = now - then;
    then = now;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      const canvasAspect = canvas.clientWidth / canvas.clientHeight;
      camera.aspect = canvasAspect;
      camera.updateProjectionMatrix();
      composer.setSize(canvas.width, canvas.height);

      // scale the background plane to keep the image's
      // aspect correct.
      // Note the image may not have loaded yet.
      const imageAspect = bgTexture.image ? bgTexture.image.width / bgTexture.image.height : 1;
      const aspect = imageAspect / canvasAspect;
      bgMesh.scale.x = aspect > 1 ? aspect : 1;
      bgMesh.scale.y = aspect > 1 ? 1 : 1 / aspect;
    }

    const lutInfo = lutTextures[lutSettings.lut];

    const effect = lutInfo.filter ? effectLUT : effectLUTNearest;
    effectLUT.enabled = lutInfo.filter;
    effectLUTNearest.enabled = !lutInfo.filter;

    const lutTexture = lutInfo.texture;
    effect.uniforms.lutMap.value = lutTexture;
    effect.uniforms.lutMapSize.value = lutInfo.size;

    composer.render(delta);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();























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