import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader().setPath('textures/particles/');

const particleTexture = textureLoader.load('11.png');

/**
 * Particles
 */

const geometry = new THREE.BufferGeometry();

const count = 20000;

const vertices = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < 3 * count; i++) {
    vertices[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
}

geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particleMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    transparent: true,
    alphaMap: particleTexture,
    vertexColors: true,
    /**
     * Technique pour rendre le fond d'une texture transparente
     */
    // alphaTest: 0.001,
    // depthTest: false,
    depthWrite: false,
});
gui.add(particleMaterial, 'sizeAttenuation');

const particle = new THREE.Points(geometry, particleMaterial);

scene.add(particle);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
console.log(particle.geometry.attributes.position.array);

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    particle.geometry.attributes.position.array.forEach((vertice, index) => {
        const i3 = index * 3;
        const xPos = particle.geometry.attributes.position.array[i3];
        particle.geometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + xPos);
    });
    particle.geometry.attributes.position.needsUpdate = true;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
