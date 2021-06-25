
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';

////////CONST OBJECTS/////////////////////
//scene, camera, and render init
const scene = new THREE.Scene();
const camera = new THREE.
  PerspectiveCamera(
    75, 
    innerWidth/innerHeight,
    0.1,
    1000
    );

const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

//boxGeometry creates the vertices for our material mesh
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

//material defines what connects the vertices from boxGeometry
const material = new THREE.MeshBasicMaterial({color: 0x00FF00})

/* mesh is what we see! these r the points from boxgeometry
 * and the material. this creates a green box 
 */
const mesh = new THREE.Mesh(boxGeometry, material);

///////////RENDER OBJECTS////////////////////

scene.add(mesh);
//our box is in the center, push camera back to capture the center
camera.position.z = 5;

function animate() {
  //animation loop
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  //rotate
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;
}

animate();
