import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader().setPath('/textures/');
const bakedShadowTexture = textureLoader.load('bakedShadow.jpg');
const simpleShadowTexture = textureLoader.load('simpleShadow.jpg');

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
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight.position.set(2, 2, -1);
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001);
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001);
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001);
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001);
gui.add(directionalLight, 'visible').name('directionalLight');
scene.add(directionalLight);

directionalLight.castShadow = true;
const shadowPow = 10;
console.log('Shadow map size : ', Math.pow(2, shadowPow));
directionalLight.shadow.mapSize.width = Math.pow(2, shadowPow);
directionalLight.shadow.mapSize.height = Math.pow(2, shadowPow);
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 4.5;

directionalLight.shadow.camera.top = 1;
directionalLight.shadow.camera.right = 1;
directionalLight.shadow.camera.bottom = -1;
directionalLight.shadow.camera.left = -1;

directionalLight.shadow.radius = 10;

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(directionalLightCameraHelper);
directionalLightCameraHelper.visible = false;
gui.add(directionalLightCameraHelper, 'visible').name('directionalLightCameraHelper');

// Spotlight
const spotLight = new THREE.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.3);
spotLight.castShadow = true;
spotLight.position.set(0, 2, 2);
spotLight.shadow.mapSize.width = Math.pow(2, shadowPow);
spotLight.shadow.mapSize.height = Math.pow(2, shadowPow);
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;
spotLight.shadow.camera.fov = 30;
gui.add(spotLight, 'visible').name('spotLight');

scene.add(spotLight);
scene.add(spotLight.target);

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(spotLightCameraHelper);
spotLightCameraHelper.visible = false;
gui.add(spotLightCameraHelper, 'visible').name('spotLightCameraHelper');

// Point light
const pointLight = new THREE.PointLight(0xffffff, 0.3);
gui.add(pointLight, 'visible').name('pointLight');

pointLight.shadow.mapSize.width = Math.pow(2, shadowPow);
pointLight.shadow.mapSize.height = Math.pow(2, shadowPow);
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;
pointLight.castShadow = true;
pointLight.position.set(-1, 1, 0);
scene.add(pointLight);

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(pointLightCameraHelper);
pointLightCameraHelper.visible = false;
gui.add(pointLightCameraHelper, 'visible').name('pointLightCameraHelper');

/**
 * Materials
 */

const material = new THREE.MeshStandardMaterial();

material.roughness = 0.7;
gui.add(material, 'metalness').min(0).max(1).step(0.001);
gui.add(material, 'roughness').min(0).max(1).step(0.001);

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.castShadow = true;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;

plane.receiveShadow = true;

scene.add(sphere, plane);

const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadowTexture,
    })
    // new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
// sphereShadow.scale.set(3, 3, 3);
sphereShadow.rotation.x = -Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.001;

scene.add(sphereShadow);
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
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update sphere
    sphere.position.x = Math.sin(elapsedTime) * 1.5;
    sphere.position.z = Math.cos(elapsedTime) * 1.5;
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 6));

    // Update sphere shadow
    sphereShadow.position.x = sphere.position.x;
    sphereShadow.position.z = sphere.position.z;
    sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
