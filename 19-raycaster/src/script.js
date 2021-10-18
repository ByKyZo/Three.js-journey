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
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
);
object1.userData = {
    sentence: 'Hello from object1',
};
object1.position.x = -2;

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
);
object2.userData = {
    sentence: 'Hello from object2',
};

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
);
object3.userData = {
    sentence: 'Hello from object3',
};
object3.position.x = 2;

scene.add(object1, object2, object3);

/**
 * Raycaster
 */

const raycaster = new THREE.Raycaster();

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
 * Mouse
 */

const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (e) => {
    // const mouseX = -(window.innerWidth / 2 - e.clientX) / (window.innerWidth / 2);
    // const mouseY = (window.innerHeight / 2 - e.clientY) / (window.innerHeight / 2);
    mouse.x = (e.clientX / sizes.width) * 2 - 1;
    mouse.y = -(e.clientY / sizes.height) * 2 + 1;
});

window.addEventListener('click', (e) => {
    if (currentIntersect) {
        console.log(currentIntersect.object.userData.sentence);
    }
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

let currentIntersect = null;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    raycaster.setFromCamera(mouse, camera);

    // const raycasterOrigin = new THREE.Vector3(mouse.x, mouse.y, 0);
    // const raycasterOrigin = new THREE.Vector3(0, 0, 0);
    // const raycasterDirection = new THREE.Vector3(0, 0, -1);
    // raycasterDirection.normalize();
    // raycaster.set(raycasterOrigin, raycasterDirection);

    const objectToTest = [object1, object2, object3];
    const intersects = raycaster.intersectObjects(objectToTest);

    if (intersects.length) {
        if (!currentIntersect) {
            console.log('mouse enter');
            currentIntersect = intersects[0];
        }
    } else {
        if (currentIntersect) {
            console.log('mouse leave');
            currentIntersect = intersects[0];
        }
        currentIntersect = null;
    }

    objectToTest.forEach((object) => object.material.color.set('red'));

    intersects.forEach((intersect) => intersect.object.material.color.set('blue'));

    // Cast a ray
    // const raycasterOrigin = new THREE.Vector3(-3, 0, 0);
    // const raycasterDirection = new THREE.Vector3(1, 0, 0);
    // raycasterDirection.normalize();
    // raycaster.set(raycasterOrigin, raycasterDirection);

    // const objectToTest = [object1, object2, object3];
    // const intersects = raycaster.intersectObjects(objectToTest);

    // objectToTest.forEach((object) => object.material.color.set('red'));

    // intersects.forEach((intersect) => intersect.object.material.color.set('blue'));

    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
