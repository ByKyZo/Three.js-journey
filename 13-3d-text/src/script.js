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

// Axes helper
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader().setPath('/textures/matcaps/');
const matcapTexture = textureLoader.load('8.png');

/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader();

let donuts = [];

fontLoader.load('fonts/helvetiker_regular.typeface.json', (font) => {
    // Text options
    const textOptions = {
        font: font,
        size: 2,
        height: 0.8,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4,
    };
    // Geometry
    const textNameGeometry = new THREE.TextGeometry('Alexis', textOptions);
    const textLastNameGeometry = new THREE.TextGeometry('Robert', textOptions);

    // Material
    const material = new THREE.MeshMatcapMaterial({
        matcap: matcapTexture,
    });

    // Mesh
    const textName = new THREE.Mesh(textNameGeometry, material);
    const textLastName = new THREE.Mesh(textLastNameGeometry, material);

    // Set position of last name
    textNameGeometry.computeBoundingBox();
    const textNameBounds = textNameGeometry.boundingBox;
    textLastName.position.y = -textNameBounds.max.y * 1.2;

    // Center name
    textNameGeometry.center();
    textLastNameGeometry.center();

    // Add to scene
    scene.add(textName, textLastName);

    const donutGeomety = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

    const multiplier = 50;

    // Generate donuts
    for (let i = 0; i < 2000; i++) {
        const donut = new THREE.Mesh(donutGeomety, material);
        donut.position.x = (Math.random() - 0.5) * multiplier;
        donut.position.y = (Math.random() - 0.5) * multiplier;
        donut.position.z = (Math.random() - 0.5) * multiplier;

        donut.rotation.x = Math.random() * Math.PI;
        donut.rotation.y = Math.random() * Math.PI;

        const randomScale = Math.random() + 0.4;

        donut.scale.set(randomScale, randomScale, randomScale);

        donuts.push({
            item: donut,
            y: donut.position.y,
            x: donut.position.x,
            speed: Math.random() + 0.1,
        });
        scene.add(donut);
    }
});

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    donuts.forEach((donut) => {
        donut.item.rotation.x = donut.speed * elapsedTime;
        donut.item.rotation.y = donut.speed * elapsedTime;

        donut.item.position.y = donut.y + Math.cos(elapsedTime * donut.speed) * 0.6;
        donut.item.position.x = donut.x + Math.cos(elapsedTime * donut.speed) * 0.2;
    });

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
