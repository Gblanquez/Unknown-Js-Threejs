import './styles/style.css'
import SplitType from 'split-type'
import * as THREE from 'three'
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import './anime.js'
import { TextureLoader } from 'three';
import flagVertex from './shaders/flagvertex.glsl'
import flagFragment from './shaders/flagfragment.glsl'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
gsap.registerPlugin(ScrollTrigger);




// Canvas
const canvas = document.querySelector('canvas.webgl')


//Fog
const fogColor = new THREE.Color('white')

//Bloom Params

const params = {
    exposure: 1,
    bloomStrength: 1.5,
    bloomThreshold: 0,
    bloomRadius: 0
};

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('#090909');
scene.fog = new THREE.Fog( fogColor, 0.0, 300)


let composer;
const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );

bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;



//Smoke Texture

// const smokeTexture = new THREE.TextureLoader().load('https://uploads-ssl.webflow.com/63bede65c490b3fd222e07c7/64053d0700b83da58c37a711_Smoke15Frames%20(1).png')
// smokeTexture.encoding = THREE.sRGBEncoding;
// const smokeGeometry = new THREE.PlaneGeometry(300, 300);


// const smokeMaterial = new THREE.MeshLambertMaterial({
//     map: smokeTexture,
//     emissive: '0x222222',
//     opacity: 0.06,
//     transparent: true
// })

// let smokeParticles = [];

// for (let i = 0; i < 400; i++) {
//     let smokeElement = new THREE.Mesh(smokeGeometry, smokeMaterial);
//     smokeElement.scale.set(1, 1, 1);

//     smokeElement.position.set(Math.random() * 1000 - 100, Math.random() * 1000 - 100, Math.random() * 1000 - 100);
//     smokeElement.rotation.z = Math.random() * 360;

//     scene.add(smokeElement);
//     smokeParticles.push(smokeElement);

// }





//geometry

// const geometry = new THREE.BoxGeometry(0.5, 0.5, 1);
// const material = new THREE.MeshNormalMaterial()
// const cube = new THREE.Mesh(geometry, material);


// scene.add(cube);

//Barba


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
const particlesCount = 4500
const positions = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount; i++) 
{
    positions [ i * 3 + 0] = (Math.random() - 0.5 ) * 10
    positions [ i * 3 + 1] = ( Math.random() - 0.5) * 10
    positions [ i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const textureLoader = new THREE.TextureLoader()

const particleTexture = textureLoader.load('https://uploads-ssl.webflow.com/63bede65c490b3fd222e07c7/642595a6660d050328795813_circle_05.png')


const particlesMaterial = new THREE.PointsMaterial({
    color: new THREE.Color('white'),
    sizeAttenuation: true,
    transparent: true,
    size: 0.02
})


particlesMaterial.encoding = THREE.sRGBEncoding;
particlesMaterial.alphaMap = particleTexture
particlesMaterial.alphaTest = 0.12
particleMaterial.depthTest = false

const globalParticles = new THREE.Points(particlesGeometry, particlesMaterial)

scene.add(globalParticles)


///

//Smoke Partciles
const smokeParticlesCount = 300
const smokePositions = new Float32Array(smokeParticlesCount * 3)

for (let i = 0; i < smokeParticlesCount; i++) 
{
    smokePositions [ i * 3 + 0] = (Math.random() - 0.5 ) * 10
    smokePositions [ i * 3 + 1] = ( Math.random() - 0.5) * 10
    smokePositions [ i * 3 + 2] = (Math.random() - 0.5) * 10
}

const smokeGeometryTwo = new THREE.BufferGeometry()

smokeGeometryTwo.setAttribute('position', new THREE.BufferAttribute(smokePositions, 3))



const smokeTextureTwo = textureLoader.load('https://uploads-ssl.webflow.com/63bede65c490b3fd222e07c7/642595a7547f3ac4cedee972_smoke_04.png')


const smokesMaterial = new THREE.PointsMaterial({
    color: new THREE.Color('white'),
    sizeAttenuation: true,
    transparent: true,
    size: 10
})

smokesMaterial.opacity = 0.5
smokesMaterial.encoding = THREE.sRGBEncoding;
smokesMaterial.alphaMap = smokeTextureTwo
smokesMaterial.alphaTest = 0.12
smokesMaterial.depthTest = false

const smokeParticlesTwo = new THREE.Points(smokeGeometryTwo, smokesMaterial)



// scene.add(smokeParticlesTwo)


//Unknown Title

const flagTexture2 = textureLoader.load('https://uploads-ssl.webflow.com/63bede65c490b3fd222e07c7/6441c32e9b635636e54195fb_White%20PNG%20High%20Res.png');

const flagGeometry = new THREE.PlaneGeometry(1.9, 0.8, 150, 150)
const flagMaterial = new THREE.ShaderMaterial({
    vertexShader: flagVertex,
    fragmentShader: flagFragment,
    transparent: true,
    uniforms: 
    {
        uFrequency: { value: new THREE.Vector2(10, 5) },
        uTime: { value: 0 },
        uTexture: { value: flagTexture2 }
    }
});
const flag = new THREE.Mesh(flagGeometry, flagMaterial);




// scene.add(flag);


//Unkown Title End








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
const camera = new THREE.PerspectiveCamera(86, sizes.width / sizes.height, 0.1, 1000)
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


//Update Bloom Pass

const renderScene = new RenderPass( scene, camera );
const pointLight = new THREE.PointLight( '#963131' , 1 );
scene.add( pointLight );

composer = new EffectComposer( renderer );
composer.addPass( renderScene );
composer.addPass( bloomPass );

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

    //Animate Particles
    globalParticles.rotation.y = elapsedTime * 0.04;

    //

    cameraGroup.position.x += (parallexX - cameraGroup.position.x) * 3 * deltaTime
    cameraGroup.position.y += (parallexY - cameraGroup.position.y) * 3 * deltaTime

    //Animate SMoke
    // for (let i = 0; i < smokeParticles.length; i++){
    //     smokeParticles[i].rotation.z += (deltaTime * 0.09);
    // }



    //Update Particles
    // waterMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}








tick()