import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {EffectComposer} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/postprocessing/RenderPass.js';
import {ShaderPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/postprocessing/ShaderPass.js';
import {FilmPass} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/postprocessing/FilmPass.js';


let scene, rtScene, camera, rtCamera, renderer, canvas;
let filmRenderTarget, finalRenderTarget;
let cube, rtCubes;
let filmComposer, finalComposer;

init();
animate();

function init() {
  renderer = new THREE.WebGLRenderer();
  canvas = renderer.domElement;
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
  document.body.appendChild(canvas);
  window.addEventListener( 'resize', onWindowResize );

  const rtWidth = 512;
  const rtHeight = 512;
  let rtParameters = { 
    minFilter: THREE.LinearFilter, 
    magFilter: THREE.LinearFilter, 
    format: THREE.RGBAFormat, 
    stencilBuffer: false 
  };


  //render targets!
  filmRenderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight, rtParameters);
  finalRenderTarget = new THREE.WebGLRenderTarget(innerWidth, innerHeight, rtParameters );

  const rtFov = 75;
  const rtAspect = rtWidth / rtHeight;
  const rtNear = 0.1;
  const rtFar = 5;
  rtCamera = new THREE.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar);
  rtCamera.position.z = 4;

  rtScene = new THREE.Scene();
  rtScene.background = new THREE.Color('red');

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    rtScene.add(light);
  }

  const boxWidth = 0.5;
  const boxHeight = 0.5;
  const boxDepth = 0.5;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({color});

    const cube = new THREE.Mesh(geometry, material);
    rtScene.add(cube);

    cube.position.x = x;

    return cube;
  }

  rtCubes = [
    makeInstance(geometry, 0x44aa88,  0),
    makeInstance(geometry, 0x8844aa, -1),
    makeInstance(geometry, 0xaa8844,  1),
  ];

  const fov = 45;
  const aspect = innerWidth/ innerHeight;  // the canvas default
  const near = 0.1;
  const far = 100;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 3;

  scene = new THREE.Scene();

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  const material = new THREE.MeshPhongMaterial({
    map: filmRenderTarget.texture,
  });
  cube = new THREE.Mesh(geometry, material);

  const material2 = new THREE.MeshPhongMaterial({
    color: "blue"
  });
  const cube2= new THREE.Mesh(geometry, material2);
  cube2.position.set(1, 0, -2)
  scene.add(cube);
  scene.add(cube2);

  filmComposer = new EffectComposer(renderer, filmRenderTarget);
  filmComposer.addPass(new RenderPass(rtScene, rtCamera));
	const filmPass = new FilmPass(
		1,   // noise intensity
		0.025,  // scanline intensity
		648,    // scanline count
		true,  // grayscale
	);
	//filmPass.enabled = false;
  //filmPass.renderToScreen = true;
  //filmPass.needsSwap = true;
	filmComposer.addPass(filmPass);
  filmComposer.setSize(rtWidth, rtHeight);

    //we need this shader to blend the the film scene and the mains scene together
    let finalshader = {
      uniforms: {
        tDiffuse: { type: "t", value: 0, texture: null }, // The base scene buffer
        tFilm: { type: "t", value: 1, texture: null } // The glow scene buffer
      },
    
      vertexShader: [
        "varying vec2 vUv;",
    
        "void main() {",
    
          "vUv = vec2( uv.x, 1.0 - uv.y );",
          "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    
        "}"
      ].join("n"),
    
      fragmentShader: [
        "uniform sampler2D tDiffuse;",
        "uniform sampler2D tFilm;",
    
        "varying vec2 vUv;",
    
        "void main() {",
    
          "vec4 texel = texture2D( tDiffuse, vUv );",
          "vec4 glow = texture2D( tFilm, vUv );",
          "gl_FragColor = texel + vec4(0.5, 0.75, 1.0, 1.0) * glow * 2.0;", // Blend the two buffers together (I colorized and intensified the glow at the same time)
    
        "}"
      ].join("n")
    };
  
    finalshader.uniforms[ "tFilm" ].value = filmComposer.renderTarget2;

    const finalScene = new RenderPass(scene, camera);

    let finalPass = new ShaderPass(finalshader);
    finalPass.needsSwap = true;
    finalPass.renderToScreen = true;
    finalComposer = new EffectComposer(renderer, finalRenderTarget);
 
    finalComposer.addPass(finalScene);
    //finalComposer.addPass(finalPass);
    finalComposer.setSize(innerWidth, innerHeight);






}

function render() {
  //renderer.render(scene, camera);
  filmComposer.render();
  finalComposer.render();
}

function animate() {
  requestAnimationFrame(animate);
  render();

  // rotate all the cubes in the render target scene
  rtCubes.forEach((cube) => {
    const rot = 0.01
    cube.rotation.x += rot;
    cube.rotation.y += rot;
  });

  // draw render target scene to render target
  //renderer.setRenderTarget(renderTarget);
  //renderer.render(rtScene, rtCamera);
  //renderer.setRenderTarget(null);

  // rotate the cube in the scene
  cube.rotation.x += 0.001;
  cube.rotation.y += 0.001;
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );

}