import './style.css'
import * as Three from 'three'
import fontJson from './font.json'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();


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
camera.position.setZ(28);
camera.position.setY(16);
camera.position.setX(4)

loader.load( './models/earth.gltf', function ( gltf ) {
  gltf.scene.scale.set(.1,.1,.1)
  

	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );


//Lighting
const ambientLight = new Three.AmbientLight(0xffffff);
const pointLight = new Three.PointLight(0xffffff);
pointLight.position.set(0,0,0)
scene.add(ambientLight/*,pointLight*/);

//Add Mouse Detection
const raycaster = new Three.Raycaster();
const mouse = new Three.Vector2();
var mouseTolerance = 0.01;

function onMouseMove( event ) {
  

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
  var centerX = window.innerWidth * 0.5;
  var centerY = window.innerHeight * 0.5;

  camera.position.x = (event.clientX - centerX) * mouseTolerance;
  camera.position.y = (event.clientY - centerY) * mouseTolerance;
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

//Grid Helpers & Orbit Controls
const gridHelper = new Three.GridHelper(200,50)
//scene.add(gridHelper);
//const lightHelper = new Three.PointLightHelper(pointLight);
//scene.add(lightHelper)
const controls = new OrbitControls(camera, renderer.domElement);

/*
//Create Icosahedron Shape name
var geometry = new Three.IcosahedronGeometry(5,1);
geometry.name = "name"
var material = new Three.MeshPhongMaterial({color:0x8c57ff, wireframe: true})
const shape = new Three.Mesh(geometry,material)
shape.position.set(0,0,0)
scene.add(shape)

//Create Icosahedron Shape fuchsia
var geometry = new Three.IcosahedronGeometry(6,1);
geometry.name = "fuchsia"
var material = new Three.MeshPhongMaterial({color:0xff6666, wireframe: true})
const shape2 = new Three.Mesh(geometry,material)
shape2.position.set(15,-5,10)
scene.add(shape2)

//Create Icosahedron Shape techone
var geometry = new Three.IcosahedronGeometry(4,1);
geometry.name = "techone"
var material = new Three.MeshPhongMaterial({color:0x47ff63, wireframe: true})
const shape3 = new Three.Mesh(geometry,material)
shape3.position.set(-10,5,-10)
scene.add(shape3)

//Create Icosahedron Shape contact
var geometry = new Three.IcosahedronGeometry(5,1);
geometry.name = "contact"
var material = new Three.MeshPhongMaterial({color:0x44b0fc, wireframe: true})
const shape4 = new Three.Mesh(geometry,material)
shape4.position.set(-15,0,10)
scene.add(shape4)

//Create Icosahedron Shape github
var geometry = new Three.IcosahedronGeometry(5,1);
geometry.name = "github"
var material = new Three.MeshPhongMaterial({color:0x878787, wireframe: true})
const shape5 = new Three.Mesh(geometry,material)
shape5.position.set(15,10,-10)
scene.add(shape5)

var shapeList = [shape,shape2,shape3,shape4,shape5]*/

//Add Particles
function addParticles() {
  const geometry = new Three.SphereGeometry(0.05,24,24);
  const material = new Three.MeshBasicMaterial({color: 0xfff3c9});
  const particle = new Three.Mesh(geometry,material);
  const [x,y,z] = Array(3).fill().map(() => Three.MathUtils.randFloatSpread(100));
  particle.position.set(x,y,z);
  scene.add(particle)
  return particle
}
var stars = []

for(var i = 0; i<2000; i++) {
  var s = addParticles()
  stars.push(s)
}

//Variables for mouse detection
var IntersectedObject;
var interval;
var i = 0;
var textName,textContact

function renderScene() {
  requestAnimationFrame(renderScene);
  renderer.render(scene,camera)
  //Move Light Around
  pointLight.position.set(camera.position.x,camera.position.y,camera.position.z)
  //Orbit Camera
  //camera.translateX(0.02)
  //camera.rotateY(0.02)
  //Helper Controls
  controls.update();
  controls.enabled = false;

  /*/rotate planets
  shape.rotateY(0.002)
  shape2.rotateY(0.002)
  shape3.rotateY(0.002)
  shape4.rotateY(0.002)
  shape5.rotateY(0.002)*/

  //rotate stars
  stars.forEach(star => {
    //star.rotateY(0.002)
    star.translateZ(0.05)
    if(star.position.z  > 50) star.translateZ(-100)
  })

  function createText(text,color) {
    const font = new Three.Font(fontJson)
    var geometry = new Three.TextGeometry(text,{
      font:font,
      size: 1,
      height: 1,
      curveSegments: 12,
      bevelEnabled: false,
      bevelThickness: 10,
      bevelSize: 8,
      bevelOffset: 0,
      bevelSegments: 5
    })
    var material = new Three.MeshPhongMaterial({color:color, wireframe: true})
    var texts = new Three.Mesh(geometry,material)
    return texts
  }
  
  //Make all text face camera
  
    
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
          //if(!textName) textName = createText("james xu",0x8c57ff),textName.position.set(6,3,0),scene.add(textName)
          shapeList.forEach(shape => {if(shape.geometry.name != IntersectedObject.geometry.name) shape.scale.set(1,1,1),clearInterval(interval)})
          break;
        case 'contact':
          //if(!textContact) textContact = createText("james@jamesxu.dev",0x8c57ff),textContact.position.set(-15,0,10),scene.add(textContact)
          shapeList.forEach(shape => {if(shape.geometry.name != IntersectedObject.geometry.name) shape.scale.set(1,1,1),clearInterval(interval)})
          break;
        case 'fuchsia':
          shapeList.forEach(shape => {if(shape.geometry.name != IntersectedObject.geometry.name) shape.scale.set(1,1,1),clearInterval(interval)})
          break;
        case 'techone':
          shapeList.forEach(shape => {if(shape.geometry.name != IntersectedObject.geometry.name) shape.scale.set(1,1,1),clearInterval(interval)})
          
          break;
        case 'github':
          shapeList.forEach(shape => {if(shape.geometry.name != IntersectedObject.geometry.name) shape.scale.set(1,1,1),clearInterval(interval)})
          break;
        default:
          break;
      }
      
      if(IntersectedObject.geometry.name != '') IntersectedObject.currentHex = IntersectedObject.material.emissive.getHex();
      if(IntersectedObject.geometry.name != '') IntersectedObject.material.emissive.setHex(0xff0000);
      if(IntersectedObject.geometry.name != '') interval = setInterval(() => {
        i+=1;
        IntersectedObject.rotateY(-0.01);
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


