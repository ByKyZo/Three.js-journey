import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 400 });

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Galaxy
 */

const parameters = {
    generate: () => {
        generateGalaxy();
    },
    count: 100000,
    size: 0.001,
    radius: 3,
    branches: 12,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 5,
    insideColor: '#ff6030',
    outsideColor: '#1b3984',
};

let particleGeometry, particleMaterial, particle, planet, sunLight, ambientLight;

console.log(particleGeometry, particleMaterial, particle);

const generateGalaxy = () => {
    /**
     * Destroy old galaxy
     */
    if (particle) {
        particleGeometry.dispose();
        particleMaterial.dispose();
        scene.remove(planet);
        scene.remove(particle);
        scene.remove(ambientLight);
    }

    sunLight = new THREE.PointLight('white', 0.6, 100);
    sunLight.position.y = 3;
    sunLight.position.x = 3;
    scene.add(sunLight);

    ambientLight = new THREE.AmbientLight('white', 0.4);

    scene.add(ambientLight);

    planet = new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32),
        // new THREE.MeshStandardMaterial({ transparent: true, side: THREE.DoubleSide  })
        new THREE.MeshStandardMaterial({
            transparent: true,
            side: THREE.DoubleSide,
            shininess: 10,
            emissive: 10,
            roughness: 0.65,
            metalness: 0.2,
        })
    );
    planet.add(sunLight);
    scene.add(planet);

    particleGeometry = new THREE.BufferGeometry();

    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);
    console.log(parameters.insideColor);
    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        const radius = Math.random() * parameters.radius + 1.2;
        const spinAngle = radius * parameters.spin;
        const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

        const randomX =
            Math.pow(Math.random(), parameters.randomnessPower) *
            (Math.random() < 0.5 ? 1 : -1) *
            parameters.randomness *
            radius;
        const randomY =
            Math.pow(Math.random(), parameters.randomnessPower) *
            (Math.random() < 0.5 ? 1 : -1) *
            parameters.randomness *
            radius;
        const randomZ =
            Math.pow(Math.random(), parameters.randomnessPower) *
            (Math.random() < 0.5 ? 1 : -1) *
            parameters.randomness *
            radius;

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX; // x
        positions[i3 + 1] = randomY; // y
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ; // z

        const insideColor = new THREE.Color(parameters.insideColor);
        const outsideColor = new THREE.Color(parameters.outsideColor);

        const mixedColor = insideColor.clone();
        mixedColor.lerp(outsideColor, radius / parameters.radius);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;

        /**
         * Rosace
         */
        // positions[i3] = Math.cos(i * 0.4) * parameters.radius * Math.abs(Math.tan(Math.sin(i))); // x
        // positions[i3 + 1] = 0; // y
        // positions[i3 + 2] = Math.sin(i * 0.4) * parameters.radius * Math.abs(Math.tan(Math.sin(i))); // z
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    particleMaterial = new THREE.PointsMaterial({
        size: parameters.size,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        blendSrcAlpha: 0.01,
        vertexColors: true,
    });

    particle = new THREE.Points(particleGeometry, particleMaterial);

    scene.add(particle);
};

generateGalaxy();

/**
 * Tweaks
 */
gui.add(parameters, 'generate');
gui.add(parameters, 'count').min(100).max(1000000).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy);
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomness').min(0).max(5).step(0.001).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy);
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);

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
camera.position.x = 3;
camera.position.y = 3;
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

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    particle.rotation.y = elapsedTime * 0.1;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
