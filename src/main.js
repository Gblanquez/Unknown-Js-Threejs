import './styles/style.css'
import SplitType from 'split-type'
import * as THREE from 'three'
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import './flag.js'
import barba from '@barba/core';
gsap.registerPlugin(ScrollTrigger);




// Canvas
const canvas = document.querySelector('canvas.webgl')


//Fog
const fogColor = new THREE.Color('white')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('#090909');
scene.fog = new THREE.Fog( fogColor, 0.01, 20)





//Light 1
const lightOne = new THREE.HemisphereLight('0xd6e6ff', '0xa38c08', 1);
scene.add(lightOne);


//Smoke Texture

const smokeTexture = new THREE.TextureLoader().load('https://uploads-ssl.webflow.com/63bede65c490b3fd222e07c7/64053d0700b83da58c37a711_Smoke15Frames%20(1).png')
smokeTexture.encoding = THREE.sRGBEncoding;
const smokeGeometry = new THREE.PlaneGeometry(300, 300);


const smokeMaterial = new THREE.MeshLambertMaterial({
    map: smokeTexture,
    emissive: '0x222222',
    opacity: 0.15,
    transparent: true
})

let smokeParticles = [];

for (let i = 0; i < 150; i++) {
    let smokeElement = new THREE.Mesh(smokeGeometry, smokeMaterial);
    smokeElement.scale.set(1, 1, 1);

    smokeElement.position.set(Math.random() * 1000 - 100, Math.random() * 1000 - 100, Math.random() * 1000 - 100);
    smokeElement.rotation.z = Math.random() * 360;

    scene.add(smokeElement);
    smokeParticles.push(smokeElement);

}



//geometry

// const geometry = new THREE.BoxGeometry(0.5, 0.5, 1);
// const material = new THREE.MeshNormalMaterial()
// const cube = new THREE.Mesh(geometry, material);


// scene.add(cube);


// Particles

const ParticlesGroup = new THREE.Group()

const particleGeometry = new THREE.SphereGeometry(1, 200, 200)
const particleMaterial = new THREE.PointsMaterial({
    size: 0.001,
    sizeAttenuation: true
})

const particleMesh = new THREE.Points(particleGeometry, particleMaterial)

ParticlesGroup.add(particleMesh)
scene.add(ParticlesGroup)





/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


//Global Particles
const objectDistance = 4
const particlesCount = 2000
const positions = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount; i++) 
{
    positions [ i * 3 + 0] = (Math.random() - 0.5 ) * 10
    positions [ i * 3 + 1] = ( Math.random() - 0.5) * 10
    positions [ i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))


const particlesmaterial = new THREE.PointsMaterial({
    color: new THREE.Color('white'),
    sizeAttenuation: true,
    size: 0.001
})

const globalParticles = new THREE.Points(particlesGeometry, particlesmaterial)

scene.add(globalParticles)




window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})



//Camera Group
const cameraGroup = new THREE.Group()

scene.add(cameraGroup)



/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(1, 1, 3)
cameraGroup.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


//Cursor Movement

const cursor = {}

cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => 
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})




/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    //Animate Camera

    const parallexX = cursor.x * 0.5
    const parallexY = - cursor.y * 0.5


    cameraGroup.position.x += (parallexX - cameraGroup.position.x) * 3 * deltaTime
    cameraGroup.position.y += (parallexY - cameraGroup.position.y) * 3 * deltaTime

    //Animate SMoke
    for (let i = 0; i < smokeParticles.length; i++){
        smokeParticles[i].rotation.z += (deltaTime * 0.09);
    }



    //Update Particles
    // waterMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}


//Barba Js

// function resetWebflow(data) {
//     let parser = new DOMParser();
//     let dom = parser.parseFromString(data.next.html, "text/html");
//     let webflowPageId = $(dom).find("html").attr("data-wf-page");
//     $("html").attr("data-wf-page", webflowPageId);
//     window.Webflow && window.Webflow.destroy();
//     window.Webflow && window.Webflow.ready();
//     window.Webflow && window.Webflow.require("ix2").init();
//   }





// barba.init();



tick()