import './style.css'
import * as Three from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

//Initial Scene
const scene = new Three.Scene();
//Camera, 75 FOV
const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Create new renderer and intialize on the canvas node with ID 'bg'
const renderer = new Three.WebGLRenderer({
  canvas: document.querySelector('#bg')
})

//Adjust the size of the renderer
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//Move the camera
camera.position.setZ(10);
camera.position.setY(3)

//Lighting
const ambientLight = new Three.AmbientLight(0xffffff);
//const pointLight = new Three.PointLight(0xffffff);
//pointLight.position.set(0,0,0)
scene.add(ambientLight/*,pointLight*/);

//Add Mouse Detection
const raycaster = new Three.Raycaster();
const mouse = new Three.Vector2();

function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

//Grid Helpers & Orbit Controls
const gridHelper = new Three.GridHelper(200,50)
//scene.add(gridHelper);
//const lightHelper = new Three.PointLightHelper(pointLight);
//scene.add(lightHelper)
const controls = new OrbitControls(camera, renderer.domElement);


//Create Icosahedron Shape name
var geometry = new Three.IcosahedronGeometry(5,1);
geometry.name = "name"
var material = new Three.MeshPhongMaterial({color:0x8c57ff, wireframe: true})
const shape = new Three.Mesh(geometry,material)
shape.position.set(0,30,0)
scene.add(shape)

//Create Icosahedron Shape fuchsia
var geometry = new Three.IcosahedronGeometry(6,1);
geometry.name = "fuchsia"
var material = new Three.MeshPhongMaterial({color:0xbb42fc, wireframe: true})
const shape2 = new Three.Mesh(geometry,material)
shape2.position.set(20,30,10)
scene.add(shape2)

//Create Icosahedron Shape techone
var geometry = new Three.IcosahedronGeometry(4,1);
geometry.name = "techone"
var material = new Three.MeshPhongMaterial({color:0x47ff63, wireframe: true})
const shape3 = new Three.Mesh(geometry,material)
shape3.position.set(-10,45,-10)
scene.add(shape3)

//Create Icosahedron Shape contact
var geometry = new Three.IcosahedronGeometry(5,1);
geometry.name = "contact"
var material = new Three.MeshPhongMaterial({color:0x44b0fc, wireframe: true})
const shape4 = new Three.Mesh(geometry,material)
shape4.position.set(-15,30,10)
scene.add(shape4)

//Add Particles
function addParticles() {
  const geometry = new Three.SphereGeometry(0.05,24,24);
  const material = new Three.MeshBasicMaterial({color: 0xfffdc9});
  const particle = new Three.Mesh(geometry,material);
  const [x,y,z] = Array(3).fill().map(() => Three.MathUtils.randFloatSpread(100));
  particle.position.set(x,y,z);
  scene.add(particle)
}
Array(1000).fill().forEach(addParticles)

//Variables for mouse detection
var IntersectedObject;
var interval;
var i = 0;
function renderScene() {
  requestAnimationFrame(renderScene);
  renderer.render(scene,camera)
  //Move Light Around
  //pointLight.position.set(camera.position.x,camera.position.y,camera.position.z)
  //Orbit Camera
  //camera.translateX(0.02)
  //camera.rotateY(0.02)
  //Helper Controls
  controls.update();
  controls.enablePan = true;
  controls.enableZoom = true;

  // update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );
	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );
	if ( intersects.length > 0 ) {
    if (IntersectedObject != intersects[0].object ) {
      
      if (IntersectedObject) {
        IntersectedObject.material.emissive.setHex( IntersectedObject.currentHex || 0);
      }

      i=0;
      IntersectedObject = intersects[0].object;
      switch(IntersectedObject.geometry.name) {
        case 'name':
          clearInterval(interval)
          break;
        case 'contact':
          clearInterval(interval)
          break;
        case 'fuchsia':
          clearInterval(interval)
          break;
        case 'techone':
          clearInterval(interval)
          break;
        default:
          break;
      }
      if(IntersectedObject.geometry.name != '') IntersectedObject.currentHex = IntersectedObject.material.emissive.getHex();
      if(IntersectedObject.geometry.name != '') IntersectedObject.material.emissive.setHex(0xff0000);
      if(IntersectedObject.geometry.name != '') interval = setInterval(() => {
        i+=1;
        IntersectedObject.rotateY(0.01);
        if(i<20) {IntersectedObject.scale.set(1+i/100,1+i/100,1+i/100)};
      },10)
      
    }
  } else {
    if (IntersectedObject) if(IntersectedObject.material.emissive) {
      clearInterval(interval)
      IntersectedObject.scale.set(1,1,1)
      IntersectedObject.material.emissive.setHex( IntersectedObject.currentHex || 0);
      
    }
    IntersectedObject = null;
  }
}
window.addEventListener('click', onclick, true);
window.addEventListener( 'mousemove', onMouseMove, false );
renderScene();