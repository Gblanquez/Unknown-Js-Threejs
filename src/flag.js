import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import flagVertex from './shaders/flagvertex.glsl'
import flagFragment from './shaders/flagfragment.glsl'

// Canvas
const canvas2 = document.querySelector('canvas.webgl2')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('#090909');


//flag loader
const textureLoader = new THREE.TextureLoader();

const flagTexture = textureLoader.load('https://uploads-ssl.webflow.com/63bede65c490b3fd222e07c7/63ff9df3b911b7c0e8a75152_flag1.jpg');
const flagTexture2 = textureLoader.load('https://uploads-ssl.webflow.com/63bede65c490b3fd222e07c7/63c56485a9b6a0490089e8a6_unknown-group.jpg');





//geometry

const geometry = new THREE.PlaneGeometry(1, 1, 30, 30)
const material = new THREE.ShaderMaterial({
    vertexShader: flagVertex,
    fragmentShader: flagFragment,
    uniforms: 
    {
        uFrequency: { value: new THREE.Vector2(10, 5) },
        uTime: { value: 0 },
        uColor: {value: new THREE.Color('orange') },
        uTexture: { value: flagTexture2 }
    }
});
const flag = new THREE.Mesh(geometry, material);

flag.scale.y = 2 / 3
flag.position.y = 0.2
flag.position.x = - 0.1


scene.add(flag);



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}




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



/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 2000)
camera.position.set(0, 0, 1)
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas2)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({canvas: canvas2});
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor( 0x000000, 0);


scene.background = null;

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()


    //Update Particles
    // waterMaterial.uniforms.uTime.value = elapsedTime

    //Update Texture

    material.uniforms.uTime.value = elapsedTime * 0.2;


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


export default flag;