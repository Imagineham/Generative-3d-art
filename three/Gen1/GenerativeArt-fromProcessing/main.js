import './style.css'
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js'

let scene, camera, renderer, canvas;
let points, geometry, material, line, newGeo, newMat, newLine;
let WIDTH, HEIGHT;


init();
animate();

function init() {
  scene = new THREE.Scene();

  //Camera
  camera = new THREE.
    PerspectiveCamera(
      75, //fov
      innerWidth/innerHeight, //aspectRatio
      0.1, //near
      1000 //far
      );
  camera.position.set(0,0,10);

  //Renderer
  renderer = new THREE.WebGLRenderer({
    preserveDrawingBuffer: true,
  });
  canvas = renderer.domElement;
  WIDTH = canvas.innerWidth;
  HEIGHT = canvas.innerHeight;
  renderer.autoClearColor = false;
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
  document.body.appendChild(renderer.domElement);
  window.addEventListener( 'resize', onWindowResize );

  const random3 = new THREE.Vector3(
    getRandomIntInclusive(-10, 10),
    getRandomIntInclusive(-10, 10),
    getRandomIntInclusive(-10, 10)
  )



  //draw a line
  points = [];
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


  geometry = new THREE.BufferGeometry().setFromPoints(points);
  material = new THREE.LineBasicMaterial({
    color: new THREE.Color('white')
  });
  line = new THREE.Line(geometry, material);
  line.geometry.verticesNeedUpdate = true;
  //console.log(line);
  //scene.add(line);
  console.log(points.length)
}

function render() {
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  render();  
 
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
    scene.add(newLine);
  }

  newLine.rotation.z += 2;
  newLine.rotation.y += 3;
  newLine.rotation.x += 3;
  //newLine.scale.x += 0.1;;
  //newLine.material.color.setRGB(r, g, b);

  /*
  
  line.rotation.x += 0.5;
  line.rotation.y += 1;
  line.rotation.z += 2.5;
  
  */

  //line.geometry.dispose();
  //newLine.geometry = new THREE.BufferGeometry().setFromPoints(points);
  //let color = new THREE.Color()

  //line.material.color.setRGB(r, g, b);
  //line.geometry.translate(-6, -8, -5);
  //console.log(line.geometry.setAttribute('position', points));

  
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

addEventListener('keydown', (e) => {
  if (e.keyCode === 27) {
    canvas.toBlob((blob) => {
      saveBlob(blob, `screencapture-${canvas.width}x${canvas.height}.png`)
    });
  }
});

const saveBlob = (function() {
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style.display = 'none';
  return function saveData(blob, fileName) {
     const url = window.URL.createObjectURL(blob);
     a.href = url;
     a.download = fileName;
     a.click();
  };
}());

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}