
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap';

////////CONST OBJECTS/////////////////////
const raycaster = new THREE.Raycaster();

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

new OrbitControls(camera, renderer.domElement);
//our box is in the center, push camera back to capture the center
camera.position.z = 5;

//boxGeometry creates the vertices for our material mesh
const plane = new THREE.PlaneGeometry(5, 5, 10, 10);

//material defines what connects the vertices from boxGeometry
const planeMaterial = new THREE.
  MeshPhongMaterial({
    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading,
    vertexColors: true
  });

/* mesh is what we see! these r the points from boxgeometry
 * and the material. this creates a green box 
 */
const planeMesh = new THREE.Mesh(plane, planeMaterial);
scene.add(planeMesh);


const light = new THREE.PointLight( 0xff0000, 1, 100 );
light.position.set(0, 0, 0);
scene.add(light);

const backlight = new THREE.DirectionalLight(0xFFFFFF, 1);
backlight.position.set(0, 0, -1);
scene.add(backlight);
///////////RENDER OBJECTS////////////////////

const {array} = planeMesh.geometry.attributes.position;
for(let i = 0; i < array.length; i += 3) {
  const x = array[i];
  const y =  array[i + 1];
  const z = array[i + 2];

  array[i + 2] = z + Math.random();

  console.log(x, y, z);
}

const colors = [];
for(let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
  console.log(i);
  colors.push(0, 0.19, 0.4);
}
planeMesh.geometry.setAttribute(
  'color', 
  new THREE.BufferAttribute(new Float32Array(colors),
  3
  )
)

const mouse = {
  x: undefined,
  y: undefined
}

function animate() {
  //animation loop
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersects = raycaster.intersectObject(planeMesh);
  if(intersects.length > 0) {

    const {color} = intersects[0].object.geometry.attributes;

    intersects[0].object.geometry.attributes.color.needsUpdate = true;

    const initialColor = {
      r: 0,
      g: 0.19,
      b: 0.4
    }
    const hoverColor = {
      r: 0.1,
      g: 0.5,
      b: 1
    }
    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      onUpdate: () => {
        //vertice 1
        color.setX(intersects[0].face.a, hoverColor.r);
        color.setY(intersects[0].face.a, hoverColor.g);
        color.setZ(intersects[0].face.a, hoverColor.b);

        //vertice 2
        color.setX(intersects[0].face.b, hoverColor.r);
        color.setY(intersects[0].face.b, hoverColor.g);
        color.setZ(intersects[0].face.b, hoverColor.b);

        //vertice 3
        color.setX(intersects[0].face.c, hoverColor.r);
        color.setY(intersects[0].face.c, hoverColor.g);
        color.setZ(intersects[0].face.c, hoverColor.b);
      }
    })
  }
}

animate();

addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;
})
