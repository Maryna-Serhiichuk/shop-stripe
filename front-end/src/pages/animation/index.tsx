import { FC } from "react";
import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
// 
// const controls = new OrbitControls( camera, renderer.domElement );
// const loader = new GLTFLoader();

// import WebGL from 'three/addons/capabilities/WebGL.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const points = [];
points.push( new THREE.Vector3( - 10, 0, 0 ) );
points.push( new THREE.Vector3( 0, 10, 0 ) );
points.push( new THREE.Vector3( 10, 0, 0 ) );

const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

const line = new THREE.Line( geometry, material );
scene.add( line );
renderer.render( scene, camera );

function animate() {

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );
}


const Animation: FC = () => {

    // if ( WebGL.isWebGL2Available() ) {

    //     // Initiate function or other initializations here
    //     animate();
    
    // } else {
    
    //     const warning = WebGL.getWebGL2ErrorMessage();
    //     document.getElementById( 'container' ).appendChild( warning );
    
    // }

    return <div id="info" style={{
        position: 'absolute',
        top: 10,
        width: '100%',
        textAlign: 'center',
        zIndex: 100,
        display: 'block'
    }}>Description</div>
}

export default Animation